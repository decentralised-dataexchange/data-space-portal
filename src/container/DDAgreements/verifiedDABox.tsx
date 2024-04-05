import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import LockIcon from "@mui/icons-material/Lock";

interface Props {
  selectedData: any;
}

const VerfiedDABoxForDDA = ({ selectedData }: Props) => {

  const verifiedData = [
    {
      title: "Controller Decentralised Identifier",
      value: "3KYTwpwNVYNFR9XmQYBEFrYi4TVQXjQSDEYVVqasoXxn"
        // selectedData.data_disclosure_agreement.proofChain &&
        // selectedData.data_disclosure_agreement?.proofChain[0]
        //   ?.verificationMethod
        //   ? selectedData.data_disclosure_agreement?.proofChain[0]
        //       ?.verificationMethod
        //   : selectedData.data_disclosure_agreement?.proof?.verificationMethod,
    },
    {
      title: "Signature",
      value: "3KYTwpwNVYNFR9XmQYBEFrYi4TVQXjQSDEYVVqasoXxn"
        // selectedData.data_disclosure_agreement.proofChain &&
        // selectedData.data_disclosure_agreement?.proofChain[0]?.proofValue
        //   ? selectedData.data_disclosure_agreement?.proofChain[0]?.proofValue
        //   : selectedData.data_disclosure_agreement?.proof?.proofValue,
    },
  ];

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <Typography variant="subtitle1">Verified Data Agreement</Typography>
        <LockIcon color="success" fontSize="small" />
      </Box>
      {verifiedData.map((data, index) => (
        <Box
          key={index}
          style={{
            display: "grid",
            padding: "10px",
          }}
        >
          <Typography variant="subtitle2">{data.title}</Typography>
          <Typography
            color="grey"
            variant="subtitle2"
            style={{ overflowWrap: "anywhere" }}
          >
            {data.value}
          </Typography>
        </Box>
      ))}
    </>
  );
};

export default VerfiedDABoxForDDA;
