import React from "react";
import { Box, Typography } from "@mui/material";
import LanguageSelector from "./LanguageSelector";

interface Props {
  txt: string;
}
const Footer = (props: Props) => {
  const { txt } = props;
  return (
    <Box>
      <LanguageSelector /> |&nbsp;
      <Typography variant="caption" className="pr-2">{txt}</Typography> |
      <Typography className="pr-2" variant="caption">
        &nbsp;Powered by{" "}
        <a
          href="https://igrant.io/"
          target="blank"
          style={{
            textDecoration: "none",
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
