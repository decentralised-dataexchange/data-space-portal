import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  version: String;
}
const Footer = (props: Props) => {
  const { version } = props;
  return (
    <Box display={"flex"} flexDirection="column">
      <Typography variant="caption">{version}</Typography>
      <Typography color="grey" variant="caption">
        Powered by{" "}
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
