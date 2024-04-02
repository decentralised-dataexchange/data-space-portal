import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
// import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ConnectedAgreementProps {
  open: boolean;
  mode: string;
  onChange: (e: React.SyntheticEvent) => void;
  value: any;
  lawfullBasisOfProcessing:any
}

interface ConnectedAgreementFormControlProps {
  open: boolean;
  mode: string;
}

const dropDownStyle = {
  border: "1px solid lightgray",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "#FFFF",
  height: "38px",
  borderRadius: "5px",
  cursor: "pointer",
};

const disabledDropDownStyle = {
  border: "1px solid lightgray",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "#F7F6F6",
  height: "38px",
  borderRadius: "5px",
  cursor: "not-allowed",
};

export const LawfullBasisMethods = (props: ConnectedAgreementProps) => {
  return (
    <>
      <Select
        onChange={(e: any) => {
          props.onChange(e);
        }}
        variant="outlined"
        disabled={props.mode === "Read"}
        value={props.value}
        fullWidth
        name="LawfulBasisOfProcessing"
        renderValue={() => (
            <span
              style={{
                color:"black"
              }}
            >
              Connected Agreement
            </span>
          )}
        style={
          props.mode === "Read"
            ? {
                ...disabledDropDownStyle,
                width: "100%",
                marginBottom: "10px",
                marginTop: "-10px",
              }
            : {
                ...dropDownStyle,
                width: "100%",
                marginBottom: "10px",
                marginTop: "-10px",
              }
        }
      >
        {props.lawfullBasisOfProcessing.map((modes:any) => (
          <MenuItem key={modes?.label} value={modes.value}>
            {modes.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export const ConnectedAgreement = (
  props: ConnectedAgreementFormControlProps
) => {
  const { t } = useTranslation("translation");

  const lawfullBasisOfProcessing = [
    { value: 'consent', label: t("dataAgreements.consent") },
    { value: 'contract', label: t("dataAgreements.contract") },
    { value: 'legal_obligation', label: t("dataAgreements.legalObligation") },
    { value: 'vital_interest', label: t("dataAgreements.vitalInterest") },
    { value: 'public_task', label: t("dataAgreements.publicTask") },
    { value: 'legitimate_interest', label: t("dataAgreements.legitimateInterest") },
  ];

  return (
    <>
      {" "}
      <Typography mb={1.3} mt={1.3} variant="subtitle1">
        {t("dataAgreements.connectedData")}
        <span style={{ color: "rgba(224, 7, 7, 0.986)", }}>*</span>
      </Typography>
      <FormControl style={{ width: "100%"  }}>
            <LawfullBasisMethods
              onChange={() => {}}
              value='Connected Agreement'
              open={props.open}
              mode='Read'
              lawfullBasisOfProcessing={lawfullBasisOfProcessing}
        />
      </FormControl>
    </>
  );
};
