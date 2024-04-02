import CSS from "csstype";
import React from "react";
import { useTranslation } from "react-i18next";

const tableCellStyle: CSS.Properties = {
  fontWeight: "normal",
  fontSize: "14px",
  borderTop: "solid 1px #dee2e6",
  textAlign: "left",
  borderRight: "solid 1px #dee2e6",
  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
};

const inputDataConfigStyle = {
  color: "#495057",
  border: "none",
  outline: "none",
  fontSize: "14px",
  width: "100%",
  backgroundColor: "#FFFF",
  fontFamily: "Roboto,Helvetica,Arial,sans-serif",
};

interface Props {
  mode: string;
}

const DataSharingRestriction = (props: Props) => {
  const { mode } = props;
  const { t } = useTranslation("translation");

  return (
    <table
      style={{
        border: "solid 1px #dee2e6",
        width: "100%",
        maxWidth: "100%",
        marginBottom: "1rem",
        marginTop: ".5rem",
      }}
    >
      <tbody>
        <tr>
          <th style={{ ...tableCellStyle, borderTop: 0 }} scope="row">
            PolicyUrl
          </th>

          <td style={{ ...tableCellStyle, borderTop: 0 }}>
            <input
              autoComplete="off"
              type="text"
              disabled={mode === "Read"}
              value='https://igrant.io/policy.html'
              style={{
                ...inputDataConfigStyle,
                cursor: mode === "Read" ? "not-allowed" : "auto",
              }}
            />
          </td>
        </tr>

        <tr>
          <th style={tableCellStyle} scope="row">
            Jurisdiction
          </th>

          <td style={tableCellStyle}>
            <input
              autoComplete="off"
              value="Sweden"
              type="text"
              disabled={mode === "Read"}
              style={{
                ...inputDataConfigStyle,
                cursor: mode === "Read" ? "not-allowed" : "auto",
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default DataSharingRestriction;
