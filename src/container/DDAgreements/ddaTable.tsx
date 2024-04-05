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
import VersionDropdown from "../../component/VersionDropDown";
import { TablePagination, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

const RootTableContainer = styled(TableContainer)({
  backgroundColor: "#FFFF",
  borderRadius: "0px",
  overflowY: "hidden",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "lighter !important",
  fontSize: "14px !important",
  border: "1px solid #D7D6D6",
  textTransform: "capitalize",
});

const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
});

const DDAtable = ({
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
  const { t } = useTranslation("translation");

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
          {tabledata?.dataDisclosureAgreements?.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{row.purpose}</StyledTableCell>
              <StyledTableCell>
                <VersionDropdown record={row} />
              </StyledTableCell>
              <StyledTableCell>{row.status}</StyledTableCell>
              <StyledTableCell>{row.lawfulBasis}</StyledTableCell>
              <StyledTableCell
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "none",
                }}
              >
                <Tooltip
                  title={"Publish Data Disclosure Agreement"}
                  placement="top"
                >
                  <IconButton aria-label="delete">
                    <UploadOutlined
                      fontSize="small"
                      onClick={() => {
                        setIsOpenPublish(true), setSelectedDDA(row);
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
                      fontSize="small"
                      onClick={() => {
                        setIsOpenDelete(true), setSelectedDDA(row);
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tabledata?.pagination?.totalItems}
        rowsPerPage={limit}
        page={Math.floor(offset / limit)}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </RootTableContainer>
  );
};

export default DDAtable;
