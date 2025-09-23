"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { useTranslations } from "next-intl";
import { B2BConnectionItem } from "@/types/b2bConnection";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
});

// Inline numeric pagination to mirror DDA table
const NumericPaginationActions: React.FC<any> = ({ count, page, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil((count || 0) / (rowsPerPage || 1)) || 0;
  if (totalPages <= 1) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Pagination
        count={totalPages}
        page={(page ?? 0) + 1}
        onChange={(_, value) => onPageChange?.(null, value - 1)}
        size="small"
        siblingCount={0}
        boundaryCount={1}
        sx={{
          '& .MuiPagination-ul': { alignItems: 'center' },
          '& .MuiPaginationItem-root': {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            minWidth: 28, height: 28, lineHeight: '28px', fontSize: '12px', margin: '0 2px'
          },
          '& .MuiPaginationItem-root.MuiPaginationItem-previousNext': {
            minWidth: 28, height: 28, lineHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
          },
          '& .MuiPaginationItem-icon': { fontSize: 18, margin: 0, display: 'block' },
          '& .MuiSvgIcon-root': { fontSize: 18, verticalAlign: 'middle', display: 'block' },
          '& .MuiPaginationItem-previousNext .MuiPaginationItem-icon': { transform: 'translateY(-1px)' },
          '& .MuiPaginationItem-previousNext .MuiSvgIcon-root': { transform: 'translateY(-1px)' },
        }}
      />
    </Box>
  );
};

function safeDate(val?: string) {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toLocaleString();
}

export default function B2BTable({
  rows,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: {
  rows: B2BConnectionItem[];
  page: number; // zero-based for MUI
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
}) {
  const t = useTranslations();

  return (
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="b2b-connections-table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("b2bConnections.table.headers.b2bConnectionId")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.myClientId")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.theirClientId")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.timestamp")}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((item) => {
              const rec = item.b2bConnectionRecord;
              return (
                <StyledTableRow key={item.id}>
                  <TableCell>
                    <Tooltip title={item?.b2bConnectionId ?? ''}><span>{item?.b2bConnectionId ?? ''}</span></Tooltip>
                  </TableCell>
                  <TableCell>{rec?.myClientId ?? ''}</TableCell>
                  <TableCell>{rec?.theirClientId ?? ''}</TableCell>
                  <TableCell>
                    <Tooltip title={rec?.timestamp ? new Date(rec.timestamp).toISOString() : ''}>
                      <span>{safeDate(rec?.timestamp)}</span>
                    </Tooltip>
                  </TableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">{t("b2bConnections.table.noData")}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, np) => onPageChange(np)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25]}
        ActionsComponent={NumericPaginationActions}
        labelRowsPerPage={"Rows:"}
        labelDisplayedRows={({ from, to, count, page }) => {
          const totalPages = Math.max(1, Math.ceil((count || 0) / (rowsPerPage || 1)));
          return `Page ${page + 1}/${totalPages}`;
        }}
        sx={{
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'nowrap', gap: 1, paddingLeft: 0, paddingRight: 0, justifyContent: 'flex-end', width: '100%',
          },
          '& .MuiTablePagination-spacer': { display: 'none' },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { margin: 0, fontSize: '12px' },
          '& .MuiTablePagination-displayedRows': { minWidth: 'auto' },
          '& .MuiTablePagination-actions': { marginLeft: 'auto' },
          '.MuiSelect-select': { padding: 0, paddingTop: '0.1rem', fontSize: '12px', minWidth: '52px' },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black', borderWidth: '1px' },
        }}
      />
    </TableContainer>
  );
}
