"use client";

import React from "react";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass, XIcon } from "@phosphor-icons/react";

interface Props {
  searchQuery: string;
}

const HomeSearchControls: React.FC<Props> = ({ searchQuery }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [expanded, setExpanded] = React.useState(Boolean(searchQuery));
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Keep local input value in sync with server-provided query from URL
  React.useEffect(() => {
    setLocalSearch(searchQuery);
    setExpanded(Boolean(searchQuery));
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
    '& .MuiInputBase-input': {
      height: 40,
      lineHeight: '40px',
      paddingLeft: 2,
      fontSize: '0.875rem',
    },
    '& .MuiInputBase-input::placeholder': {
      opacity: 1,
      color: '#9c9c9c',
    },
  } as const;

  const isSearchEmpty = !localSearch.trim();

  // Collapse the search field when clicking outside, but only if it's empty
  React.useEffect(() => {
    if (!expanded) return;

    const handleClickAway = (event: MouseEvent) => {
      const node = containerRef.current;
      if (!node) return;
      if (!node.contains(event.target as Node) && isSearchEmpty) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, [expanded, isSearchEmpty]);

  const handleIconClick = () => {
    if (!expanded) {
      setExpanded(true);
      // Focus input shortly after expanding
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return;
    }

    if (!isSearchEmpty) {
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
    router.push(buildNextUrl(params));
    // Keep the field open and ready for a new search
    setExpanded(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const tooltipTitle = expanded
    ? "Click to run search"
    : "Click to open search";

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit}
      ref={containerRef}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 360,
        justifyContent: { xs: 'flex-start', md: 'flex-end' },
      }}
    >
      {/* Icon container so we can reorder across breakpoints */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          order: { xs: 0, md: 1 },
        }}
      >
        <Tooltip title={tooltipTitle}>
          <span>
            <IconButton
              type="button"
              size="small"
              onClick={handleIconClick}
            >
              <MagnifyingGlass size={20} style={{ color: "#888", transform: "translateY(-1px)" }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Animated search field: to the right of the icon on mobile, to the left on desktop */}
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
          transition: 'width 0.25s ease, margin 0.25s ease, opacity 0.2s ease',
          width: expanded ? '100%' : 0,
          ml: { xs: expanded ? 1 : 0, md: 0 },
          mr: { xs: 0, md: expanded ? 1 : 0 },
          opacity: expanded ? 1 : 0,
          order: { xs: 1, md: 0 },
        }}
      >
        <TextField
          fullWidth
          name="search"
          placeholder="Search organisations and DDAs"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && isSearchEmpty) {
              setExpanded(false);
            }
          }}
          onBlur={() => {
            if (!isSearchEmpty) return;
            // Defer to let focus move; collapse only if focus left the whole control
            requestAnimationFrame(() => {
              const node = containerRef.current;
              if (!node) return;
              if (!node.contains(document.activeElement)) {
                setExpanded(false);
              }
            });
          }}
          variant="standard"
          label={false as any}
          inputRef={inputRef}
          sx={inputSx}
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
