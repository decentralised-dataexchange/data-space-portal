"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import { useAppDispatch } from "@/custom-hooks/store";
import { setSelectedDDAId, setSelectedOpenApiUrl } from "@/store/reducers/dataSourceReducers";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface DDAActionsProps {
  dataDisclosureAgreement: DataDisclosureAgreement;
  openApiUrl: string;
}

export default function DDAActions({ dataDisclosureAgreement, openApiUrl }: DDAActionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();

  const handleDDAClick = () => {
    dispatch(setSelectedDDAId(dataDisclosureAgreement.templateId));
  };

  const handleViewApiClick = () => {
    if (openApiUrl) {
      dispatch(setSelectedOpenApiUrl(openApiUrl));
      router.push(t("route.apiDoc"));
    }
  };

  return (
    <Box className="actionListingBtn" sx={{ display: "flex", flexDirection: "column", gap: 0.75, marginTop: "auto" }}>
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
      <Button
        variant="outlined"
        size="medium"
        sx={{
          fontSize: "14px",
          padding: "4px 16px",
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
