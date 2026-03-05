"use client";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/system";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#1d1d1f",
    padding: "10px 16px",
    border: "none",
    borderBottom: "1px solid #e8e8ed",
    backgroundColor: "#f5f5f7",
    whiteSpace: 'nowrap',
    letterSpacing: '-0.01em',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.8125rem",
    fontWeight: 400,
    color: "#1d1d1f",
    padding: "10px 16px",
    border: "none",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: 'nowrap',
  },
}));

export const StyledTableRow = styled(TableRow)({
  border: "none",
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: '#f5f5f7',
  },
});
