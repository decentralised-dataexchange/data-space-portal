"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import { useAppDispatch } from "@/custom-hooks/store";
import { setSelectedDDAId, setSelectedOpenApiUrl } from "@/store/reducers/dataSourceReducers";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface DDAActionsProps {
  dataDisclosureAgreement: DataDisclosureAgreement;
  openApiUrl: string;
  dataSourceSlug: string;
  apiViewMode?: boolean; // when true, hide View API and right-align the remaining action
}

export default function DDAActions({ dataDisclosureAgreement, openApiUrl, dataSourceSlug, apiViewMode = false }: DDAActionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const handleDDAClick = () => {
    dispatch(setSelectedDDAId(dataDisclosureAgreement.templateId));
  };

  const handleViewApiClick = () => {
    if (openApiUrl) {
      dispatch(setSelectedOpenApiUrl(openApiUrl));
      // Navigate to the same datasource read page, showing only this DDA and the API doc below it
      router.push(`/${locale}/data-source/read/${dataSourceSlug}?viewApiFor=${dataDisclosureAgreement.templateId}`);
    }
  };

  const versionText = String((dataDisclosureAgreement as any)?.version || (dataDisclosureAgreement as any)?.templateVersion || "");
  return (
    <Box
      className="actionListingBtn"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 1,
        marginTop: "auto",
      }}
    >
      <Box sx={{ flex: 1, width: '100%', display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-start' } }}>
        {!!versionText && (
          <Typography variant="body2" sx={{ color: '#666666' }}>
            {t('dataAgreements.version')}: {versionText}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
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
            disabled={!openApiUrl}
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
  );
}
