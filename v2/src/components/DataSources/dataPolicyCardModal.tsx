"use client";
import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box, useTheme } from "@mui/material";

import { useTranslations } from "next-intl";
import { CaretLeftIcon, XIcon } from "@phosphor-icons/react";

import DataControllerCard from "./dataControllerCard";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  headerText: string;
  selectedData: any;
  handleCloseViewDDAModal: (open: boolean) => void;
  dataSourceSignatureDecoded?: any;
  dataUsingServiceSignatureDecoded?: any;
}

const titleAttrRestrictionStyle = {
  fontWeight: "normal",
  marginTop: "20px",
  lineHeight: "1.5rem",
  display: "grid",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid #DFE0E1",
  borderRadius: 5,
  padding: "12px",
};

export default function DataAgreementPolicyCardModal(props: Props) {
  const t = useTranslations();
  const theme = useTheme();
  const { open, setOpen, headerText, selectedData, handleCloseViewDDAModal, dataSourceSignatureDecoded, dataUsingServiceSignatureDecoded } =
    props;
  
  // Create ref for the container
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const SSIpolicyDetailsForContainer: AttributeRow[] = [
    { label: t('dataAgreements.policy.lawfulBasis'), value: String(selectedData?.lawfulBasis ?? "") },
    { label: t('dataAgreements.policy.dataRetentionPeriod'), value: String(selectedData?.dataSharingRestrictions?.dataRetentionPeriod ?? "") },
    { label: t('dataAgreements.policy.policyUrl'), value: String(selectedData?.dataSharingRestrictions?.policyUrl ?? ""), href: selectedData?.dataSharingRestrictions?.policyUrl || undefined },
    { label: t('dataAgreements.policy.jurisdiction'), value: String(selectedData?.dataSharingRestrictions?.jurisdiction ?? "") },
    { label: t('dataAgreements.policy.industrySector'), value: String(selectedData?.dataSharingRestrictions?.industrySector ?? "") },
    { label: t('dataAgreements.policy.geographicRestriction'), value: String(selectedData?.dataSharingRestrictions?.geographicRestriction ?? "") },
    { label: t('dataAgreements.policy.storageLocation'), value: String(selectedData?.dataSharingRestrictions?.storageLocation ?? "") },
    { label: t('dataAgreements.policy.agreementPeriodYears'), value: String(selectedData?.agreementPeriod ?? "") },
  ];

  return (
    <React.Fragment>
      <Drawer 
        anchor="right" 
        open={open} 
        className="drawer-dda"
        style={{ zIndex: 9999 }}
        SlideProps={{
          style: { zIndex: 9999 }
        }}
      >

        <Box className="dd-modal-container">
          <Box className="dd-modal-header" sx={{paddingRight: 2}}>
            <Box pl={2} display={"flex"} alignItems={"center"}>
              <CaretLeftIcon
                size={22}
                className="dd-modal-header-icon"
                onClick={() => {
                  setOpen(false);
                }}
              />
              <Typography color="#F3F3F6" sx={{ fontSize: '16px' }}>{headerText}</Typography>
            </Box>
            <XIcon
              size={22}
              className="dd-modal-header-icon"
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
            />
          </Box>

          <Box className="dd-modal-details" style={{ paddingBottom: "70px", backgroundColor: '#F7F6F6' }}>
            <Box m={1.5}>
              <DataControllerCard selectedData={selectedData} />
            </Box>
            <Box m={1.5}>
              <AttributeTable rows={SSIpolicyDetailsForContainer} showValues={true} hideEmptyDash={true} labelMinWidth={200} labelMaxPercent={40} />
            </Box>

            {/* Data Source Signature */}
            {dataSourceSignatureDecoded && (
              <Box m={1.5}>
                <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
                  {t('signedAgreements.signatures.dataSourceSignature')}
                </Typography>
                <Box sx={{ marginTop: '16px' }}>
                  <AttributeTable
                  rows={(() => {
                    const excludedKeys = ["exp", "iat", "iss", "jti", "nbf", "sub", "status", "cnf", "kb", "vct"];
                    const decoded = dataSourceSignatureDecoded;
                    const rows: AttributeRow[] = [];
                    
                    Object.keys(decoded).forEach((key) => {
                      if (!excludedKeys.includes(key)) {
                        const value = decoded[key];
                        // Check if value is a URL
                        const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
                        // Convert value to string for display
                        const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
                        rows.push({
                          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value: displayValue,
                          tooltip: null,
                          description: '',
                          href: isUrl ? displayValue : undefined
                        });
                      }
                    });
                    
                    return rows;
                  })()}
                  showValues={true}
                  hideEmptyDash={false}
                  labelMinWidth={200}
                  labelMaxPercent={40}
                  />
                </Box>
              </Box>
            )}

            {/* Data Using Service Signature */}
            {dataUsingServiceSignatureDecoded && (
              <Box m={1.5}>
                <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
                  {t('signedAgreements.signatures.dataUsingServiceSignature')}
                </Typography>
                <Box sx={{ marginTop: '16px' }}>
                  <AttributeTable
                  rows={(() => {
                    const excludedKeys = ["exp", "iat", "iss", "jti", "nbf", "sub", "status", "cnf", "kb", "vct"];
                    const decoded = dataUsingServiceSignatureDecoded;
                    const rows: AttributeRow[] = [];
                    
                    Object.keys(decoded).forEach((key) => {
                      if (!excludedKeys.includes(key)) {
                        const value = decoded[key];
                        // Check if value is a URL
                        const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
                        // Convert value to string for display
                        const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
                        rows.push({
                          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                          value: displayValue,
                          tooltip: null,
                          description: '',
                          href: isUrl ? displayValue : undefined
                        });
                      }
                    });
                    
                    return rows;
                  })()}
                  showValues={true}
                  hideEmptyDash={false}
                  labelMinWidth={200}
                  labelMaxPercent={40}
                  />
                </Box>
              </Box>
            )}
        
          </Box>
          <Box className="modal-footer" sx={{
            width: 580,
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          }}>
            <Button
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
              className="delete-btn"
              variant="outlined"
            >
              {t("common.close")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
