import React from "react";
import { Box } from "@mui/material";
import { CustomSelect } from "./common";

interface Props {
  record: any;
}

const VersionDropdown = (props: Props) => {
  const { record } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <CustomSelect
        value={record.version}
        options={[{ value: record.version, label: record.version }]}
        sx={{
          '& .MuiSelect-select': {
            color: record.status === 'unlisted' ? '#FF0C10' : 'black',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        disabled={false}
      />
    </Box>
  );
};

export default VersionDropdown;
