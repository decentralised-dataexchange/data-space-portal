import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import CustomSelect from "./common/CustomSelect";

interface Props {
  record: any;
  value: string;
  onChange: (value: string) => void;
}

const VersionDropdown = (props: Props) => {
  const { record, value, onChange } = props;

  const options = useMemo(() => {
    const currentVersion = record?.version || record?.templateVersion;
    const current = currentVersion ? [String(currentVersion)] : [];
    const revs = Array.isArray(record?.revisions)
      ? record.revisions
          .map((rev: any) => rev?.version || rev?.templateVersion)
          .filter(Boolean)
          .map((v: any) => String(v))
      : [];
    // Deduplicate while preserving order (current version first)
    const seen = new Set<string>();
    const ordered = [...current, ...revs].filter((v) => {
      if (!v || seen.has(v)) return false;
      seen.add(v);
      return true;
    });
    return ordered.map((v) => ({ value: v, label: v }));
  }, [record]);

  const valuesSet = useMemo(() => new Set(options.map((o) => String(o.value))), [options]);
  const fallback = String(record?.version || record?.templateVersion || "");
  const selectedValue = valuesSet.has(String(value)) ? String(value) : fallback;

  useEffect(() => {
    // If the incoming value is not in the options, align parent with current version
    if (!valuesSet.has(String(value)) && (record?.version || record?.templateVersion) && onChange) {
      onChange(String(record?.version || record?.templateVersion));
    }
  }, [valuesSet, value, record, onChange]);

  return (
    <Box sx={{ width: '100%' }}>
      <CustomSelect
        value={selectedValue}
        onChange={onChange}
        options={options}
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
