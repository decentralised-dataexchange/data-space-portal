"use client";

import React, { useState, useMemo } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import styles from "../ddaAgreements/ddaAgreements.module.scss";
import { useTranslations } from "next-intl";
import { useSignedAgreements } from "@/custom-hooks/signedAgreements";
import SignedAgreementsTable from "./table";
import ViewDDAgreementModalInner from "../DataSources/ViewDDAgreementModalInner";
import { useGetDataSourceList } from "@/custom-hooks/dataSources";
import { defaultLogoImg, defaultCoverImage } from "@/constants/defalultImages";

export default function SignedAgreementsPage() {
  const t = useTranslations();
  const commonT = useTranslations("common");

  const [limit, setLimit] = useState(10);
  const [offsetValue, setOffsetValue] = useState(0);

  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error } = useSignedAgreements(limit, offsetValue);

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setOffsetValue(newPage * limit);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setOffsetValue(0);
  };

  const transformForModal = (record: any): any => {
    const r = record?.dataDisclosureAgreementRecord || {};
    const objDataStr = r?.dataDisclosureAgreementTemplateRevision?.objectData;
    let obj: any = {};
    try {
      obj = objDataStr ? JSON.parse(objDataStr) : {};
    } catch (_) {
      obj = {};
    }
    // Map to the structure expected by ViewDDAgreementModalInner with fallback to legacy flat structure
    return {
      ...obj,
      purpose: obj?.purpose ?? r?.purpose,
      purposeDescription: obj?.purposeDescription ?? obj?.description ?? r?.purposeDescription ?? r?.description,
      templateId: record?.dataDisclosureAgreementTemplateId || obj?.templateId || obj?.templateID || r?.templateId || r?.templateID,
      version: obj?.version ?? obj?.templateVersion ?? r?.version ?? r?.templateVersion,
      lawfulBasis: obj?.lawfulBasis ?? r?.lawfulBasis,
      dataAttributes: Array.isArray(obj?.dataAttributes) ? obj.dataAttributes : (Array.isArray(r?.dataAttributes) ? r.dataAttributes : undefined),
      personalData: Array.isArray(obj?.personalData) ? obj.personalData : (Array.isArray(r?.personalData) ? r.personalData : []),
      dataController: obj?.dataController || r?.dataController || {},
      createdAt: record?.createdAt,
      updatedAt: record?.updatedAt,
      // Pass signature decoded data for signed agreements modal
      dataSourceSignatureDecoded: r?.dataSourceSignature?.signatureDecoded,
      dataUsingServiceSignatureDecoded: r?.dataUsingServiceSignature?.signatureDecoded,
      // Pass timestamps explicitly for signature cards
      dataSourceSignature: r?.dataSourceSignature ? { timestamp: r?.dataSourceSignature?.timestamp } : undefined,
      dataUsingServiceSignature: r?.dataUsingServiceSignature ? { timestamp: r?.dataUsingServiceSignature?.timestamp } : undefined,
    };
  };

  // Fetch data sources list to resolve banner/logo/org details
  const { dataSourceItems } = useGetDataSourceList();
  const dataSources = dataSourceItems as unknown as any;

  const getDataSourceDetails = useMemo(() => {
    // Return a function that computes details for a given modal-selected DDA
    return (sel: any) => {
      const defaultValues = {
        coverImage: defaultCoverImage,
        logoImage: defaultLogoImg,
        dataSourceName: sel?.dataController?.name || "",
        dataSourceLocation: sel?.dataController?.industrySector || "",
        trusted: false,
      };

      if (!sel || !dataSources) return defaultValues;

      const list = Array.isArray(dataSources)
        ? dataSources
        : ('dataSources' in dataSources ? dataSources.dataSources : []);
      if (!Array.isArray(list) || list.length === 0) return defaultValues;

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
            dataSourceName: item.dataSource.name || sel?.dataController?.name || "",
            dataSourceLocation: item.dataSource.location || sel?.dataController?.industrySector || "",
            trusted: computedTrusted,
          };
        }
      }
      return defaultValues;
    };
  }, [dataSources]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          {t("errors.generic")}
        </Alert>
      );
    }

    return (
      <Box sx={{ marginTop: "16px" }}>
        <SignedAgreementsTable
          tabledata={data || { dataDisclosureAgreementRecord: [], pagination: { totalItems: 0, limit, offset: offsetValue, hasNext: false, hasPrevious: false, currentPage: 0, totalPages: 0 } }}
          limit={limit}
          offset={offsetValue}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onView={(row) => {
            setSelected(transformForModal(row));
            setOpenView(true);
          }}
        />
      </Box>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{t("signedAgreements.title")}</h1>
          </div>
          <div className={styles.subtitleContainer}>
            <p className={styles.subtitle}>{t("signedAgreements.subtitle")}</p>
          </div>
        </div>
      </div>

      {renderContent()}

      {selected && (
        <ViewDDAgreementModalInner
          open={openView}
          setOpen={setOpenView}
          mode="private"
          selectedData={selected}
          dataSourceName={getDataSourceDetails(selected).dataSourceName}
          dataSourceLocation={getDataSourceDetails(selected).dataSourceLocation}
          dataSourceDescription={selected?.purposeDescription || ''}
          coverImage={getDataSourceDetails(selected).coverImage}
          logoImage={getDataSourceDetails(selected).logoImage}
          trusted={getDataSourceDetails(selected).trusted}
          showSignatureDecoded={true}
          titleOverride={t("signedAgreements.viewModal.title")}
        />
      )}
    </div>
  );
}
