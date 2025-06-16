import React from "react";
import { MenuItem, Select } from "@mui/material";

const dropDownStyle = {
  border: "1px solid lightgray",
  outline: "none",
  fontSize: "14px",
  backgroundColor: "#FFFF",
  height: "28px",
  borderRadius: "5px",
  cursor: "pointer",
  padding: 0,
  margin: 0,
};

interface Props {
  record: any;
}

const VersionDropdown = (props: Props) => {
  const { record } = props;

  return (
    <>
      <Select
        variant="outlined"
        value={record.version}
        fullWidth
        style={{
          ...dropDownStyle,
          width: "100%",
        }}
        renderValue={(value) => (
          <span
            style={{
              color: record.status === "unlisted" ? "#FF0C10" : "black",
            }}
          >
            {value}
          </span>
        )}
      >
        <MenuItem
          value={record.version}
          style={{
            color: record.status === "unlisted" ? "#FF0C10" : "black",
          }}
        >
          {record.version}
        </MenuItem>
      </Select>
    </>
  );
};

export default VersionDropdown;
