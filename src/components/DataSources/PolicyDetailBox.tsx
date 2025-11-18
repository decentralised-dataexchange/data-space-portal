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
        alignItems: "center",
        borderBottom: isLastAttribute ? "none" : "solid 1px #dee2e6",
        padding: "6px 16px",
      }}
    >
      <Typography variant="subtitle2" color="black">{name}</Typography>
      <Typography variant="subtitle2" color="black">
        {value}
      </Typography>
    </Box>
  );
};

export default PolicyDetailsBox;
 