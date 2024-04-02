import { Typography, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface DataExchangeModeFormControlProps {
  open: boolean;
  mode: string;
  selectededDataAgreementFromDataAgreement: any;
}

interface DataExchangeModeProps {
  mode: string;
  onChange: (e: React.SyntheticEvent) => void;
  value: any;
  selectededDataAgreementFromDataAgreement: any;
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

export const DataExchangeMode = (props: DataExchangeModeProps) => {
  const { t } = useTranslation("translation");

  const dataExchangeModes = [
    { value: "null", label: t("dataAgreements.none") },
    { value: "data_source", label: t("dataAgreements.dataSource") },
    {
      value: "data_using_service",
      label: t("dataAgreements.dataUsingService"),
    },
  ];

  return (
    <>
      <Select
        onChange={(e: any) => {
          props.onChange(e);
        }}
        variant="outlined"
        fullWidth
        value={props.value}
        name="AttributeType"
        disabled={true}
        renderValue={() => (
          <span
            style={{
              color:"black"
            }}
          >
            English
          </span>
        )}
        style={
          props.mode === "Read"
            ? {
                ...disabledDropDownStyle,
                width: "200px",
                // marginTop: "-10px",
              }
            : {
                ...dropDownStyle,
                width: "200px",
                // marginTop: "-10px",
              }
        }
      >
        {dataExchangeModes.map((modes) => (
          <MenuItem key={modes?.label} value={modes.value}>
            {modes.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export const DataExchangeModeFormControl = (
  props: DataExchangeModeFormControlProps
) => {
  const { t } = useTranslation("translation");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Typography variant="subtitle1">
          Language
        </Typography>
         <FormControl>
        <DataExchangeMode
            onChange={() => {}}
            value='English'
            mode={props.mode}
            selectededDataAgreementFromDataAgreement={
                props?.selectededDataAgreementFromDataAgreement
            }
            />
        </FormControl>
      </Box>
    </>
  );
};
