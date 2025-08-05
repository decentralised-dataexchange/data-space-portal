"use client";

import { Pagination } from "@mui/material";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function ClientPagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 1) {
      params.delete("page");
    } else {
      params.set("page", value.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={handleChange}
      size="large"
      showFirstButton
      showLastButton
      sx={{
        '& .MuiPaginationItem-root.Mui-selected': {
          backgroundColor: '#000',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#000',
          }
        }
      }}
    />
  );
}
