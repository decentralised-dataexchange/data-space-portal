import React from "react";
import { Box, Typography } from "@mui/material";
import LanguageSelector from "../LanguageSelector";

interface Props {
  txt: string;
}
const Footer = (props: Props) => {
  const { txt } = props;
  return (
    <Box className=".d-flex-center">
      <LanguageSelector /> |&nbsp;
      <Typography variant="caption" color="grey" className="pr-2">{txt}</Typography> |
      <Typography color="grey" className="pr-2" variant="caption">
        &nbsp;Powered by{" "}
        <a
          href="https://igrant.io/"
          target="blank"
          style={{
            textDecoration: "none",
            color: "#808080",
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
