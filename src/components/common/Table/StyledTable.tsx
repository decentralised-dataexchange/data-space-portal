"use client";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    backgroundColor: "#e5e4e4",
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.875rem",
    fontWeight: "lighter",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    whiteSpace: 'nowrap',
  },
}));

export const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
});
