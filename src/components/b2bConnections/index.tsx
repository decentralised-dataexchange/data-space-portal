"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, CircularProgress } from "@mui/material";
import styles from "../ddaAgreements/ddaAgreements.module.scss";
import B2BTable from "./b2bTable";
import { useB2BConnections } from "@/custom-hooks/b2bConnections";
// no delete action per latest requirements
import SoftwareStatementModal from "@/components/Account/DeveloperApis/SoftwareStatementModal";
import { AttributeRow } from "@/components/common/AttributeTable";
import { SoftwareStatementDecoded, B2BConnectionItem } from "@/types/b2bConnection";
import { useGetCoverImage, useGetLogoImage, useGetOrganisation } from "@/custom-hooks/gettingStarted";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";

export default function B2BConnections() {
  const t = useTranslations();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(0); // zero-based for MUI
  const offset = page * limit;

  const { data, isLoading, error } = useB2BConnections(limit, offset);
  const rows = data?.b2bConnection || [];
  const total = data?.pagination?.totalItems || 0;

  // deletion removed per latest requirements

  // Software Statement modal state
  const [ssOpen, setSsOpen] = React.useState(false);
  const [ssRows, setSsRows] = React.useState<AttributeRow[]>([]);
  const [ssTitle, setSsTitle] = React.useState<string>("");
  const [ssShowValues, setSsShowValues] = React.useState<boolean>(false);
  const [ssOrgName, setSsOrgName] = React.useState<string>("");
  const [ssShowTrustedBadge, setSsShowTrustedBadge] = React.useState<boolean>(true);
  const [ssCoverImage, setSsCoverImage] = React.useState<string>("");
  const [ssLogoImage, setSsLogoImage] = React.useState<string>("");

  // For modal banner visuals, reuse same cover/logo as Developer APIs page
  const { data: coverImageBase64 } = useGetCoverImage();
  const { data: logoImageBase64 } = useGetLogoImage();
  const { data: orgDetails } = useGetOrganisation();

  const buildSoftwareStatementRows = (dec?: SoftwareStatementDecoded): AttributeRow[] => {
    const rows: AttributeRow[] = [];
    if (!dec) return rows;
    // Match Developer APIs behavior: show only Client URI as attribute
    if (dec.client_uri) rows.push({ label: t('developerAPIs.softwareStatementClientUriLabel'), value: dec.client_uri, href: dec.client_uri });
    // Annotate meta keys for issued/expiry strip; modal hides these rows and uses values
    (rows as any).unshift({ key: '__issued', label: '', value: dec.iat } as any);
    (rows as any).unshift({ key: '__expiry', label: '', value: dec.exp } as any);
    return rows;
  };

  const humanizeVct = (vct?: string) => {
    if (!vct) return t('developerAPIs.softwareStatementTitle');
    return vct
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim();
  };

  const extractOrgName = (dec?: any): string => {
    if (!dec || typeof dec !== 'object') return '';
    // Prefer the top-level 'name' if present
    if (typeof dec.name === 'string' && dec.name.trim()) return dec.name.trim();
    // Common alternates
    if (typeof dec.legalName === 'string' && dec.legalName.trim()) return dec.legalName.trim();
    if (dec.kb && typeof dec.kb.name === 'string' && dec.kb.name.trim()) return dec.kb.name.trim();
    // Fallbacks: issuer or subject
    if (typeof dec.iss === 'string' && dec.iss.trim()) return dec.iss.trim();
    if (typeof dec.sub === 'string' && dec.sub.trim()) return dec.sub.trim();
    return '';
  };

  const openMySoftwareStatement = (item: B2BConnectionItem) => {
    const dec = item?.b2bConnectionRecord?.mySoftwareStatementDecoded as any;
    setSsRows(buildSoftwareStatementRows(dec));
    setSsTitle(humanizeVct(dec?.vct));
    // Show our organisation name from organisation details
    setSsOrgName((orgDetails as any)?.organisation?.name || '');
    setSsShowTrustedBadge(true);
    const decCover = (dec?.cover_url as string) || '';
    const decLogo = (dec?.logo_url as string) || '';
    setSsCoverImage(decCover || coverImageBase64 || defaultCoverImage);
    setSsLogoImage(decLogo || logoImageBase64 || defaultLogoImg);
    setSsShowValues(false);
    setSsOpen(true);
  };

  const openTheirSoftwareStatement = (item: B2BConnectionItem) => {
    const dec = item?.b2bConnectionRecord?.theirSoftwareStatementDecoded as any;
    setSsRows(buildSoftwareStatementRows(dec));
    setSsTitle(humanizeVct(dec?.vct));
    // For their software statement, show Unknown
    setSsOrgName(t('unknownOrganization'));
    // Hide trusted/untrusted indicator and use default images
    setSsShowTrustedBadge(false);
    const decCover = (dec?.cover_url as string) || '';
    const decLogo = (dec?.logo_url as string) || '';
    setSsCoverImage(decCover || defaultCoverImage);
    setSsLogoImage(decLogo || defaultLogoImg);
    setSsShowValues(false);
    setSsOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{t("b2bConnections.title")}</h1>
          </div>
          <div className={styles.subtitleContainer}>
            <p className={styles.subtitle}>{t("b2bConnections.subtitle")}</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {t("common.errorOccurred")} {t("common.tryAgainLater")}
        </Alert>
      )}

      {!isLoading && !error && (
        <B2BTable
          rows={rows}
          page={page}
          rowsPerPage={limit}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setPage(0); }}
          onOpenMySoftwareStatement={openMySoftwareStatement}
          onOpenTheirSoftwareStatement={openTheirSoftwareStatement}
        />
      )}

      <SoftwareStatementModal
        open={ssOpen}
        onClose={() => setSsOpen(false)}
        title={ssTitle}
        organisationName={ssOrgName}
        rows={ssRows}
        showValues={ssShowValues}
        setShowValues={setSsShowValues}
        enableToggle
        trusted
        coverImageBase64={ssCoverImage}
        logoImageBase64={ssLogoImage}
        showTrustedBadge={ssShowTrustedBadge}
      />
    </div>
  );
}
