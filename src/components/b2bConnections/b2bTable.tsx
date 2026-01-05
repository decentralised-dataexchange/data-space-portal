"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslations } from "next-intl";
import { B2BConnectionItem } from "@/types/b2bConnection";
import PaginationControls from "@/components/common/PaginationControls";
import { formatLocalDate } from "@/utils/dateFormat";
import { StyledTableCell, StyledTableRow } from "@/components/common/Table/StyledTable";

export default function B2BTable({
  rows,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onOpenMySoftwareStatement,
  onOpenTheirSoftwareStatement,
}: {
  rows: B2BConnectionItem[];
  page: number; // zero-based for MUI
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: number) => void;
  onOpenMySoftwareStatement?: (item: B2BConnectionItem) => void;
  onOpenTheirSoftwareStatement?: (item: B2BConnectionItem) => void;
}) {
  const t = useTranslations();

  return (
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="b2b-connections-table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("b2bConnections.table.headers.id")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.theirClientId")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.theirClientSecret")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.mySoftwareStatement")}</StyledTableCell>
            <StyledTableCell>{t("b2bConnections.table.headers.theirSoftwareStatement")}</StyledTableCell>
            <StyledTableCell>Last Modified Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((item) => {
              const rec = item.b2bConnectionRecord;
              return (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>{rec?.id ?? ''}</StyledTableCell>
                  <StyledTableCell>{rec?.theirClientId ?? ''}</StyledTableCell>
                  <StyledTableCell>{rec?.theirClientSecret ?? ''}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                      <Tooltip title={t('developerAPIs.softwareStatementViewTooltip')} arrow>
                        <span>
                          <IconButton aria-label="view-my-ss" onClick={() => onOpenMySoftwareStatement?.(item)} sx={{ color: '#000' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                      <Tooltip title={t('developerAPIs.softwareStatementViewTooltip')} arrow>
                        <span>
                          <IconButton aria-label="view-their-ss" onClick={() => onOpenTheirSoftwareStatement?.(item)} sx={{ color: '#000' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{formatLocalDate(item?.updatedAt || item?.createdAt)}</StyledTableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <StyledTableCell colSpan={6} align="center">{t("common.noResultsFound")}</StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
        <PaginationControls
          totalItems={total}
          defaultRowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          page={(page ?? 0) + 1}
          rowsPerPage={rowsPerPage}
          onChangePage={(next) => onPageChange(next - 1)}
          onChangeRowsPerPage={(next) => onRowsPerPageChange(next)}
        />
      </Box>
    </TableContainer>
  );
}
