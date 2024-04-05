import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

interface Props {
  selectedData: any;
}

const IndividualDecentralisedIdentifierBoxForDDA = ({ selectedData }: Props) => {
  const { t } = useTranslation("translation");

  const verifiedData = [
    {
      title: "Individual Decentralised Identifier",
      value: "cZAVGiRgd9MXrsMo5NwhK4eJ22bBq4j36kx5YzaaYFj"
        // selectedData.data_disclosure_agreement?.proofChain &&
        // selectedData.data_disclosure_agreement?.proofChain[1]?.verificationMethod,
    },
    {
      title: "Signature",
      value: "eyJhbGciOiAiRWREU0EiLCAiYjY0IjogZmFsc2UsICJjcml0IjogWyJiNjQiXX0..zLpVC5lQwjRb1AVIUsASgS0kdDT0gq7aFbbGRcAqAcnj015pCm8t6bBmV8SBVTOXD0AegIsGRg88Sjfeiy2CAQ"
        // selectedData.data_disclosure_agreement?.proofChain &&
        // selectedData.data_disclosure_agreement?.proofChain[1]?.proofValue,
    },
  ];

  return (
    <>
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

export default IndividualDecentralisedIdentifierBoxForDDA;
