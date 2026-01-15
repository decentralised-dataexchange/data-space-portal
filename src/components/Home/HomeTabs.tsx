"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type ActiveTab = "organisations" | "ddas";

interface Props {
  activeTab: ActiveTab;
  organisationsCount?: number;
  ddasCount?: number;
}

const HomeTabs: React.FC<Props> = ({ activeTab, organisationsCount, ddasCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const buildNextUrl = (params: URLSearchParams) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const switchTab = (nextTab: ActiveTab) => {
    if (nextTab === activeTab) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    // Ensure each tab has its own page param with a sensible default
    if (nextTab === "organisations") {
      if (!params.get("orgPage")) {
        params.set("orgPage", "1");
      }
    } else {
      if (!params.get("ddaPage")) {
        params.set("ddaPage", "1");
      }
    }
    router.push(buildNextUrl(params));
  };

  const tabSx = (tab: ActiveTab) => ({
    textTransform: "none !important" as const,
    borderRadius: 0,
    borderBottom: tab === activeTab ? "2px solid #000000" : "2px solid transparent",
    color: tab === activeTab ? "#000000" : "#666666",
    fontSize: "0.875rem",
    paddingX: 2,
    paddingY: 0.5,
    minHeight: 32,
    '&:hover': {
      backgroundColor: 'transparent',
      borderBottom: "2px solid #000000",
      color: "#000000",
    },
  });

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="text"
        size="small"
        sx={tabSx("organisations")}
        onClick={() => switchTab("organisations")}
      >
        {t("home.tabs.organisations")}
        {organisationsCount !== undefined && (
          <Box component="span" sx={{ ml: 0.5, color: "#666666" }}>
            ({organisationsCount})
          </Box>
        )}
      </Button>
      <Button
        variant="text"
        size="small"
        sx={tabSx("ddas")}
        onClick={() => switchTab("ddas")}
      >
        {t("home.tabs.dataDisclosureAgreements")}
        {ddasCount !== undefined && (
          <Box component="span" sx={{ ml: 0.5, color: "#666666" }}>
            ({ddasCount})
          </Box>
        )}
      </Button>
    </Box>
  );
};

export default HomeTabs;
