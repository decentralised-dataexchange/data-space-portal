/* eslint-disable import/no-unresolved */
import React, { FC } from "react";
import { Paper } from "@mui/material";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableHeading from "./TableHeading";
import TableRows from "./TableRows";
import './style.scss';

type BasicTableProps = {
  /* Pass the table data array for rendering */
  readonly tableData: any[];
  /* tableField: props for render table title and custom data */
  readonly tableField: any[];
};

const renderTableHead = (tableField) => {
  return (
    <>
      <TableHeading tableHead={tableField} />
    </>
  );
};

const renderTableBody = (tableData, tableField, bodyClass?) => {
  return (
    <TableBody className={bodyClass ? bodyClass : ""}>
        <TableRows tableHead={tableField} tableData={tableData} />
    </TableBody>
  );
};

const BasicTable: FC<BasicTableProps> = ({
  tableData,
  tableField,
}: BasicTableProps) => {
  return (
    <>
      <Paper className="mui-basic-table-container">
        <Table>
            {renderTableHead(tableField)}
            {renderTableBody(tableData, tableField)}
        </Table>
      </Paper>
    </>
  );
};

export default BasicTable;
