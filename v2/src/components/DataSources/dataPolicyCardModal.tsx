"use client";
import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslations } from "next-intl";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import PolicyDetailsBox from "./PolicyDetailBox";
import DataControllerCard from "./dataControllerCard";
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
  const { open, setOpen, headerText, selectedData, handleCloseViewDDAModal } =
    props;
  
  const SSIpolicyDetailsForContainer = [
    {
      name: "Lawful basis of processing",
      value: selectedData?.lawfulBasis,
    },
    {
      name: "Data retention period",
      value: selectedData?.dataSharingRestrictions.dataRetentionPeriod,
    },
    {
      name: "Policy URL",
      value: selectedData?.dataSharingRestrictions.policyUrl,
    },
    {
      name: "Jurisdiction",
      value: selectedData?.dataSharingRestrictions.jurisdiction,
    },
    {
      name: "Industry sector",
      value: selectedData?.dataSharingRestrictions.industrySector,
    },

    {
      name: "Geographic restriction",
      value: selectedData?.dataSharingRestrictions.geographicRestriction,
    },
    {
      name: "Storage location",
      value: selectedData?.dataSharingRestrictions.storageLocation,
    },
    {
      name: "Agreement Period",
      value:selectedData?.agreementPeriod,
    },
  
  ];

  return (
    <React.Fragment>
      <Drawer anchor="right" open={open} className="drawer-dda">
        <Box className="dd-modal-container">
          <Box className="dd-modal-header">
            <Box pl={2} display={"flex"} alignItems={"center"}>
              <ArrowBackIosIcon
                fontSize="small"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  setOpen(false);
                }}
              />
              <Typography color="#F3F3F6">{headerText}</Typography>
            </Box>
            <CloseIcon
              fontSize="large"
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
              sx={{ paddingRight: 2, cursor: "pointer", color: "#F3F3F6" }}
            />
          </Box>

          <Box className="dd-modal-details" style={{ paddingBottom: "70px" }}>
            <Box m={1.5} style={titleAttrRestrictionStyle}>
              <DataControllerCard selectedData={selectedData} />
            </Box>
            <Box m={1.5} style={titleAttrRestrictionStyle}>
              {SSIpolicyDetailsForContainer?.map((policyDetail, index) => (
                <PolicyDetailsBox
                  key={index}
                  selectedData={selectedData}
                  isLastAttribute={
                    index === SSIpolicyDetailsForContainer.length - 1
                  }
                  name={policyDetail.name}
                  value={policyDetail.value}
                />
              ))}
            </Box>

        
          </Box>
          <Box className="modal-footer ">
            <Button
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
              className="delete-btn"
              sx={{
                marginRight: "15px",
                color: "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
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
