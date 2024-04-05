import React from 'react';
import { Box, Typography } from '@mui/material'; // Assuming Material-UI components are used

const DataControllerCard = () => {
  return (
    < >
      <InfoRow label="Name" value="Hospital AB" />
      <InfoRow label="DID" value="did:sov:5FrPfLA8iLtMA3rJqwM7Qg" />
      <InfoRow label="Legal ID" value="did:sov:5FrPfLA8iLtMA3rJqwM7Qg"/>
      <InfoRow label="URL" value="https://igrant.io/policy.html" />
      <InfoRow label="Industry Sector" value="Healthcare" />
    </>
  );
}

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
      <Typography color="grey" variant="subtitle2">{value}</Typography>
    </Box>
  );
}

export default DataControllerCard;
