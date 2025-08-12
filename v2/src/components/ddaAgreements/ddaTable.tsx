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

const RootTableContainer = styled(TableContainer)({
  backgroundColor: "#FFFF",
  borderRadius: "0px",
  overflowY: "hidden",
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    backgroundColor: "#e5e4e4"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.875rem",
    fontWeight: "lighter",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
  },
}));

const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
});

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
    <RootTableContainer className="dd-container">
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
        <TableBody>
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
                    <IconButton aria-label="edit">
                      <EyeIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                        onClick={() => {
                          setIsOpenViewDDA(true), setSelectedDDA(row);
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip
                    title={t("dataAgreements.tooltipDelete")}
                    placement="top"
                  >
                    <IconButton aria-label="delete">
                      <TrashSimpleIcon
                        style={{ color: row.status === "unlisted" ? "red" : "black" }}
                        size={17}
                        onClick={() => {
                          setIsOpenDelete(true), setSelectedDDA(row);
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={5} align="center">
                {t("dataAgreements.table.noData")}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {tabledata?.dataDisclosureAgreements?.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tabledata?.pagination?.totalItems}
          rowsPerPage={limit}
          page={Math.floor(offset / limit)}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{
            ".MuiSelect-select": {
              padding: 0,
              paddingTop: "0.2rem",
              fontSize: "14px"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
              borderWidth: "1px"
            }
          }}
          SelectProps={{
            MenuProps: {
              sx: {
                '& .MuiPaper-root': {
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    minHeight: '32px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#e0e0e0',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      )}

      {tabledata?.dataDisclosureAgreements?.length > 0 && (tabledata?.pagination?.totalPages || 0) > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Pagination
            count={tabledata?.pagination?.totalPages || Math.ceil((tabledata?.pagination?.totalItems || 0) / (limit || 1))}
            page={Math.floor(offset / limit) + 1}
            onChange={(_, value) => onPageChange(null, value - 1)}
            showFirstButton
            showLastButton
            size="medium"
          />
        </Box>
      )}
    </RootTableContainer>
  );
};

export default DDATable;
