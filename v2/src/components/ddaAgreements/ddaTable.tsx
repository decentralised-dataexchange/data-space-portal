import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import {
  VisibilityOutlined,
  UploadOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import VersionDropdown from "../VersionDropDown";
import { TablePagination, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";

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

const StyledTableCell = styled(TableCell)({
  fontWeight: "lighter !important",
  fontSize: "14px !important",
  border: "1px solid #D7D6D6",
});

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

  const getStatus = (status: string) => {
    if (status === "unlisted") {
      return "Unlisted";
    } else if (status === "awaitingForApproval") {
      return "InReview";
    } else if (status === "approved") {
      return "Approved";
    } else if (status === "rejected") {
      return "Rejected";
    } else if (status === "listed") {
      return "Listed";
    }
  };

  return (
    <RootTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Usage purpose</StyledTableCell>
            <StyledTableCell>Version</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Lawful Basis of Processing</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tabledata?.dataDisclosureAgreements?.length > 0 ? (
            tabledata.dataDisclosureAgreements.map((row, index) => (
              <StyledTableRow key={row.templateId} style={{color: "red"}}>
                <StyledTableCell style={{color: row.status === "unlisted" ? "red" : "black"}}>{row.purpose}</StyledTableCell>
                <StyledTableCell>
                  <VersionDropdown record={row} />
                </StyledTableCell>
                <StyledTableCell style={{color: row.status === "unlisted" ? "red" : "black"}}>{getStatus(row.status)}</StyledTableCell>
                <StyledTableCell style={{color: row.status === "unlisted" ? "red" : "black"}}>{row.lawfulBasis}</StyledTableCell>
                <StyledTableCell
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    border: "none",
                  }}
                >
                  <Tooltip
                    title={"List to Data Marketplace"}
                    placement="top"
                  >
                    
                    <IconButton aria-label="delete">
                      <UploadOutlined
                        style={{color: row.status === "unlisted" ? "red" : "black", cursor: row.status === "awaitingForApproval" ? "not-allowed": "pointer"}}
                        fontSize="small"
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
                      <VisibilityOutlined
                        style={{color: row.status === "unlisted" ? "red" : "black"}}
                        fontSize="small"
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
                      <DeleteOutlineOutlined
                        style={{color: row.status === "unlisted" ? "red" : "black"}}
                        fontSize="small"
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
                No datas to display
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
        />
      )}
    </RootTableContainer>
  );
};

export default DDATable;
