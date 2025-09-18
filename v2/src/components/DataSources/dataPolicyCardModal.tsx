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
  const { open, setOpen, headerText, selectedData, handleCloseViewDDAModal } =
    props;
  
  // Create ref for the container
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const SSIpolicyDetailsForContainer: AttributeRow[] = [
    { label: "Lawful basis of processing", value: String(selectedData?.lawfulBasis ?? "") },
    { label: "Data retention period", value: String(selectedData?.dataSharingRestrictions?.dataRetentionPeriod ?? "") },
    { label: "Policy URL", value: String(selectedData?.dataSharingRestrictions?.policyUrl ?? ""), href: selectedData?.dataSharingRestrictions?.policyUrl || undefined },
    { label: "Jurisdiction", value: String(selectedData?.dataSharingRestrictions?.jurisdiction ?? "") },
    { label: "Industry sector", value: String(selectedData?.dataSharingRestrictions?.industrySector ?? "") },
    { label: "Geographic restriction", value: String(selectedData?.dataSharingRestrictions?.geographicRestriction ?? "") },
    { label: "Storage location", value: String(selectedData?.dataSharingRestrictions?.storageLocation ?? "") },
    { label: "Agreement Period", value: String(selectedData?.agreementPeriod ?? "") },
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

        
          </Box>
          <Box className="modal-footer" sx={{
            width: 594,
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
