import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
  isLastAttribute: boolean;
  selectedData: any;
  value: string;
  name: string;
}
const PolicyDetailsBox = (props: Props) => {
  const { isLastAttribute, name, value } = props;

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: isLastAttribute ? "none" : "solid 1px #dee2e6",
        padding: "12px",
      }}
    >
      <Typography variant="subtitle2">{name}</Typography>
      <Typography color="grey" variant="subtitle2">
        {value}
      </Typography>
    </Box>
  );
};

export default PolicyDetailsBox;
