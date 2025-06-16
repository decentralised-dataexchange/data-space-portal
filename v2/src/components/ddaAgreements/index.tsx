"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import "../DataSources/style.scss";
import { useTranslations } from "next-intl";
import { DataDisclosureAgreement, DataSource, DataSourceListResponse } from "@/types/dataDisclosureAgreement";
import DDAtable from "./ddaTable";
import ViewDDAgreementModalInner from "../DataSources/ViewDDAgreementModalInner";
import GeneralModal from "./generalModal";
import ListDDAModal from "./listDDAModal";
import { useDDAgreements } from "@/custom-hooks/dataDisclosureAgreements";
import { defaultLogoImg } from "@/constants/defalultImages";
import { useGetDataSourceList } from "@/custom-hooks/dataSources";

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
    if (!dataAgreement) return { coverImage: "", logoImage: defaultLogoImg };
    
    if (!dataSources) {
      return { coverImage: "", logoImage: defaultLogoImg };
    }
    
    // Extract the data sources list from the response
    const dataSourcesList = dataSources && typeof dataSources === 'object' && 'dataSources' in dataSources ? 
      dataSources.dataSources : 
      (Array.isArray(dataSources) ? dataSources : []);
    
    if (!dataSourcesList.length) {
      return { coverImage: "", logoImage: defaultLogoImg };
    }
    
    // Find the data source that contains this DDA
    for (const item of dataSourcesList) {
      if (!item?.dataSource) continue;
      
      const agreements = item.dataDisclosureAgreements || [];
      
      // Find matching DDA by templateId
      const matchingDDA = agreements.find(
        (dda: DataDisclosureAgreement) => dda?.templateId === dataAgreement.templateId
      );
      
      if (matchingDDA) {
        // Return the cover image and logo from the matched data source
        const coverImage = item.dataSource.coverImageUrl || '';
        const logoImage = item.dataSource.logoUrl || defaultLogoImg;
        return { coverImage, logoImage };
      }
    }
    
    return { coverImage: "", logoImage: defaultLogoImg };
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

  return (
    <>
      <Box sx={{ margin: "15px 10px" }} className="dd-container">
        <Box className="d-flex space-between">
          <span className="dd-titleTxt">{t("dataAgreements.title")}</span>
          <Box component="div">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
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
          </Box>
        </Box>
        <Box sx={{ marginTop: "16px" }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {commonT("errors.generic")}
            </Alert>
          ) : data?.dataDisclosureAgreements.length === 0 ? (
            <Alert severity="info" sx={{ my: 2 }}>
              {commonT("noResultsFound")}
            </Alert>
          ) : (
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
          )}
        </Box>

        {selectedDDA && (
          <ViewDDAgreementModalInner
            open={isOpenViewDDA}
            setOpen={handleCloseModal}
            mode="private"
            selectedData={selectedDDA}
            dataSourceName={t("common.name")}
            dataSourceLocation=""
            dataSourceDescription={selectedDDA.purposeDescription || ''}
            coverImage={getDataSourceDetails(selectedDDA).coverImage}
            logoImage={getDataSourceDetails(selectedDDA).logoImage}
          />
        )}
        {selectedDDA && (
          <GeneralModal
            open={isOpenDelete}
            setOpen={setIsOpenDelete}
            confirmText={"DELETE"}
            headerText={"Delete Data Agreement"}
            modalDescriptionText={
              <Typography variant="body1">
                Are you sure you want to delete this data agreement? This action cannot be undone.
              </Typography>
            }
            resourceName={"dataDisclosureAgreements"}
            confirmButtonText={"Delete"}
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
            headerText={"Publish to Marketplace"}
            resourceName={"dataDisclosureAgreements"}
            confirmButtonText={"Submit"}
            selectedData={{
              id: selectedDDA.templateId,
              templateId: selectedDDA.templateId,
              status: selectedDDA.status,
              purpose: selectedDDA.purpose
            }}
            onSuccess={refetch}
          />
        )}
      </Box>
    </>
  );
};

export default DDAgreements;
