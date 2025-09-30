"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import { useAppDispatch } from "@/custom-hooks/store";
import { setSelectedDDAId } from "@/store/reducers/dataSourceReducers";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface DDAActionsProps {
  dataDisclosureAgreement: DataDisclosureAgreement;
  dataSourceSlug: string;
  apiViewMode?: boolean; // when true, hide View API and right-align the remaining action
  hasEmbeddedSpec?: boolean; // optional hint from parent if spec presence was detected externally
}

export default function DDAActions({ dataDisclosureAgreement, dataSourceSlug, apiViewMode = false, hasEmbeddedSpec: parentHasEmbeddedSpec }: DDAActionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const getDdaId = (dda: any): string | undefined => {
    return dda?.dataAgreementId || dda?.['@id'] || dda?.templateId;
  };

  const handleDDAClick = () => {
    // For modal selection and subsequent signing, use templateId as the stable key
    const templateId = (dataDisclosureAgreement as DataDisclosureAgreement)?.templateId;
    if (templateId) dispatch(setSelectedDDAId(templateId));
  };

  const handleViewApiClick = () => {
    // Navigate to the same datasource read page, showing only this DDA and the API doc below it
    const viewId = getDdaId(dataDisclosureAgreement) || dataDisclosureAgreement.templateId;
    router.push(`/${locale}/data-source/read/${dataSourceSlug}?viewApiFor=${viewId}`);
  };

  // Detect embedded OpenAPI spec presence (top-level or nested in objectData strings)
  const hasEmbeddedSpec = React.useMemo(() => {
    const specHasContent = (value: any): boolean => {
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    };
    const src: any = dataDisclosureAgreement as any;
    try {
      if (src && Object.prototype.hasOwnProperty.call(src, "openApiSpecification") && specHasContent(src.openApiSpecification)) return true;
      const objData = src?.objectData;
      if (objData && typeof objData === 'string') {
        try {
          const parsed = JSON.parse(objData);
          if (parsed && specHasContent(parsed?.openApiSpecification)) return true;
        } catch {}
      }
      const revObjData = src?.dataDisclosureAgreementTemplateRevision?.objectData;
      if (revObjData && typeof revObjData === 'string') {
        try {
          const parsed2 = JSON.parse(revObjData);
          if (parsed2 && specHasContent(parsed2?.openApiSpecification)) return true;
        } catch {}
      }
    } catch {}
    return false;
  }, [dataDisclosureAgreement]);

  const getVersionText = () => {
    const v: any = (dataDisclosureAgreement as any)?.version || (dataDisclosureAgreement as any)?.templateVersion;
    return v ? String(v) : '';
  };

  const formatRelativeTime = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    const diffMs = d.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    const absMs = Math.abs(diffMs);
    const sec = Math.round(diffMs / 1000);
    const min = Math.round(diffMs / (60 * 1000));
    const hr = Math.round(diffMs / (60 * 60 * 1000));
    const day = Math.round(diffMs / (24 * 60 * 60 * 1000));
    if (absMs < 60 * 1000) return rtf.format(sec, 'second');
    if (absMs < 60 * 60 * 1000) return rtf.format(min, 'minute');
    if (absMs < 24 * 60 * 60 * 1000) return rtf.format(hr, 'hour');
    return rtf.format(day, 'day');
  };

  const getModifiedText = () => {
    const ts: any = (dataDisclosureAgreement as any)?.updatedAt || (dataDisclosureAgreement as any)?.createdAt;
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };
  return (
    <Box className="actionListingBtn" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, marginTop: 'auto' }}>
      {/* Top row: Version inline with actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%' }}>
        <Typography variant="body2" sx={{ color: '#666666' }}>
          {(() => { const v = getVersionText(); return v ? `${t('dataAgreements.version')}: ${v}` : ''; })()}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {!apiViewMode && (
          <Button
            variant="outlined"
            size="medium"
            sx={{
              fontSize: "14px",
              textTransform: "none",
              fontWeight: "medium",
              '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'auto' },
            }}
            onClick={handleViewApiClick}
            disabled={!(Boolean(parentHasEmbeddedSpec) || hasEmbeddedSpec)}
          >
            {t("home.btn-viewMetadata")}
          </Button>
        )}
        <Button
          variant="outlined"
          size="medium"
          sx={{ fontSize: "14px", textTransform: "none", fontWeight: "medium" }}
          onClick={handleDDAClick}
        >
          {t("home.btn-signData")}
        </Button>
        </Box>
      </Box>
      {/* Bottom row: Relative last modified */}
      {(() => {
        const rel = formatRelativeTime((dataDisclosureAgreement as any)?.updatedAt || (dataDisclosureAgreement as any)?.createdAt);
        if (!rel) return null;
        return (
          <Typography variant="caption" sx={{ color: '#888888', fontSize: '12px' }}>
            {`Last Modified: ${rel}`}
          </Typography>
        );
      })()}
    </Box>
  );
}

