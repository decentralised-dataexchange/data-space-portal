import React from "react";
import { Box, Typography } from "@mui/material"; 

const DataControllerCard = ({ selectedData }) => {
  return (
    <Box 
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '7px',
        padding: '12px',
        border: '1px solid #DFE0E1',
      }}
    >
      <InfoRow label="Name" value={selectedData?.dataController.name} />
      <InfoRow label="DID" value={selectedData?.dataController.did} />
      <InfoRow label="Legal ID" value={selectedData?.dataController.legalId} />
      <InfoRow label="URL" value={selectedData?.dataController.url} />
      <InfoRow
        label="Industry Sector"
        value={selectedData?.dataController.industrySector}
      />
    </Box>
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
      <Typography variant="subtitle2" color="black">{label}</Typography>
      <Typography variant="subtitle2" color="black">
        {value}
      </Typography>
    </Box>
  );
};

export default DataControllerCard;
