import React, { useState } from "react";
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
  selectedValue: any;
  setSelectedValue: any;
  key: any;
  setSelectedDropdownDataAgreementValue: any;
}

const VersionDropdown = (props: Props) => {
  const {
    record,
  } = props;

  const [ selectedValue, setSelectedValue ] = useState('1.0.1');

const dataAgreementFromRevision = [
    {
        version: "1.0.2",
        active: true,
    },
    {
        version: "1.0.3",
        active: true,
    },
    {
        version: "1.0.4",
        active: true,
    }
]

//   useEffect(() => {
//     let dataAgreementFromRevision: any = record.revisions?.map(
//       (revision: any) => {
//         return JSON.parse(revision.objectData);
//       }
//     );

//     if (record.active === false && filter === "all") {
//       dataAgreementFromRevision = [
//         record,
//         ...(dataAgreementFromRevision !== undefined
//           ? dataAgreementFromRevision
//           : []),
//       ];
//       setDataAgreementFromRevision(dataAgreementFromRevision);
//     } else {
//       setDataAgreementFromRevision(dataAgreementFromRevision);
//     }
//   }, [record]);

//   const setDefaultSelectedValueNew =
//     dataAgreementFromRevision && dataAgreementFromRevision.length > 0
//       ? dataAgreementFromRevision[0].version
//       : "";

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  }

//     const selectedRevision = dataAgreementFromRevision?.find(
//       (dataAgreement: any) => dataAgreement.version === event.target.value
//     );

//     record.selectedRevision = selectedRevision;
//   };

//   const newSelectedValue =
//     selectedValue[record.id] || setDefaultSelectedValueNew;

  return (
    <>
      <Select
        onChange={(e) => handleChange(e)}
        variant="outlined"
        value={selectedValue}
        fullWidth
        style={{
          ...dropDownStyle,
          width: "120px"
        }}
        renderValue={(value) => (
          <span
            style={{
              color:"black"
            }}
          >
            {value}
          </span>
        )}
      >
        {dataAgreementFromRevision?.map((versions: any, index: number) => (
          <MenuItem
            key={index}
            value={versions.version}
            style={{ color: versions.active === false ? "red" : "black" }}
          >
            {versions.version}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default VersionDropdown;
