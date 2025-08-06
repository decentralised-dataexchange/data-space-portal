"use client";
import React, { useState } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { useTranslations } from "next-intl";
import { CaretRight as CaretRightIcon, CaretDown as CaretDownIcon } from "@phosphor-icons/react";
import DataAgreementPolicyCardModal from "./dataPolicyCardModal";

const titleAttrRestrictionStyle = {
  fontWeight: "normal",
  marginTop: "20px",
  lineHeight: "1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid #DFE0E1",
  borderRadius: "7px",
  padding: "12px",
  backgroundColor: "#FFFFFF",
};

interface Props {
  selectedData: any;
  handleCloseViewDDAModal: (open: boolean) => void;
}

export const DDAPolicyCard = (props: Props) => {
  const t = useTranslations();
  const { selectedData, handleCloseViewDDAModal } = props;
  const [openDataAgreementPolicyModal, setOpenDataAgreementPolicyModal] =
    useState(false);

  const handleCardClick = () => {
    setOpenDataAgreementPolicyModal(true);
  };

  return (
    <>
      <Box style={titleAttrRestrictionStyle} onClick={handleCardClick}>
        <Typography color="black" variant="subtitle2">
          {t("dataAgreements.dataAgreementPolicy")}
        </Typography>
        <CaretRightIcon style={{ color: "black" }} size={20}/>
      </Box>
      <DataAgreementPolicyCardModal
        open={openDataAgreementPolicyModal}
        setOpen={setOpenDataAgreementPolicyModal}
        headerText={t("dataAgreements.dataDisclosureAgreementPolicy")}
        selectedData={selectedData}
        handleCloseViewDDAModal={handleCloseViewDDAModal}
      />
    </>
  );
};
