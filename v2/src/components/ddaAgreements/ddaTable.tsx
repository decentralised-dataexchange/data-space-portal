"use client";

import React, { useState, useMemo, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { EyeIcon, UploadSimpleIcon, TrashSimpleIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import VersionDropdown from "../VersionDropDown";
import { Tooltip, Pagination, Box } from "@mui/material";
import PaginationControls from "@/components/common/PaginationControls";
import { apiService } from "@/lib/apiService/apiService";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
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
  const router = useRouter();
  const locale = useLocale();
  // Keep track of selected version per DDA (keyed by templateId)
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string>>({});

  const getVersionVal = (item: any): string => String(item?.version || item?.templateVersion || "");

  const getLatestVersion = (row: any): string => {
    // prefer item marked as latest among row and its revisions
    const pool = [row, ...(Array.isArray(row?.revisions) ? row.revisions : [])];
    const latest = pool.find((r: any) => r && r.isLatestVersion);
    return latest ? getVersionVal(latest) : getVersionVal(row);
  };

  const getSelectedVersion = (row: any) => selectedVersions[row.templateId] || getLatestVersion(row);

  const getSelectedRevisionData = (row: any) => {
    const sel = getSelectedVersion(row);
    if (sel === getVersionVal(row)) return row;
    const rev = Array.isArray(row?.revisions) ? row.revisions.find((r: any) => getVersionVal(r) === sel) : null;
    // Merge revision over base row to avoid missing fields in modal
    return rev ? { ...row, ...rev } : row;
  };

  // Initialize default selected versions to latest for all rows
  useEffect(() => {
    const list = tabledata?.dataDisclosureAgreements || [];
    if (!Array.isArray(list) || list.length === 0) return;
    setSelectedVersions((prev) => {
      const next = { ...prev };
      for (const row of list) {
        const key = row?.templateId;
        if (!key) continue;
        if (!(key in next)) {
          next[key] = getLatestVersion(row);
        }
      }
      return next;
    });
  }, [tabledata]);

  return (
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{"DDA Template ID"}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.usagePurpose")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.version")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.status")}</StyledTableCell>
            <StyledTableCell>{t("dataAgreements.table.headers.lawfulBasis")}</StyledTableCell>
            <StyledTableCell>{"Last Modified Date"}</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {tabledata?.dataDisclosureAgreements?.length > 0 ? (
            tabledata.dataDisclosureAgreements.map((row, index) => (
              <StyledTableRow key={row.templateId} style={{ color: "red" }}>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{row.templateId || ''}</StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{row.purpose}</StyledTableCell>
                <StyledTableCell>
                  <VersionDropdown
                    record={row}
                    value={getSelectedVersion(row)}
                    onChange={(v) => setSelectedVersions((prev) => ({ ...prev, [row.templateId]: v }))}
                  />
                </StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>{getStatus(t, row.status)}</StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black", textTransform: "capitalize" }}>{row.lawfulBasis}</StyledTableCell>
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>
                  {(() => {
                    const selected = getSelectedRevisionData(row) as any;
                    const ts: any = selected?.updatedAt || selected?.createdAt || (row as any)?.updatedAt || (row as any)?.createdAt;
                    if (!ts) return '';
                    const d = new Date(ts);
                    return isNaN(d.getTime()) ? '' : d.toLocaleString();
                  })()}
                </StyledTableCell>
                <StyledTableCell
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    border: "none",
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip
                    title={t("dataAgreements.table.tooltips.listToMarketplace")}
                    placement="top"
                  >
                    {(() => {
                      // Only allow listing when the currently selected version is the latest
                      const isCurrentSelected = String(getSelectedVersion(row)) === String(getLatestVersion(row));
                      const disabled = row.status === "awaitingForApproval" || !isCurrentSelected;
                      const color = !isCurrentSelected
                        ? "gray"
                        : row.status === "unlisted" ? "red" : row.status === "awaitingForApproval" ? "gray" : "black";
                      const cursor = disabled ? "not-allowed" : "pointer";
                      return (
                        <IconButton className="actionButton" aria-label="publish" data-disabled={disabled}>
                          <UploadSimpleIcon
                            style={{ color, cursor }}
                            size={16}
                            onClick={() => {
                              if (!disabled) {
                                setIsOpenPublish(true);
                                setSelectedDDA(row);
                              }
                            }}
                          />
                        </IconButton>
                      );
                    })()}
                  </Tooltip>

                  <Tooltip
                    title={t("dataAgreements.table.tooltips.viewHistory")}
                    placement="top"
                  >
                    <IconButton
                      aria-label="history"
                      onClick={() => {
                        const id = row?.templateId || (row as any)?.dataAgreementId || (row as any)?.["@id"]; 
                        if (!id) return;
                        router.push(`/${locale}/dd-agreements/history/${encodeURIComponent(String(id))}`);
                      }}
                    >
                      <ClockCounterClockwiseIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={t("dataAgreements.tooltipView")}
                    placement="top"
                  >
                    <IconButton aria-label="edit" onClick={() => {
                          setIsOpenViewDDA(true);
                          setSelectedDDA(getSelectedRevisionData(row));
                        }}>
                      <EyeIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                        
                      />
                    </IconButton>
                  </Tooltip>

                  {false && (
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
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={7} align="center">
                {t("common.noResultsFound")}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {tabledata?.dataDisclosureAgreements?.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {(() => {
            const total = tabledata?.pagination?.totalItems || 0;
            const currentPage = Math.max(1, Math.floor((offset || 0) / Math.max(1, limit)) + 1);
            return (
              <PaginationControls
                totalItems={total}
                defaultRowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25]}
                page={currentPage}
                rowsPerPage={limit}
                onChangePage={(next) => onPageChange(null, next - 1)}
                onChangeRowsPerPage={(next) => onRowsPerPageChange({ target: { value: String(next) } } as any)}
              />
            );
          })()}
        </Box>
      )}
    </TableContainer>
  );
};

export default DDATable;
