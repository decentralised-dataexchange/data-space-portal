"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import DataAgreementPolicyCardModal from "./dataPolicyCardModal";
import { CaretRight as CaretRightIcon } from "@phosphor-icons/react";

interface Props {
  selectedData: any;
  handleCloseViewDDAModal: (open: boolean) => void;
  dataSourceSignatureDecoded?: any;
  dataUsingServiceSignatureDecoded?: any;
}

export const DDAPolicyCard = (props: Props) => {
  const t = useTranslations();
  const { selectedData, handleCloseViewDDAModal, dataSourceSignatureDecoded, dataUsingServiceSignatureDecoded } = props;
  const [openDataAgreementPolicyModal, setOpenDataAgreementPolicyModal] = useState(false);

  return (
    <>
      <Box sx={{ width: '100%', backgroundColor: '#FFFFFF', borderRadius: '7px' }}>
        <Box
          onClick={() => setOpenDataAgreementPolicyModal(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            cursor: 'pointer',
            // Match AttributeTable row spacing
            mt: 1.25,
            mx: 1.25,
            mb: 0.625,
            py: 1.25,
            pr: 1.25,
          }}
        >
          <Typography variant="subtitle2" color="black" sx={{ fontSize: '14px' }}>
            {t("dataAgreements.dataDisclosureAgreementPolicy")}
          </Typography>
          <CaretRightIcon size={20} style={{ color: 'black' }} />
        </Box>
      </Box>
      <DataAgreementPolicyCardModal
        open={openDataAgreementPolicyModal}
        setOpen={setOpenDataAgreementPolicyModal}
        headerText={t("dataAgreements.dataDisclosureAgreementPolicy")}
        selectedData={selectedData}
        handleCloseViewDDAModal={handleCloseViewDDAModal}
        dataSourceSignatureDecoded={dataSourceSignatureDecoded}
        dataUsingServiceSignatureDecoded={dataUsingServiceSignatureDecoded}
      />
    </>
  );
};
