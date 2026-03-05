"use client";

import React from "react";
import { Box } from "@mui/material";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { BookOpenIcon } from "@phosphor-icons/react";

const KnowledgeHubLink = () => {
  const t = useTranslations();

  return (
    <Box
      component={Link}
      href="/knowledge"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        padding: { xs: "0.5rem 0.75rem 0", md: "0.75rem 1.25rem 0" },
        color: "#86868b",
        textDecoration: "none",
        fontSize: { xs: "0.75rem", md: "0.8125rem" },
        fontWeight: 500,
        letterSpacing: "-0.01em",
        transition: "color 0.2s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
        "&:hover": {
          color: "#1d1d1f",
        },
      }}
    >
      <BookOpenIcon size={16} />
      {t("appBar.knowledgeHub")}
    </Box>
  );
};

export default KnowledgeHubLink;
