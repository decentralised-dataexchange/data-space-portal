"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { DownloadSimpleIcon, PlusCircleIcon } from "@phosphor-icons/react"
import "../DataSources/style.scss";
import { useTranslations } from "next-intl";
import { DataDisclosureAgreement, DataSource } from "@/types/dataDisclosureAgreement";
import DDAtable from "./ddaTable";
import ViewDDAgreementModalInner from "../DataSources/ViewDDAgreementModalInner";
import GeneralModal from "./generalModal";
import ListDDAModal from "./listDDAModal";
import { useDDAgreements } from "@/custom-hooks/dataDisclosureAgreements";
import { defaultLogoImg } from "@/constants/defalultImages";
import { useGetDataSourceList } from "@/custom-hooks/dataSources";
import styles from "./ddaAgreements.module.scss";

interface DataSourceItem {
  api?: string[];
  dataSource: DataSource;
  dataDisclosureAgreements: DataDisclosureAgreement[];
  verification?: any;
}

interface ApiResponse {
  dataSources: DataSourceItem[];
  pagination?: any;
}

const DDAgreements = () => {
  const [selectedFilterValue, setSelectedFilterValue] = useState("all");
  const [limit, setLimit] = useState(10);
  const [offsetValue, setOffsetValue] = useState(0);

  const t = useTranslations();
  const commonT = useTranslations("common");

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenPublish, setIsOpenPublish] = useState(false);
  const [isOpenViewDDA, setIsOpenViewDDA] = useState(false);
  const [selectedDDA, setSelectedDDA] = useState<DataDisclosureAgreement | null>(null);

  const { dataSourceItems } = useGetDataSourceList();
  const dataSources = dataSourceItems as unknown as ApiResponse;

  const getDataSourceDetails = (dataAgreement: DataDisclosureAgreement | null) => {
    // Default return values with fallback to default logo
    const defaultValues = {
      coverImage: "",
      logoImage: defaultLogoImg,
      dataSourceName: "",
      dataSourceLocation: "",
      trusted: false,
    };

    if (!dataAgreement || !dataSources) {
      return defaultValues;
    }

    // Extract the data sources list from the response
    const dataSourcesList = Array.isArray(dataSources)
      ? dataSources
      : 'dataSources' in dataSources
        ? dataSources.dataSources
        : [];

    if (!dataSourcesList.length) {
      return defaultValues;
    }

    // Try to find a data source that contains this DDA
    for (const item of dataSourcesList) {
      if (!item?.dataSource) continue;

      // First, check if this item has the DDA we're looking for
      const matchingDDA = (item.dataDisclosureAgreements || []).find(
        (dda: DataDisclosureAgreement) => dda?.templateId === dataAgreement.templateId
      );

      if (matchingDDA) {
        const computedTrusted =
          typeof item.dataSource?.trusted === 'boolean'
            ? (item.dataSource.trusted as boolean)
            : item?.verification?.presentationState === 'verified';
        // Return the cover image, logo, name, and location from the matched data source
        return {
          coverImage: item.dataSource.coverImageUrl || "",
          logoImage: item.dataSource.logoUrl || defaultLogoImg,
          dataSourceName: item.dataSource.name || "",
          dataSourceLocation: item.dataSource.location || "",
          trusted: computedTrusted,
        };
      }
    }

    // If no matching DDA found, try to use the first available data source's images
    const firstItem = dataSourcesList[0];
    const firstDataSource = firstItem?.dataSource;
    if (firstDataSource) {
      const computedTrusted =
        typeof firstDataSource.trusted === 'boolean'
          ? (firstDataSource.trusted as boolean)
          : firstItem?.verification?.presentationState === 'verified';
      return {
        coverImage: firstDataSource.coverImageUrl || "",
        logoImage: firstDataSource.logoUrl || defaultLogoImg,
        dataSourceName: firstDataSource.name || "",
        dataSourceLocation: firstDataSource.location || "",
        trusted: computedTrusted,
      };
    }

    return defaultValues;
  };

  const { data, isLoading, error, refetch } = useDDAgreements(
    selectedFilterValue,
    limit,
    offsetValue
  );

  const handleChange = (value: string) => {
    if (value === "complete") {
      setSelectedFilterValue("listed");
    } else {
      setSelectedFilterValue(value);
    }
    setOffsetValue(0);
  };

  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setOffsetValue(newPage * limit);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setOffsetValue(0);
  };

  const handleCloseModal = () => {
    setSelectedDDA(null);
    setIsOpenViewDDA(false);
  };

  const handleAddNewListing = () => {
    console.log('Add new listing clicked');
    // TODO: Implement add new listing functionality
  };

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
          {commonT("errors.generic")}
        </Alert>
      );
    }

    return (
      <>

        <Box sx={{ marginTop: "16px" }}>
          <DDAtable
            setIsOpenViewDDA={setIsOpenViewDDA}
            setSelectedDDA={setSelectedDDA}
            tabledata={data || { dataDisclosureAgreements: [], pagination: { total: 0, limit, offset: offsetValue, hasNext: false, hasPrevious: false, totalItems: 0, currentPage: 0, totalPages: 0 } }}
            setIsOpenDelete={setIsOpenDelete}
            setIsOpenPublish={setIsOpenPublish}
            limit={limit}
            offset={offsetValue}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>{t("dataAgreements.title")}</h1>
            {/* <div className={styles.actions}>
              <Tooltip title={t('dataAgreements.tooltipAddNew')} arrow>
                <IconButton
                  onClick={handleAddNewListing}
                  aria-label={t('dataAgreements.addButton')}
                  className={styles.actionButton}
                  sx={{ cursor: 'not-allowed' }}
                >
                  <PlusCircleIcon size={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('dataAgreements.tooltipDownload')} arrow>
                <IconButton
                  aria-label={t('dataAgreements.saveButton')}
                  className={styles.actionButton}
                  sx={{ cursor: 'not-allowed' }}
                >
                  <DownloadSimpleIcon size={25} />
                </IconButton>
              </Tooltip>
            </div> */}
          </div>
          <div className={styles.subtitleContainer}>
            <p className={styles.subtitle}>
              {t("dataAgreements.subtitle")}
            </p>
            <div className={styles.filters}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="radio-buttons-group-label"
                  defaultValue="all"
                  name="radio-buttons-group"
                  row
                >
                  <FormControlLabel
                    value="all"
                    onChange={() => handleChange("all")}
                    control={<Radio name="all" color="default" size="small" />}
                    label={
                      <Typography variant="body2">{t("common.all")}</Typography>
                    }
                  />
                  <FormControlLabel
                    value="complete"
                    onChange={() => handleChange("complete")}
                    control={
                      <Radio name="complete" color="default" size="small" />
                    }
                    label={
                      <Typography variant="body2">
                        {t("dataAgreements.list")}
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      {renderContent()}

      {selectedDDA && (
        <ViewDDAgreementModalInner
          open={isOpenViewDDA}
          setOpen={handleCloseModal}
          mode="private"
          selectedData={selectedDDA}
          dataSourceName={getDataSourceDetails(selectedDDA).dataSourceName}
          dataSourceLocation={getDataSourceDetails(selectedDDA).dataSourceLocation}
          dataSourceDescription={selectedDDA.purposeDescription || ''}
          coverImage={getDataSourceDetails(selectedDDA).coverImage}
          logoImage={getDataSourceDetails(selectedDDA).logoImage}
          trusted={getDataSourceDetails(selectedDDA).trusted}
        />
      )}
      {selectedDDA && (
        <GeneralModal
          open={isOpenDelete}
          setOpen={setIsOpenDelete}
          confirmText={t("dataAgreements.deleteModal.confirmText")}
          headerText={t("dataAgreements.deleteModal.title")}
          modalDescriptionText={
            <Typography variant="body1">
              {t("dataAgreements.deleteModal.description")}
            </Typography>
          }
          resourceName={"dataDisclosureAgreements"}
          confirmButtonText={t("dataAgreements.deleteModal.confirmButton")}
          selectedData={{
            templateId: selectedDDA.templateId,
            purpose: selectedDDA.purpose
          }}
          onSuccess={refetch}
        />
      )}
      {selectedDDA && (
        <ListDDAModal
          open={isOpenPublish}
          setOpen={setIsOpenPublish}
          headerText={t("dataAgreements.publishModal.title")}
          resourceName={"dataDisclosureAgreements"}
          confirmButtonText={t("dataAgreements.publishModal.confirmButton")}
          selectedData={{
            id: selectedDDA.templateId || (selectedDDA as any)?.dataAgreementId || (selectedDDA as any)?.dataAgreementRevisionId || (selectedDDA as any)["@id"],
            templateId: selectedDDA.templateId,
            status: selectedDDA.status,
            purpose: selectedDDA.purpose
          }}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default DDAgreements;
