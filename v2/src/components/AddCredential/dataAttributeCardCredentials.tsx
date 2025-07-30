import React from "react";
import { Box, Typography } from "@mui/material";

const titleAttrRestrictionStyle = (isLastAttribute: boolean) => ({
  fontWeight: "normal",
  margin: "10px 10px 5px 10px",
  borderBottom: isLastAttribute ? "none" : "solid 1px #dee2e6",
  lineHeight: "1.5rem",
});

const tableAttrAdditionalInfoStyle = {
  border: 0,
  width: "100%",
  maxWidth: "100%",
  marginBottom: "0rem",
  backgroundColor: "#FFFF",
};

interface Props {
  selectedData: any;
  showValues?: boolean;
}

export const DataAttributeCardForDDA = (props: Props) => {
  const { selectedData, showValues = true } = props;

  const splitByDotAndGetLastWord = (text: string) => {
      const parts = text.split(".");
      const lastValue = parts[parts.length - 1];
      return lastValue
  }

  const camelCaseToWords = (str: string) => {
    const words = str.match(/[A-Z]*[^A-Z]+/g);
    return words ? words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : str;
  };

  return (
    <Box
      style={{
        marginTop: "16px",
        border: "1px solid #DFE0E1",
        borderRadius: 7, // Updated to 7px border radius
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#FFFFFF", // Added white background
      }}
    >
      {selectedData?.map((attribute: any, index: number) => {
        const isLastAttribute = index === (selectedData?.length || 0) - 1;

        return (
          <Box key={index} style={titleAttrRestrictionStyle(isLastAttribute)}>
            <table style={tableAttrAdditionalInfoStyle}>
              <tbody>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2">
                    {camelCaseToWords(splitByDotAndGetLastWord(attribute.attribute))}
                  </Typography>
                  <Typography variant="subtitle2">
                    {showValues ? attribute.value : '••••••••'}
                  </Typography>
                </tr>
              </tbody>
            </table>
          </Box>
        );
      })}
    </Box>
  );
};
