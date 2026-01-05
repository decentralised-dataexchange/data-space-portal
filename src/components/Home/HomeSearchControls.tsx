"use client";

import React from "react";
import { Box, IconButton, TextField, Tooltip, CircularProgress } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface Props {
  searchQuery: string;
}

const HomeSearchControls: React.FC<Props> = ({ searchQuery }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [expanded, setExpanded] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Keep local input value in sync with server-provided query from URL
  React.useEffect(() => {
    setLocalSearch(searchQuery);
    setIsLoading(false);
  }, [searchQuery]);

  const buildNextUrl = (params: URLSearchParams) => {
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const runSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const value = localSearch.trim();
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    // Reset pagination when search changes
    params.set("orgPage", "1");
    params.set("ddaPage", "1");
    setIsLoading(true);
    router.push(buildNextUrl(params));
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runSearch();
  };

  // Compact input styling (40px height) with explicit placeholder visibility,
  // based on existing placeholder patterns in the app (see theme.ts and Onboarding PLACEHOLDER_SX)
  const inputSx = {
    '& .MuiInputBase-root': {
      height: 40,
      minHeight: 40,
      alignItems: 'center',
      marginTop: 0,
    },
    // Guard against MUI label data-shrink=false rule hiding placeholders
    '& label[data-shrink="false"] + .MuiInputBase-formControl .MuiInputBase-input::placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& label[data-shrink="false"] + .MuiInputBase-formControl .MuiInputBase-input::-webkit-input-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& label[data-shrink="false"] + .MuiInputBase-formControl .MuiInputBase-input:-moz-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& label[data-shrink="false"] + .MuiInputBase-formControl .MuiInputBase-input::-moz-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& label[data-shrink="false"] + .MuiInputBase-formControl .MuiInputBase-input:-ms-input-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& .MuiInputBase-input': {
      height: 40,
      lineHeight: '40px',
      paddingLeft: 2,
      fontSize: '0.875rem',
      color: '#111111',
    },
    '& .MuiInputBase-input::placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& .MuiInputBase-input::-webkit-input-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& .MuiInputBase-input:-moz-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& .MuiInputBase-input::-moz-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
    '& .MuiInputBase-input:-ms-input-placeholder': {
      opacity: '1 !important',
      color: '#9c9c9c !important',
    },
  } as const;

  const isSearchEmpty = !localSearch.trim();

  // Search field is always expanded now, no collapse behavior

  const handleIconClick = () => {
    if (!isSearchEmpty && !isLoading) {
      runSearch();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLocalSearch('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("orgPage", "1");
    params.set("ddaPage", "1");
    setIsLoading(true);
    router.push(buildNextUrl(params));
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const tooltipTitle = isLoading ? "Searching..." : "Click to run search";

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      ref={containerRef}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 600,
        justifyContent: { xs: 'flex-start', md: 'flex-end' },
      }}
    >
      {/* Icon container stays on the right on all breakpoints */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          order: 1,
          minWidth: 40,
          justifyContent: 'center',
        }}
      >
        <Tooltip title={tooltipTitle}>
          <span>
            <IconButton
              type="button"
              size="small"
              onClick={handleIconClick}
              disabled={isLoading || isSearchEmpty}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "#888" }} />
              ) : (
                <MagnifyingGlass size={20} style={{ color: "#888", transform: "translateY(-1px)" }} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Search field: always visible */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 1,
          border: '1px solid #D0D5DD',
          overflow: 'hidden',
          minWidth: 0,
          flex: 1,
          ml: { xs: 1, md: 0 },
          mr: { xs: 0, md: 1 },
          order: { xs: 1, md: 0 },
        }}
      >
        <TextField
          fullWidth
          name="search"
          placeholder={t("home.searchPlaceholder")}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              runSearch();
            }
          }}
          variant="standard"
          label={false as any}
          inputRef={inputRef}
          sx={inputSx}
          inputProps={{
            placeholder: t("home.searchPlaceholder"),
            'aria-label': t("home.searchPlaceholder"),
          }}
          slotProps={{
            input: {
              disableUnderline: true,
              endAdornment: !isSearchEmpty && (
                <Tooltip title="Clear search">
                  <span>
                    <IconButton
                      size="small"
                      onClick={handleClearClick}
                      sx={{ '&:hover svg': { color: '#555' } }}
                    >
                      <XIcon size={14} style={{ color: "#999" }} />
                    </IconButton>
                  </span>
                </Tooltip>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default HomeSearchControls;
