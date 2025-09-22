"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { EyeIcon } from "@phosphor-icons/react";
import { TablePagination, Tooltip, Pagination, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { SignedAgreementsListResponse } from "@/types/signedAgreement";

interface Props {
  tabledata: SignedAgreementsListResponse | { dataDisclosureAgreementRecord: any[]; pagination: any };
  limit: number;
  offset: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onView: (row: any) => void;
}

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
          '& .MuiPaginationItem-root': { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, lineHeight: '28px', fontSize: '12px', margin: '0 2px' },
          '& .MuiPaginationItem-root.MuiPaginationItem-previousNext': { minWidth: 28, height: 28, lineHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
          '& .MuiPaginationItem-icon': { fontSize: 18, margin: 0, display: 'block' },
          '& .MuiSvgIcon-root': { fontSize: 18, verticalAlign: 'middle', display: 'block' },
          '& .MuiPaginationItem-previousNext .MuiPaginationItem-icon': { transform: 'translateY(-1px)' },
          '& .MuiPaginationItem-previousNext .MuiSvgIcon-root': { transform: 'translateY(-1px)' },
        }}
      />
    </Box>
  );
};

const SignedAgreementsTable: React.FC<Props> = ({
  tabledata,
  limit,
  offset,
  onPageChange,
  onRowsPerPageChange,
  onView,
}) => {
  const t = useTranslations();

  const rows = (tabledata?.dataDisclosureAgreementRecord || []) as any[];

  return (
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="signed agreements table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("signedAgreements.table.headers.usagePurpose")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.version")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.status")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.optIn")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.lawfulBasis")}</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {rows.length > 0 ? (
            rows.map((row: any) => {
              // Support both SignedAgreementRecord (with nested dataDisclosureAgreementRecord)
              // and flat DataDisclosureAgreementRecord items
              const rec = row?.dataDisclosureAgreementRecord || row || {};
              const objDataStr = rec?.dataDisclosureAgreementTemplateRevision?.objectData;
              let obj: any = {};
              try {
                obj = objDataStr ? JSON.parse(objDataStr) : {};
              } catch (e) {
                obj = {};
              }
              const purpose = obj?.purpose || '';
              const version = obj?.version || obj?.templateVersion || '';
              const status = row?.state ?? rec?.state ?? '';
              const optInVal = (typeof row?.optIn === 'boolean' ? row?.optIn : row?.dataDisclosureAgreementRecord?.optIn) as boolean | undefined;
              const lawfulBasis = obj?.lawfulBasis || '';
              return (
                <StyledTableRow key={row?.id || rec?.id || rec?.dataDisclosureAgreementTemplateRevision?.id}>
                  <StyledTableCell>{purpose}</StyledTableCell>
                  <StyledTableCell>{version}</StyledTableCell>
                  <StyledTableCell>{status}</StyledTableCell>
                  <StyledTableCell>{
                    typeof optInVal === 'boolean' ? (optInVal ? t('common.yes') : t('common.no')) : ''
                  }</StyledTableCell>
                  <StyledTableCell>{lawfulBasis}</StyledTableCell>
                  <StyledTableCell
                    style={{ display: "flex", justifyContent: "flex-end", border: "none", whiteSpace: 'nowrap' }}
                  >
                    <Tooltip title={t("signedAgreements.tooltipView")} placement="top">
                      <IconButton aria-label="view" onClick={() => onView(row)}>
                        <EyeIcon size={17} />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <StyledTableCell colSpan={6} align="center">
                {t("signedAgreements.table.noData")}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {rows.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tabledata?.pagination?.totalItems}
            rowsPerPage={limit}
            page={Math.max(
              0,
              Math.min(
                Math.ceil((tabledata?.pagination?.totalItems || 0) / (limit || 1)) - 1,
                Math.floor(offset / (limit || 1))
              )
            )}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            ActionsComponent={NumericPaginationActions}
            labelRowsPerPage={"Rows:"}
            labelDisplayedRows={({ from, to, count, page }) => {
              const totalPages = Math.max(1, Math.ceil((count || 0) / (limit || 1)));
              return `Page ${page + 1}/${totalPages}`;
            }}
            sx={{
              '& .MuiTablePagination-toolbar': { flexWrap: 'nowrap', gap: 1, paddingLeft: 0, paddingRight: 0, justifyContent: 'flex-end', width: '100%' },
              '& .MuiTablePagination-spacer': { display: 'none' },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { margin: 0, fontSize: '12px' },
              '& .MuiTablePagination-displayedRows': { minWidth: 'auto' },
              '& .MuiTablePagination-actions': { marginLeft: 'auto' },
              ".MuiSelect-select": { padding: 0, paddingTop: "0.1rem", fontSize: "12px", minWidth: '52px' },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "black", borderWidth: "1px" }
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root.Mui-selected': { backgroundColor: '#e0e0e0 !important' },
                    '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: '#e0e0e0 !important' },
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </TableContainer>
  );
};

export default SignedAgreementsTable;
