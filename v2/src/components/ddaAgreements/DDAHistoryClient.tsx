"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/apiService/apiService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import styles from "./ddaAgreements.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { getStatus } from "@/utils/dda";
import { EyeIcon, SignatureIcon } from "@phosphor-icons/react";
import ViewDDAgreementModalInner from "@/components/DataSources/ViewDDAgreementModalInner";
import { useGetDataSourceList } from "@/custom-hooks/dataSources";
import { defaultLogoImg, defaultCoverImage } from "@/constants/defalultImages";

type HistoryRow = {
  recordId?: string;
  purpose?: string;
  version?: string;
  event?: string;
  dataSourceSignature?: string;
  dataUsingServiceSignature?: string;
  // kept for potential future use
  status?: string;
  isLatestVersion?: boolean;
  updatedAt?: string;
  createdAt?: string;
  revisionId?: string;
  revisionHash?: string;
  lawfulBasis?: string;
  optIn?: boolean;
};

export default function DDAHistoryClient({ id }: { id: string }) {
  const t = useTranslations();
  const [openView, setOpenView] = React.useState(false);
  const [selected, setSelected] = React.useState<any | null>(null);
  const [copied, setCopied] = React.useState<{ key: string | null }>({ key: null });

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ key });
      window.setTimeout(() => setCopied({ key: null }), 1200);
    } catch {}
  };

  const tryGet = (obj: Record<string, unknown> | null | undefined, path: string[]): any => {
    let cur: any = obj;
    for (const k of path) {
      if (!cur || typeof cur !== 'object') return undefined;
      cur = cur[k];
    }
    return cur;
  };

  const transformForModal = (raw: unknown): any => {
    const o = isObj(raw) ? raw : {};
    const snapshotStr = (o["serializedSnapshot"] || o["snapshot"] || o["objectData"] ||
      (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["serializedSnapshot"]) ||
      (isObj(o["dataDisclosureAgreement"]) && (o["dataDisclosureAgreement"] as Record<string, unknown>)["serializedSnapshot"])) as string | undefined;
    const snap = tryParseJSON(snapshotStr) || {};

    // Extract from snapshot first, then from object
    const obj: any = {
      purpose: (snap["purpose"] || o["purpose"]) as string | undefined,
      purposeDescription: (snap["purposeDescription"] || snap["description"] || (o as any)["purposeDescription"] || (o as any)["description"]) as string | undefined,
      templateId: (
        (o as any)?.dataDisclosureAgreementTemplateId ||
        snap?.templateId ||
        (snap as any)?.templateID ||
        (o as any)?.templateId || (o as any)?.templateID
      ) as string | undefined,
      version: (snap["version"] || snap["templateVersion"] || (o as any)["version"] || (o as any)["templateVersion"]) as string | undefined,
      lawfulBasis: (snap["lawfulBasis"] || (o as any)["lawfulBasis"]) as string | undefined,
      dataAttributes: Array.isArray((snap as any)?.dataAttributes) ? (snap as any).dataAttributes : undefined,
      personalData: Array.isArray((snap as any)?.personalData) ? (snap as any).personalData : [],
      dataController: (snap as any)?.dataController || (o as any)?.dataController || {},
      createdAt: (o as any)?.createdAt,
      updatedAt: (o as any)?.updatedAt,
    };
    return obj;
  };

  const { dataSourceItems } = useGetDataSourceList();
  const dataSources = dataSourceItems as unknown as any;
  const getDetails = React.useMemo(() => {
    return (sel: any) => {
      const defaults = {
        coverImage: defaultCoverImage,
        logoImage: defaultLogoImg,
        dataSourceName: sel?.dataController?.name || '',
        dataSourceLocation: sel?.dataController?.industrySector || '',
        trusted: false,
      };
      if (!sel || !dataSources) return defaults;
      const list = Array.isArray(dataSources) ? dataSources : ('dataSources' in dataSources ? dataSources.dataSources : []);
      if (!Array.isArray(list) || list.length === 0) return defaults;
      const selTemplateId = sel?.templateId;
      for (const item of list) {
        if (!item?.dataSource) continue;
        const match = (item?.dataDisclosureAgreements || []).find((dda: any) => {
          const tId = dda?.templateId || dda?.dataAgreementId || dda?.["@id"]; 
          return selTemplateId && tId && String(tId) === String(selTemplateId);
        });
        if (match) {
          const computedTrusted = (typeof item.dataSource?.trusted === 'boolean')
            ? Boolean(item.dataSource.trusted)
            : (item?.verification?.presentationState === 'verified');
          return {
            coverImage: item.dataSource.coverImageUrl || defaultCoverImage,
            logoImage: item.dataSource.logoUrl || defaultLogoImg,
            dataSourceName: item.dataSource.name || sel?.dataController?.name || '',
            dataSourceLocation: item.dataSource.location || sel?.dataController?.industrySector || '',
            trusted: computedTrusted,
          };
        }
      }
      return defaults;
    };
  }, [dataSources]);

  const handleView = (raw: unknown) => {
    const sel = transformForModal(raw);
    setSelected(sel);
    setOpenView(true);
  };
  const cleanId = React.useMemo(() => {
    try {
      return decodeURIComponent(id);
    } catch {
      return id;
    }
  }, [id]);

  const canFetch = typeof cleanId === 'string' && cleanId.trim().length > 0 && cleanId !== 'undefined' && cleanId !== 'null';

  const { data, isLoading, isFetching, isSuccess, error } = useQuery<unknown[], Error>({
    queryKey: ["ddaHistory", cleanId],
    queryFn: async () => {
      let res: unknown = await apiService.getDDAHistory(cleanId);
      // If backend returned JSON as string, parse it
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch {}
      }
      const safeObj = (val: unknown): Record<string, unknown> | null => (val && typeof val === 'object') ? (val as Record<string, unknown>) : null;
      const tryParse = (val: unknown): unknown => {
        if (typeof val === 'string') {
          try { return JSON.parse(val); } catch { return val; }
        }
        return val;
      };
      const root = safeObj(res);
      const arrays: unknown[] = root ? [
        safeObj(root.history)?.items,
        safeObj(root.history)?.results,
        root?.["history"],
        root?.["revisions"],
        root?.["dataAgreementRevisions"],
        root?.["dataDisclosureAgreementRevisions"],
        root?.["data_disclosure_agreement_revisions"],
        safeObj(root?.["dataDisclosureAgreementHistory"])?.items,
        safeObj(root?.["data_disclosure_agreement_history"])?.items,
        root?.["dataDisclosureAgreementHistory"],
        root?.["data_disclosure_agreement_history"],
        safeObj(root?.["dataDisclosureAgreement"])?.revisions,
        root?.["items"],
        root?.["results"],
        root?.["data"],
        root,
      ] : [res];
      for (const candidate of arrays) {
        const parsed = tryParse(candidate);
        if (Array.isArray(parsed)) return parsed as unknown[];
        const obj = safeObj(parsed);
        if (obj) {
          for (const key of ["items", "results", "data"]) {
            const inner = tryParse(obj[key]);
            if (Array.isArray(inner)) return inner as unknown[];
          }
        }
      }
      // As a last resort, recursively search for the first array in the object
      const seen = new Set<unknown>();
      const findFirstArray = (obj: unknown, depth = 0): unknown[] | null => {
        if (!obj || depth > 8 || seen.has(obj)) return null;
        if (typeof obj === 'string') {
          const parsed = tryParse(obj);
          if (Array.isArray(parsed)) return parsed;
          if (parsed && typeof parsed === 'object') return findFirstArray(parsed, depth + 1);
          return null;
        }
        if (typeof obj !== 'object') return null;
        seen.add(obj);
        for (const key of Object.keys(obj as Record<string, unknown>)) {
          const val = (obj as Record<string, unknown>)[key];
          const parsedVal = tryParse(val);
          if (Array.isArray(parsedVal)) return parsedVal;
          if (parsedVal && typeof parsedVal === 'object') {
            const r = findFirstArray(val, depth + 1);
            if (r) return r;
          }
        }
        return null;
      };
      const fallback = findFirstArray(res);
      if (Array.isArray(fallback)) return fallback;
      return [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: canFetch,
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnMount: 'always',
  });

  const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

  const tryParseJSON = (str: unknown): Record<string, unknown> | null => {
    if (typeof str !== 'string') return null;
    try { return JSON.parse(str) as Record<string, unknown>; } catch { return null; }
  };

  const findNestedString = (obj: unknown, keyCandidates: string[], depth = 0): string | undefined => {
    if (!isObj(obj) || depth > 4) return undefined;
    for (const key of keyCandidates) {
      const v = obj[key];
      if (typeof v === 'string' && v) return v;
    }
    for (const v of Object.values(obj)) {
      if (typeof v === 'string') continue;
      const found = findNestedString(v, keyCandidates, depth + 1);
      if (found) return found;
    }
    return undefined;
  };

  const findSignatureString = (obj: unknown, containerKey: 'dataSourceSignature' | 'dataUsingServiceSignature'): string | undefined => {
    if (!isObj(obj)) return undefined;
    // direct container
    const cont = obj[containerKey];
    if (isObj(cont)) {
      const sig = cont["signature"];
      if (typeof sig === 'string' && sig) return sig;
    }
    // search recursively
    for (const v of Object.values(obj)) {
      const res = findSignatureString(v, containerKey);
      if (res) return res;
    }
    return undefined;
  };

  const normalize = (item: unknown): HistoryRow => {
    const o = isObj(item) ? item : {};
    // Try to find a snapshot (string or object) anywhere in the payload
    const snapshotRaw =
      (o["serializedSnapshot"] ?? o["snapshot"] ?? o["objectData"]) ||
      (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["serializedSnapshot"]) ||
      (isObj(o["dataDisclosureAgreement"]) && (o["dataDisclosureAgreement"] as Record<string, unknown>)["serializedSnapshot"]) ||
      (isObj((o as any)["dataDisclosureAgreementTemplateRevision"]) && ((o as any)["dataDisclosureAgreementTemplateRevision"] as Record<string, unknown>)["serializedSnapshot"]) ||
      (isObj((o as any)["dataDisclosureAgreementTemplateRevision"]) && ((o as any)["dataDisclosureAgreementTemplateRevision"] as Record<string, unknown>)["objectData"]) ||
      undefined;
    let snap: Record<string, unknown> = {};
    if (typeof snapshotRaw === 'string') {
      snap = tryParseJSON(snapshotRaw) || {};
    } else if (isObj(snapshotRaw)) {
      snap = snapshotRaw as Record<string, unknown>;
    } else {
      const fallbackStr = findNestedString(o, ["serializedSnapshot", "objectData", "snapshot"]);
      snap = tryParseJSON(fallbackStr) || {};
    }

    // Build a list of source objects to search for fields
    const sources: Record<string, unknown>[] = [o];
    if (isObj(snap)) sources.push(snap);
    // If snap contains nested JSON strings, parse and include
    const snapObjectData = isObj(snap) ? (snap as any)["objectData"] : undefined;
    const snapSerialized = isObj(snap) ? (snap as any)["serializedSnapshot"] : undefined;
    const parsedSnapObjectData = tryParseJSON(snapObjectData);
    const parsedSnapSerialized = tryParseJSON(snapSerialized);
    if (parsedSnapObjectData) sources.push(parsedSnapObjectData);
    if (parsedSnapSerialized) sources.push(parsedSnapSerialized);
    // Include nested known containers
    const rev = (o as any)["dataDisclosureAgreementTemplateRevision"]; if (isObj(rev)) sources.push(rev as any);
    const revSerialized = isObj(rev) ? (rev as any)["serializedSnapshot"] : undefined; const parsedRevSerialized = tryParseJSON(revSerialized); if (parsedRevSerialized) sources.push(parsedRevSerialized);
    const revObjectData = isObj(rev) ? (rev as any)["objectData"] : undefined; const parsedRevObjectData = tryParseJSON(revObjectData); if (parsedRevObjectData) sources.push(parsedRevObjectData);
    const da = (o as any)["dataAgreement"]; if (isObj(da)) sources.push(da as any);
    const dda = (o as any)["dataDisclosureAgreement"]; if (isObj(dda)) sources.push(dda as any);

    const getFromSources = (keys: string[]): string | undefined => {
      for (const src of sources) {
        for (const k of keys) {
          const v = (src as any)[k];
          if ((typeof v === 'string' || typeof v === 'number') && v !== undefined && v !== null && String(v) !== '') return String(v);
        }
      }
      return undefined;
    };

    // Extract recordId from various possible shapes
    const recordId = getFromSources(["dataDisclosureAgreementRecordId", "recordId", "dataAgreementRecordId"]) ||
      findNestedString(o, ["dataDisclosureAgreementRecordId", "recordId", "dataAgreementRecordId"]) ||
      findNestedString(snap, ["dataDisclosureAgreementRecordId", "recordId", "dataAgreementRecordId"]);

    let version = getFromSources(["version", "templateVersion", "dataAgreementVersion"]);
    if (!version) {
      // recursive fallback search
      version = findNestedString(o, ["version", "templateVersion", "dataAgreementVersion"]) || findNestedString(snap, ["version", "templateVersion", "dataAgreementVersion"]);
    }

    const status = ["status", "state", "dataAgreementStatus"].map(k => (o[k] as string | undefined)).find(Boolean)
      || (isObj(o["dataAgreement"]) ? (o["dataAgreement"] as Record<string, unknown>)["status"] as string | undefined : undefined)
      || (isObj(o["dataDisclosureAgreement"]) ? (o["dataDisclosureAgreement"] as Record<string, unknown>)["status"] as string | undefined : undefined)
      || (snap["status"] as string | undefined);

    const isLatestVersion = Boolean(
      o["isLatestVersion"] ?? o["latest"] ?? (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["isLatestVersion"]) ?? snap["isLatestVersion"]
    );

    const updatedAt = (o["updatedAt"] || o["updated_at"] || (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["updatedAt"]) || (isObj(o["dataDisclosureAgreement"]) && (o["dataDisclosureAgreement"] as Record<string, unknown>)["updatedAt"]) || snap["updatedAt"]) as string | undefined;
    const createdAt = (o["createdAt"] || o["created_at"] || (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["createdAt"]) || (isObj(o["dataDisclosureAgreement"]) && (o["dataDisclosureAgreement"] as Record<string, unknown>)["createdAt"]) || snap["createdAt"]) as string | undefined;
    const revisionId = (o["dataAgreementRevisionId"] || o["revisionId"] || o["id"] || o["@id"] || (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["dataAgreementRevisionId"]) || snap["dataAgreementRevisionId"]) as string | undefined;
    const revisionHash = (o["dataAgreementRevisionHash"] || o["revisionHash"] || o["hash"] || snap["dataAgreementRevisionHash"]) as string | undefined;
    let purpose = getFromSources(["purpose", "usagePurpose"]) as string | undefined;
    if (!purpose) {
      purpose = getFromSources(["purposeDescription", "description"]) as string | undefined;
    }
    if (!purpose) {
      // recursive fallback search
      purpose = findNestedString(o, ["purpose", "usagePurpose", "purposeDescription", "description"]) || findNestedString(snap, ["purpose", "usagePurpose", "purposeDescription", "description"]);
    }
    const lawfulBasis = (snap["lawfulBasis"] || o["lawfulBasis"] || (isObj(o["dataAgreement"]) && (o["dataAgreement"] as Record<string, unknown>)["lawfulBasis"]) || (isObj(o["dataDisclosureAgreement"]) && (o["dataDisclosureAgreement"] as Record<string, unknown>)["lawfulBasis"])) as string | undefined;

    // Try to derive an event label
    const event = findNestedString(o, ["event", "eventType", "action", "actionType", "type"]) || (status ? getStatus(t, String(status)) : undefined);

    const optIn = ((): boolean | undefined => {
      const direct = o["optIn"];
      if (typeof direct === 'boolean') return direct;
      const directUnderscore = (o as any)["opt_in"];
      if (typeof directUnderscore === 'boolean') return directUnderscore;
      const inDA = isObj(o["dataAgreement"]) ? (o["dataAgreement"] as any)["optIn"] : undefined;
      if (typeof inDA === 'boolean') return inDA;
      const inDDA = isObj(o["dataDisclosureAgreement"]) ? (o["dataDisclosureAgreement"] as any)["optIn"] : undefined;
      if (typeof inDDA === 'boolean') return inDDA;
      const inSnap = (snap as any)["optIn"];
      if (typeof inSnap === 'boolean') return inSnap;
      return undefined;
    })();

    // Try to locate signatures in the payload
    const dataSourceSignature = findSignatureString(o, 'dataSourceSignature') || (typeof findNestedString(snap, ["dataSourceSignature"]) === 'string' ? findNestedString(snap, ["dataSourceSignature"]) : undefined);
    const dataUsingServiceSignature = findSignatureString(o, 'dataUsingServiceSignature') || (typeof findNestedString(snap, ["dataUsingServiceSignature"]) === 'string' ? findNestedString(snap, ["dataUsingServiceSignature"]) : undefined);

    return { recordId, purpose, version, event, dataSourceSignature, dataUsingServiceSignature, status, isLatestVersion, updatedAt, createdAt, revisionId, revisionHash, lawfulBasis, optIn };
  };

  const safeDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  // Try to determine a DDA name/purpose from the history payload
  const ddaName = React.useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const count = Math.min(5, list.length);
    for (let i = 0; i < count; i++) {
      const row = normalize(list[i]);
      if (row.purpose) return String(row.purpose);
    }
    return id;
  }, [data, id]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontSize: "0.875rem",
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.87)",
      padding: "6px 16px",
      border: "1px solid #D7D6D6",
      backgroundColor: "#e5e4e4",
      whiteSpace: 'nowrap',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: "0.875rem",
      fontWeight: "lighter",
      color: "rgba(0, 0, 0, 0.87)",
      padding: "6px 16px",
      border: "1px solid #D7D6D6",
      whiteSpace: 'nowrap',
    },
  }));

  const StyledTableRow = styled(TableRow)({
    border: "1px solid #D7D6D6",
  });

  const formatLocalDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{t("dataAgreements.history.title")}</h1>
          </div>
          <div className={styles.subtitleContainer}>
            <p className={styles.subtitle}>
              {t("dataAgreements.history.subtitle")} — {t("dataAgreements.history.agreementLabel")}: {ddaName}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ color: "#b71c1c", border: "1px solid #f5c2c7", background: "#fdecea", padding: 12, borderRadius: 4, margin: "16px 0" }}>
          {t("common.errorOccurred")} {t("common.tryAgainLater")}
        </div>
      )}

      {isSuccess && canFetch && !error && (
        <TableContainer
          className="dd-container"
          sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>{"DDA Record ID"}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.usagePurpose")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.version")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.agreementEvent")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.dataSourceSignature")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.dataUsingServiceSignature")}</StyledTableCell>
                <StyledTableCell>{"Last Modified Date"}</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
              {Array.isArray(data) && data.length > 0 ? (
                (() => {
                  const list = data.map((raw) => ({ raw, row: normalize(raw) }))
                    .sort((a, b) => {
                      const at = new Date(a.row.updatedAt || a.row.createdAt || '').getTime();
                      const bt = new Date(b.row.updatedAt || b.row.createdAt || '').getTime();
                      return bt - at;
                    });
                  return list.map(({ raw, row }, idx) => {
                    const dsSig = row.dataSourceSignature || '';
                    const dusSig = row.dataUsingServiceSignature || '';
                    return (
                      <StyledTableRow key={String(row.revisionId ?? idx)}>
                        <StyledTableCell>{row.recordId ?? ''}</StyledTableCell>
                        <StyledTableCell>{row.purpose ?? ''}</StyledTableCell>
                        <StyledTableCell>{row.version ?? ''}</StyledTableCell>
                        <StyledTableCell>{(row.optIn === true) ? t('common.optInAction') : (row.optIn === false) ? t('common.optOutAction') : (row.event ?? '')}</StyledTableCell>
                        <StyledTableCell>
                          <Tooltip
                            title={t('common.copied')}
                            open={!!dsSig && (copied.key === String(row.revisionId || idx) + '-ds')}
                            disableHoverListener
                            disableFocusListener
                            disableTouchListener
                            placement="top"
                          >
                            <span style={{ cursor: dsSig ? 'pointer' : 'not-allowed' }}>
                              <IconButton
                                aria-label="copy-data-source-signature"
                                size="small"
                                onClick={() => dsSig && handleCopy(dsSig, String(row.revisionId || idx) + '-ds')}
                                disabled={!dsSig}
                                sx={{ color: dsSig ? '#000' : '#BDBDBD' }}
                              >
                                <SignatureIcon size={24} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Tooltip
                            title={t('common.copied')}
                            open={!!dusSig && (copied.key === String(row.revisionId || idx) + '-dus')}
                            disableHoverListener
                            disableFocusListener
                            disableTouchListener
                            placement="top"
                          >
                            <span style={{ cursor: dusSig ? 'pointer' : 'not-allowed' }}>
                              <IconButton
                                aria-label="copy-data-using-service-signature"
                                size="small"
                                onClick={() => dusSig && handleCopy(dusSig, String(row.revisionId || idx) + '-dus')}
                                disabled={!dusSig}
                                sx={{ color: dusSig ? '#000' : '#BDBDBD' }}
                              >
                                <SignatureIcon size={24} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell>{formatLocalDate(row.updatedAt || row.createdAt)}</StyledTableCell>
                        <StyledTableCell
                          style={{ display: 'flex', justifyContent: 'center', gap: 8, border: 'none', whiteSpace: 'nowrap' }}
                        >
                          <Tooltip title={t("signedAgreements.tooltipView")} placement="top">
                            <IconButton aria-label="view" onClick={() => handleView(raw)} sx={{ color: '#000' }}>
                              <EyeIcon size={17} />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  });
                })()
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={8} align="center">{t("dataAgreements.history.table.noData")}</StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Right-side modal for viewing DDA entry */}
      {selected && (
        <ViewDDAgreementModalInner
          open={openView}
          setOpen={setOpenView}
          mode="private"
          selectedData={selected}
          dataSourceName={getDetails(selected).dataSourceName}
          dataSourceLocation={getDetails(selected).dataSourceLocation}
          dataSourceDescription={selected?.purposeDescription || ''}
          coverImage={getDetails(selected).coverImage}
          logoImage={getDetails(selected).logoImage}
          trusted={getDetails(selected).trusted}
        />
      )}
    </div>
  );
}
