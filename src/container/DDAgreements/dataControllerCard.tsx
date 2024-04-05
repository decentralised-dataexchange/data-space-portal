import React from "react";
import { Box, Typography } from "@mui/material"; 
const DataControllerCard = ({ selectedData }) => {
  return (
    <>
      <InfoRow label="Name" value={selectedData.dataController.name} />
      <InfoRow label="DID" value={selectedData.dataController.did} />
      <InfoRow label="Legal ID" value={selectedData.dataController.legalId} />
      <InfoRow label="URL" value={selectedData.dataController.url} />
      <InfoRow
        label="Industry Sector"
        value={selectedData.dataController.industrySector}
      />
    </>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "solid 1px #dee2e6",
        padding: "12px",
      }}
    >
      <Typography variant="subtitle2">{label}</Typography>
      <Typography color="grey" variant="subtitle2">
        {value}
      </Typography>
    </Box>
  );
};

export default DataControllerCard;
