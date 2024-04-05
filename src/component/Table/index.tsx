/* eslint-disable import/no-unresolved */
import React, { FC } from "react";
import { Paper } from "@mui/material";
import Table from "@material-ui/core/Table";
import TableBody from '@material-ui/core/TableBody';
import TableHeading from "./TableHeading";
import TableRows from "./TableRows";
import './style.scss';
import TableColumns from "./TableColums";

type BasicTableProps = {
  /* Pass the table data array for rendering */
  readonly tableData: any[];
  /* tableField: props for render table title and custom data */
  readonly tableField: any[];
  readonly isColumnWise?: boolean,
  readonly customTableHeadClass?: string,
  readonly customTableBodyClass?: string,
};

const renderTableHead = (tableField) => {
  return (
    <>
      <TableHeading tableHead={tableField} />
    </>
  );
};

const renderTableBody = (tableData, tableField, isColumnWise?) => {

  return (
    <TableBody>
      {isColumnWise ? 
        <TableColumns tableHead={tableField} tableData={tableData} /> 
        :
        <TableRows tableHead={tableField} tableData={tableData} />
      }
        
    </TableBody>
  );
};

const BasicTable: FC<BasicTableProps> = ({
  tableData,
  tableField,
  isColumnWise = false,
  customTableHeadClass,
  customTableBodyClass,
}: BasicTableProps) => {
  return (
    <>
      <Paper className="mui-basic-table-container">
        <Table className={`mui-basic-table ${customTableHeadClass}`}>
            {renderTableHead(tableField)}
            {renderTableBody(tableData, tableField, isColumnWise)}
        </Table>
      </Paper>
    </>
  );
};

export default BasicTable;
