import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  mode: string;
}

const inputStyle = {
  width: "100%",
  border: "1",
  outline: "none",
  fontSize: "14px",
  color: "#495057",
  borderWidth: 0,
  borderRadius: 0,
  backgroundColor: "#FFFF",
  borderBottom: "2px solid #DFE0E1",
};

export const PurposeDescription = (props: Props) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Typography mb={1.3} mt={1.3} variant="subtitle1">
      {t("common.description")}
        <span style={{ color: "rgba(224, 7, 7, 0.986)" }}>*</span>
      </Typography>
      <textarea
        disabled={props.mode === "Read"}
        placeholder={t("dataAgreements.descritptionInputPlaceholder")}
        style={{
          ...inputStyle,
          cursor: props.mode === "Read" ? "not-allowed" : "auto",
          height: "120px",
          fontFamily: "Roboto,Helvetica,Arial,sans-serif",
        }}
        rows={5}
        cols={25}
        maxLength={500}
      />
    </>
  );
};
