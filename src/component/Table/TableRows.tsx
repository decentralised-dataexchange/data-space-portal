/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { FC } from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";

type TableAlign = "left" | "center" | "right" | "justify" | "inherit";

type ArrayHead = {
  readonly field: string;
  readonly cell: (args, i) => void;
  readonly textAlign: TableAlign;
  readonly bodyWidth: string;
  readonly reference: string;
};

type TableRowProps = {
  readonly tableHead: ArrayHead[];
  readonly tableData: any[];
};

const TableRows: FC<TableRowProps> = ({
  tableData,
  tableHead,
}: TableRowProps) => {
  const formatDatafield = (data, item) => {
    const arr = data?.split(".");
    let a = null;
    arr.forEach((b) => (a = a ? a[b] : item[b]));
    return a;
  };

  const renderTableRow = () =>
    tableData.map((item, i) => (
      <TableRow key={`Row-${i}`}>
        {tableHead?.map((tHead, index) => (
          <TableCell
            align={tHead?.textAlign}
            key={`Row-Cell-${index}`}
            width={tHead?.bodyWidth}
          >
            {console.log("tHead", tHead)}
            {tHead?.field
              ? formatDatafield(tHead?.field, item)
              : tHead?.cell(item, tHead?.reference ? tHead?.reference : i )}
          </TableCell>
        ))}
      </TableRow>
    ));

  return renderTableRow();
};

export default TableRows;
