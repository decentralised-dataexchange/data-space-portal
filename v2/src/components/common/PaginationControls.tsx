"use client";

import React from "react";
import { Box, Select, MenuItem, Typography, Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type PaginationControlsProps = {
  totalItems: number;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  pageParamKey?: string; // query key for page number (URL mode)
  limitParamKey?: string; // query key for rows per page (URL mode)
  // Optional container styles (merged on top of base styles); defaults include a tasteful top margin
  containerSx?: SxProps;
  // Controlled mode (if provided, URL mode is disabled)
  page?: number; // 1-based current page
  rowsPerPage?: number; // current rows per page
  onChangePage?: (nextPage: number) => void;
  onChangeRowsPerPage?: (nextRowsPerPage: number) => void;
};

const StyledPagination = styled(Pagination)(() => ({
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': { backgroundColor: '#000' },
  },
}));

const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalItems,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  pageParamKey = "page",
  limitParamKey = "limit",
  page: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  containerSx,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine mode: controlled if onChangePage is provided
  const isControlled = typeof onChangePage === 'function';
  const pageFromUrl = parseInt(searchParams.get(pageParamKey) || "1", 10);
  const rowsFromUrl = parseInt(searchParams.get(limitParamKey) || String(defaultRowsPerPage), 10);

  const rowsPerPage = isControlled
    ? (controlledRowsPerPage && controlledRowsPerPage > 0 ? controlledRowsPerPage : defaultRowsPerPage)
    : (Number.isFinite(rowsFromUrl) && rowsFromUrl > 0 ? rowsFromUrl : defaultRowsPerPage);
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, rowsPerPage)));
  const currentPage = isControlled
    ? Math.min(totalPages, Math.max(1, controlledPage || 1))
    : Math.min(totalPages, Math.max(1, Number.isFinite(pageFromUrl) ? pageFromUrl : 1));

  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);

  const updateUrl = (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete(pageParamKey);
    } else {
      params.set(pageParamKey, String(page));
    }
    if (limit === defaultRowsPerPage) {
      params.delete(limitParamKey);
    } else {
      params.set(limitParamKey, String(limit));
    }
    const url = `${pathname}?${params.toString()}`;
    router.push(url);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (isControlled) {
      onChangePage?.(value);
    } else {
      updateUrl(value, rowsPerPage);
    }
  };

  const handleChangeRowsPerPage = (event: any) => {
    const next = parseInt(event.target.value, 10) || defaultRowsPerPage;
    // reset to page 1 when page size changes
    if (isControlled) {
      onChangeRowsPerPage?.(next);
      onChangePage?.(1);
    } else {
      updateUrl(1, next);
    }
  };

  if (totalItems === 0) return null;

  const baseSx = {
    display: 'flex',
    alignItems: 'center',
    columnGap: 2,
    rowGap: 0,
    flexWrap: 'wrap',
    marginBlock: 2,
  } as const;
  return (
    <Box sx={[baseSx, containerSx] as any}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {t('common.rowsPerPage')}
        </Typography>
        <Select
          size="small"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          sx={{
            minWidth: 70,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiSelect-select': {
              paddingY: 0.75,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root.Mui-selected': { backgroundColor: '#e0e0e0 !important' },
                '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: '#e0e0e0 !important' },
                '& .MuiMenuItem-root:hover': { backgroundColor: '#eeeeee' },
              }
            }
          }}
        >
          {rowsPerPageOptions.map(opt => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, display: "flex", justifyContent: "center" }}>
        {startIndex}-{endIndex} {t('common.of')} {totalItems}
      </Typography>
      {totalPages > 1 && (
        <StyledPagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      )}
    </Box>
  );
};

export default PaginationControls;
