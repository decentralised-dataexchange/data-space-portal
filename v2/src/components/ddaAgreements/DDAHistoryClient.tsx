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
import Paper from "@mui/material/Paper";
import { styled } from "@mui/system";
import styles from "./ddaAgreements.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { getStatus } from "@/utils/dda";

type HistoryRow = {
  version?: string;
  status?: string;
  isLatestVersion?: boolean;
  updatedAt?: string;
  createdAt?: string;
  revisionId?: string;
  revisionHash?: string;
  purpose?: string;
  lawfulBasis?: string;
};

export default function DDAHistoryClient({ id }: { id: string }) {
  const t = useTranslations();
  const cleanId = React.useMemo(() => {
    try {
      return decodeURIComponent(id);
    } catch {
      return id;
    }
  }, [id]);

  const { data, isLoading, error } = useQuery<any[], Error>({
    queryKey: ["ddaHistory", cleanId],
    queryFn: async () => {
      let res: any = await apiService.getDDAHistory(cleanId);
      // If backend returned JSON as string, parse it
      if (typeof res === 'string') {
        try { res = JSON.parse(res); } catch {}
      }
      const arrays = [
        res?.history?.items,
        res?.history?.results,
        res?.history,
        res?.revisions,
        res?.dataAgreementRevisions,
        res?.dataDisclosureAgreementRevisions,
        res?.data_disclosure_agreement_revisions,
        res?.dataDisclosureAgreementHistory?.items,
        res?.data_disclosure_agreement_history?.items,
        res?.dataDisclosureAgreementHistory,
        res?.data_disclosure_agreement_history,
        res?.dataDisclosureAgreement?.revisions,
        res?.items,
        res?.results,
        res?.data,
        res,
      ];
      for (const candidate of arrays) {
        if (Array.isArray(candidate)) return candidate;
      }
      // As a last resort, recursively search for the first array in the object
      const seen = new Set<any>();
      const findFirstArray = (obj: any, depth = 0): any[] | null => {
        if (!obj || typeof obj !== 'object' || depth > 3 || seen.has(obj)) return null;
        seen.add(obj);
        for (const key of Object.keys(obj)) {
          const val: any = (obj as any)[key];
          if (Array.isArray(val)) return val;
          if (val && typeof val === 'object') {
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
  });

  const normalize = (item: any): HistoryRow => {
    const snapshotStr = item?.serializedSnapshot || item?.snapshot || item?.objectData || item?.dataAgreement?.serializedSnapshot || item?.dataDisclosureAgreement?.serializedSnapshot;
    let snap: any = undefined;
    if (typeof snapshotStr === 'string') {
      try { snap = JSON.parse(snapshotStr); } catch {}
    }
    const version = item?.version ?? item?.templateVersion ?? item?.dataAgreementVersion ?? item?.dataAgreement?.version ?? item?.dataDisclosureAgreement?.version ?? snap?.version ?? snap?.templateVersion;
    const status = item?.status ?? item?.state ?? item?.dataAgreementStatus ?? item?.dataAgreement?.status ?? item?.dataDisclosureAgreement?.status ?? snap?.status;
    const isLatestVersion = Boolean(item?.isLatestVersion ?? item?.latest ?? item?.dataAgreement?.isLatestVersion ?? snap?.isLatestVersion);
    const updatedAt = item?.updatedAt ?? item?.updated_at ?? item?.dataAgreement?.updatedAt ?? item?.dataDisclosureAgreement?.updatedAt ?? snap?.updatedAt;
    const createdAt = item?.createdAt ?? item?.created_at ?? item?.dataAgreement?.createdAt ?? item?.dataDisclosureAgreement?.createdAt ?? snap?.createdAt;
    const revisionId = item?.dataAgreementRevisionId ?? item?.revisionId ?? item?.id ?? item?.["@id"] ?? item?.dataAgreement?.dataAgreementRevisionId ?? snap?.dataAgreementRevisionId;
    const revisionHash = item?.dataAgreementRevisionHash ?? item?.revisionHash ?? item?.hash ?? snap?.dataAgreementRevisionHash;
    const purpose = snap?.purpose ?? item?.purpose ?? item?.dataAgreement?.purpose ?? item?.dataDisclosureAgreement?.purpose;
    const lawfulBasis = snap?.lawfulBasis ?? item?.lawfulBasis ?? item?.dataAgreement?.lawfulBasis ?? item?.dataDisclosureAgreement?.lawfulBasis;
    return { version, status, isLatestVersion, updatedAt, createdAt, revisionId, revisionHash, purpose, lawfulBasis };
  };

  const safeDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  // Try to determine a DDA name/purpose from the history payload
  const ddaName = React.useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const searchIn: any[] = list.slice(0, 5);
    for (const it of searchIn) {
      const candidate = it?.purpose || it?.title || it?.name || it?.dataAgreement?.purpose || it?.dataDisclosureAgreement?.purpose;
      if (candidate) return String(candidate);
      const snap = it?.serializedSnapshot || it?.snapshot || it?.objectData;
      if (typeof snap === 'string') {
        try {
          const o = JSON.parse(snap);
          if (o?.purpose) return String(o.purpose);
          if (o?.title) return String(o.title);
          if (o?.name) return String(o.name);
        } catch (e) {
          // ignore
        }
      }
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
    '&:nth-of-type(odd)': {
      backgroundColor: '#fafafa',
    },
    '&:hover': {
      backgroundColor: '#f3f3f3',
    },
  });

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

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
          <CircularProgress size={24} />
        </div>
      )}
      {error && (
        <div style={{ color: "#b71c1c", border: "1px solid #f5c2c7", background: "#fdecea", padding: 12, borderRadius: 4, margin: "16px 0" }}>
          {t("common.errorOccurred")} {t("common.tryAgainLater")}
        </div>
      )}

      {!isLoading && !error && (
        <TableContainer
          component={Paper}
          className="dd-container"
          sx={{ backgroundColor: 'transparent', borderRadius: 0, maxHeight: 520, overflowY: 'auto', overflowX: 'auto' }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>{t("dataAgreements.history.table.headers.revision")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.table.headers.usagePurpose")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.version")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.status")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.isLatest")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.table.headers.lawfulBasis")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.timestamp")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.revisionId")}</StyledTableCell>
                <StyledTableCell>{t("dataAgreements.history.table.headers.revisionHash")}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(data) && data.length > 0 ? (
                data
                  .map(normalize)
                  .sort((a, b) => {
                    const at = new Date(a.updatedAt || a.createdAt || 0).getTime();
                    const bt = new Date(b.updatedAt || b.createdAt || 0).getTime();
                    return bt - at;
                  })
                  .map((row, idx) => (
                    <StyledTableRow key={String(row.revisionId ?? idx)}>
                      <TableCell width={72}>{idx + 1}</TableCell>
                      <TableCell>{row.purpose ?? ''}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{row.version ?? ""}</TableCell>
                      <TableCell>
                        {(() => {
                          const label = row.status ? getStatus(t, String(row.status)) : '';
                          return <span>{label}</span>;
                        })()}
                      </TableCell>
                      <TableCell>{row.isLatestVersion ? t('common.yes') : t('common.no')}</TableCell>
                      <TableCell>{row.lawfulBasis ?? ''}</TableCell>
                      <TableCell>
                        <Tooltip title={(row.updatedAt || row.createdAt) ? new Date(row.updatedAt || row.createdAt as string).toISOString() : ''}>
                          <span>{safeDate(row.updatedAt || row.createdAt)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>
                        <Tooltip title={row.revisionId ?? ''}>
                          <span>{row.revisionId ?? ''}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>
                        <Tooltip title={row.revisionHash ?? ''}>
                          <span>{row.revisionHash ? String(row.revisionHash).slice(0, 12) + '…' : ''}</span>
                        </Tooltip>
                      </TableCell>
                    </StyledTableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">{t("dataAgreements.history.table.noData")}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
