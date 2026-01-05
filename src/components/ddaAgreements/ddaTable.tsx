"use client";

import React, { useState, useMemo, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { EyeIcon, UploadSimpleIcon, TrashSimpleIcon, ClockCounterClockwiseIcon, TagIcon } from "@phosphor-icons/react";
import VersionDropdown from "../VersionDropDown";
import { Tooltip, Box } from "@mui/material";
import PaginationControls from "@/components/common/PaginationControls";
import { apiService } from "@/lib/apiService/apiService";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import { getStatus } from "@/utils/dda";
import { formatLocalDate } from "@/utils/dateFormat";
import { StyledTableCell, StyledTableRow } from "@/components/common/Table/StyledTable";
import TagChips from "@/components/common/TagChips";

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
  setIsOpenEditTags?: (isOpen: boolean) => void;
  limit: number;
  offset: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DDATable: React.FC<DDATableProps> = ({
  setIsOpenViewDDA,
  setSelectedDDA,
  tabledata,
  setIsOpenDelete,
  setIsOpenPublish,
  setIsOpenEditTags,
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
                <StyledTableCell style={{ color: row.status === "unlisted" ? "red" : "black" }}>
                  <Box>
                    {row.purpose}
                    {row.tags && row.tags.length > 0 && (
                      <Box sx={{ mt: 0.5 }}>
                        <TagChips tags={row.tags} maxDisplay={3} />
                      </Box>
                    )}
                  </Box>
                </StyledTableCell>
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
                  {formatLocalDate(
                    getSelectedRevisionData(row)?.updatedAt ||
                    getSelectedRevisionData(row)?.createdAt ||
                    row?.updatedAt ||
                    row?.createdAt
                  )}
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

                  {setIsOpenEditTags && (
                    <Tooltip
                      title={"Edit Tags"}
                      placement="top"
                    >
                      <IconButton
                        aria-label="edit-tags"
                        onClick={() => {
                          setSelectedDDA(row);
                          setIsOpenEditTags(true);
                        }}
                      >
                        <TagIcon
                          style={{ color: row.status === "unlisted" ? "red" : "black" }}
                          size={17}
                        />
                      </IconButton>
                    </Tooltip>
                  )}

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
