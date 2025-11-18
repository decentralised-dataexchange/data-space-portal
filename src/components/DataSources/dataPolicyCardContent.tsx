"use client";
import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTranslations } from "next-intl";

interface Props {
  selectedData: any;
}

export const DataAgreementPolicyContent = (props: Props) => {
  const t = useTranslations();
  const { selectedData } = props;
  
  const SSIpolicyDetailsForContainer = [
    {
      name: "Lawful basis of processing",
      value: selectedData?.lawfulBasis || "Not specified",
    },
    {
      name: "Method of use",
      value: selectedData?.methodOfUse || "Not specified",
    },
    {
      name: "Policy URL",
      value: selectedData?.policyUrl || "Not specified",
    },
    {
      name: "Purpose",
      value: selectedData?.purpose || "Not specified",
    },
    {
      name: "Purpose description",
      value: selectedData?.purposeDescription || "Not specified",
    },
    {
      name: "Third party disclosure",
      value: selectedData?.thirdPartyDisclosure ? "Yes" : "No",
    },
  ];

  return (
    <Box className="dd-modal-container" sx={{ backgroundColor: '#FFFFFF', borderRadius: '7px', padding: '16px' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
        {t("dataAgreements.dataAgreementPolicy")}
      </Typography>
      
      {SSIpolicyDetailsForContainer.map((item, index) => (
        <Box key={index} sx={{ marginBottom: '12px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {item.name}
          </Typography>
          <Typography variant="body2">
            {item.value}
          </Typography>
          {index < SSIpolicyDetailsForContainer.length - 1 && (
            <Divider sx={{ marginTop: '12px' }} />
          )}
        </Box>
      ))}
    </Box>
  );
};
