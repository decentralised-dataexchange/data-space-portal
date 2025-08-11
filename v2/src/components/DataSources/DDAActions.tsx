"use client";

import React from "react";
import { Box, Button } from "@mui/material";
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

  return (
    <Box
      className="actionListingBtn"
      sx={{
        display: "flex",
        flexDirection: apiViewMode ? "row" : "column",
        justifyContent: apiViewMode ? "flex-end" : "initial",
        gap: apiViewMode ? 1 : 0.75,
        marginTop: "auto",
      }}
    >
      {!apiViewMode && (
        <Button
          variant="outlined"
          size="medium"
          sx={{
            fontSize: "14px",
            padding: "8px 16px",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: "medium",
            minWidth: "120px",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.04)" },
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
        sx={{
          fontSize: "14px",
          padding: apiViewMode ? "8px 20px" : "4px 16px",
          borderRadius: "6px",
          textTransform: "none",
          fontWeight: "medium",
          minWidth: "120px",
        }}
        onClick={handleDDAClick}
      >
        {t("home.btn-signData")}
      </Button>
    </Box>
  );
}
