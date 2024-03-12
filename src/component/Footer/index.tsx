import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  txt: string;
  direction?: string
}
const Footer = (props: Props) => {
  const { txt, direction } = props;
  return (
    <Box display={"flex"} flexDirection={direction ? "row" : "column"}>
      <Typography variant="caption">{txt}</Typography>
      <Typography color="grey" variant="caption">
        &nbsp;Powered by{" "}
        <a
          href="https://igrant.io/"
          target="blank"
          style={{
            textDecoration: "none",
            color: "#1890ff",
          }}
        >
          iGrant.io
        </a>
        , Sweden
      </Typography>
    </Box>
  );
};

export default Footer;
