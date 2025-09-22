"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Alert, Box, CircularProgress } from "@mui/material";
import styles from "../ddaAgreements/ddaAgreements.module.scss";
import B2BTable from "./b2bTable";
import { useB2BConnections } from "@/custom-hooks/b2bConnections";

export default function B2BConnections() {
  const t = useTranslations();
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(0); // zero-based for MUI
  const offset = page * limit;

  const { data, isLoading, error } = useB2BConnections(limit, offset);
  const rows = data?.b2bConnection || [];
  const total = data?.pagination?.totalItems || 0;

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
        />
      )}
    </div>
  );
}
