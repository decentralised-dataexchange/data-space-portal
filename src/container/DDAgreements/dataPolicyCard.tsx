import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
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
  borderRadius: 5,
  padding: "12px",
};

interface Props {
  selectedData: any;
  handleCloseViewDDAModal: any;
}

export const DDAPolicyCard = (props: Props) => {
  const { selectedData, handleCloseViewDDAModal } = props;
  const { t } = useTranslation("translation");
  const [openDataAgreementPolicyModal, setOpenDataAgreementPolicyModal] =
    useState(false);

  const handleCardClick = () => {
    setOpenDataAgreementPolicyModal(true);
  };

  return (
    <>
      <Box style={titleAttrRestrictionStyle} onClick={handleCardClick}>
        <Typography color="grey" variant="subtitle2">
          Data Agreement Policy
        </Typography>
        <KeyboardArrowRightIcon style={{ color: "grey" }} />
      </Box>
      <DataAgreementPolicyCardModal
        open={openDataAgreementPolicyModal}
        setOpen={setOpenDataAgreementPolicyModal}
        headerText={"Data Disclosure Agreement Policy"}
        selectedData={selectedData}
        handleCloseViewDDAModal={handleCloseViewDDAModal}
      />
    </>
  );
};
