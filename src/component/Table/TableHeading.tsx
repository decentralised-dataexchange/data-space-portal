/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-unresolved */
import React, { FC, ReactElement } from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import './style.scss';

type TableAlign = 'left' | 'center' | 'right' | 'justify' | 'inherit';

type ArrayHead = {
  readonly titleEle: any;
  readonly title: string;
  readonly cell: ReactElement | null;
  readonly field: string | null;
  readonly textAlign: TableAlign;
  readonly headerWidth: string;
  readonly iconName: string;
  readonly text: string;
  readonly colSpan?: number;
};

type TableHeadProps = {
  readonly tableHead: ArrayHead[];
};

const TableHeading: FC<TableHeadProps> = ({ tableHead }: TableHeadProps) => {
  const renderTableHeading = () =>
    tableHead.map((element, index) => (
      <TableCell
        align={element?.textAlign}
        className="Tablecell-Styles"
        width={element?.headerWidth}
        key={`HEADING-${index}`}
        colSpan={element?.colSpan}
      >
        {element?.title != undefined
          ? element.title
          : element?.titleEle(element?.iconName, element.text)}
      </TableCell>
    ));
  return (
    <TableHead>
      <TableRow className="basic-table">{renderTableHeading()}</TableRow>
    </TableHead>
  );
};

export default TableHeading;
