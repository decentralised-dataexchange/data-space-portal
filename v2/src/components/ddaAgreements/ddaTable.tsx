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
import { EyeIcon, UploadSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import VersionDropdown from "../VersionDropDown";
import { TablePagination, Tooltip, Pagination, Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import { getStatus } from "@/utils/dda";

interface DDATableProps {
  setIsOpenViewDDA: (isOpen: boolean) => void;
  setSelectedDDA: (dda: DataDisclosureAgreement | null) => void;
  tabledata: {
    dataDisclosureAgreements: DataDisclosureAgreement[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasNext: boolean;
      hasPrevious: boolean;
      totalItems: number;
      currentPage: number;
      totalPages: number;
    };
  };
  setIsOpenDelete: (isOpen: boolean) => void;
  setIsOpenPublish: (isOpen: boolean) => void;
  limit: number;
  offset: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

// Use TableContainer directly with sx (removes parser complaints around styled wrapper)

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

// Inline numeric pagination to be rendered within TablePagination actions area
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
          '& .MuiPagination-ul': {
            alignItems: 'center',
          },
          '& .MuiPaginationItem-root': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 28,
            height: 28,
            lineHeight: '28px',
            fontSize: '12px',
            margin: '0 2px'
          },
          '& .MuiPaginationItem-root.MuiPaginationItem-previousNext': {
            minWidth: 28,
            height: 28,
            lineHeight: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiPaginationItem-icon': {
            fontSize: 18,
            margin: 0,
            display: 'block',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 18,
            verticalAlign: 'middle',
            display: 'block',
          },
          // micro-adjust chevrons to align perfectly with numeric items
          '& .MuiPaginationItem-previousNext .MuiPaginationItem-icon': {
            transform: 'translateY(-1px)',
          },
          '& .MuiPaginationItem-previousNext .MuiSvgIcon-root': {
            transform: 'translateY(-1px)',
          },
        }}
      />
    </Box>
  );
};

const DDATable: React.FC<DDATableProps> = ({
  setIsOpenViewDDA,
  setSelectedDDA,
  tabledata,
  setIsOpenDelete,
  setIsOpenPublish,
  limit,
  offset,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const t = useTranslations();

  return (
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("dataAgreements.table.headers.usagePurpose")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.version")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.status")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.lawfulBasis")}</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {tabledata?.dataDisclosureAgreements?.length > 0 ? (
            tabledata.dataDisclosureAgreements.map((row, index) => (
              <StyledTableRow key={row.templateId} style={{ color: "red" }}>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{row.purpose}</StyledTableCell>
                <StyledTableCell>
                  <VersionDropdown record={row} />
                </StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{getStatus(t, row.status)}</StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{row.lawfulBasis}</StyledTableCell>
                <StyledTableCell
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "none",
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip
                    title={t("dataAgreements.table.tooltips.listToMarketplace")}
                    placement="top"
                  >

                    <IconButton className="actionButton" aria-label="delete" data-disabled={row.status === "awaitingForApproval"}>
                      <UploadSimpleIcon
                        style={{ color: row.status === "unlisted" ? "red" : row.status === "awaitingForApproval" ? "gray" : "black", cursor: row.status === "awaitingForApproval" ? "not-allowed" : "pointer" }}
                        size={16}
                        onClick={() => {
                          if (row.status !== "awaitingForApproval") {
                            setIsOpenPublish(true);
                            setSelectedDDA(row);
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={t("dataAgreements.tooltipView")}
                    placement="top"
                  >
                    <IconButton aria-label="edit" onClick={() => {
                          setIsOpenViewDDA(true);
                          setSelectedDDA(row);
                        }}>
                      <EyeIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                        
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={t("dataAgreements.tooltipDelete")}
                    placement="top"
                  >
                    <IconButton aria-label="delete"
                    onClick={() => {
                      setIsOpenDelete(true);
                      setSelectedDDA(row);
                    }}
                    >
                      <TrashSimpleIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                      />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={5} align="center">
                {t("common.noResultsFound")}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {tabledata?.dataDisclosureAgreements?.length > 0 && (
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
              '& .MuiTablePagination-toolbar': {
                flexWrap: 'nowrap',
                gap: 1,
                paddingLeft: 0,
                paddingRight: 0,
                justifyContent: 'flex-end',
                width: '100%',
              },
              '& .MuiTablePagination-spacer': {
                display: 'none',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                margin: 0,
                fontSize: '12px',
              },
              '& .MuiTablePagination-displayedRows': {
                minWidth: 'auto',
              },
              '& .MuiTablePagination-actions': {
                marginLeft: 'auto',
              },
              ".MuiSelect-select": {
                padding: 0,
                paddingTop: "0.1rem",
                fontSize: "12px",
                minWidth: '52px'
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
                borderWidth: "1px"
              }
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root.Mui-selected': {
                      backgroundColor: '#e0e0e0 !important',
                    },
                    '& .MuiMenuItem-root.Mui-selected:hover': {
                      backgroundColor: '#e0e0e0 !important',
                    },
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

export default DDATable;
