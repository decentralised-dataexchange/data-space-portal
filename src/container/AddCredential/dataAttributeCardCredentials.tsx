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
}

export const DataAttributeCardForDDA = (props: Props) => {
  const { selectedData } = props;

  return (
    <Box
      style={{
        marginTop: "10px",
        border: "1px solid #DFE0E1",
        borderRadius: 5,
        paddingTop: 10,
        paddingBottom: 10,
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
                    {attribute.attribute}
                  </Typography>
                  <Typography variant="subtitle2">
                    {attribute.value}
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
