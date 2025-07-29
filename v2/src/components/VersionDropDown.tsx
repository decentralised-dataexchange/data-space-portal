import React from "react";
import { CustomSelect } from "./common";

interface Props {
  record: any;
}

const VersionDropdown = (props: Props) => {
  const { record } = props;

  return (
    <CustomSelect
      value={record.version}
      options={[{ value: record.version, label: record.version }]}
      sx={{
        '& .MuiSelect-select': {
          color: record.status === 'unlisted' ? '#FF0C10' : 'black',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
        },
      }}

    />
  );
};

export default VersionDropdown;
