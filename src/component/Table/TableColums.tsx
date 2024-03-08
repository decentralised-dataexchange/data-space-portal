/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { FC } from 'react';
import { TableRow, TableCell } from '@mui/material';

type TableAlign = 'left' | 'center' | 'right' | 'justify' | 'inherit';

type ArrayHead = {
  readonly field: string;
  readonly cell: (args, i) => void;
  readonly textAlign: TableAlign;
  readonly bodyWidth: string;
  readonly reference: string;
};

type TableColumnProps = {
  readonly tableHead: ArrayHead[];
  readonly tableData: any[];
  readonly tableKey?: string;
};

const TableColumns: FC<TableColumnProps> = ({
  tableData,
  tableKey = 'Products',
}: TableColumnProps) => {
  const formatDatafield = (data, item) => {
    const arr = data?.split('.');
    let a = null;
    arr.forEach((b) => (a = a ? a[b] : item[b]));
    return a;
  };

  const renderTableColoumn = () =>
    tableData?.[`${tableKey}`].map((item, i) => (
      <TableRow key={`Row-${i}`}>
        <TableCell>{i == 0 ? tableData?.companyName : ''}</TableCell>
        {Object.keys(item)
          .filter((t) => t != 'id')
          .map((tHead, index) => (
            <TableCell
              className={tHead}
              align={item?.textAlign}
              key={`Row-Cell-${index}`}
              width={item?.bodyWidth}
            >
              {item[`${tHead}`]}
            </TableCell>
          ))}
      </TableRow>
    ));
  return renderTableColoumn();
};

export default TableColumns;
