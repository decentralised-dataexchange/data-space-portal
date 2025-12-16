import React from "react";
import { AppBar, Box, Button, Toolbar, Typography, TextField, Paper, List, ListItemButton, ListItemText, Popper, ClickAwayListener, CircularProgress } from "@mui/material";
import Logo from "@/assets/img/logo.jpg";
import Link from "next/link"
import Image from "next/image";
import { useTranslations} from 'next-intl';
import './styles.scss';
import { usePathname, useRouter } from 'next/navigation';
import { apiService } from "@/lib/apiService/apiService";
import type { ServiceSearchDdaItem } from "@/types/serviceSearch";

export default function CustomMinimalAppBar() {
  const t = useTranslations('appBar');
  const router = useRouter();
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.split('/').at(-1);

  const getLocaleFromPath = React.useCallback((p?: string | null) => {
    if (!p) return null;
    const match = p.match(/^\/(en|fi|sv)(?:\/|$)/);
    return match ? match[1] : null;
  }, []);

  const slugify = React.useCallback((s: string) => s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''), []);

  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<ServiceSearchDdaItem[]>([]);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchFailed, setSearchFailed] = React.useState(false);
  const searchAnchorRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);
    return () => {
      window.clearTimeout(handle);
    };
  }, [searchValue]);

  React.useEffect(() => {
    const q = debouncedSearch;
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchFailed(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    setSearchFailed(false);
    apiService.serviceSearch({
      search: q,
      offset: 0,
      limit: 8,
      searchOrgName: true,
      searchDdaPurpose: true,
      searchDdaDescription: true,
      searchDataset: true,
    })
      .then((res) => {
        if (cancelled) return;
        setSearchResults(res?.ddas ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setSearchResults([]);
        setSearchFailed(true);
      })
      .finally(() => {
        if (cancelled) return;
        setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const handleSelectResult = (item: ServiceSearchDdaItem) => {
    const orgId = item?.organisationId;
    const orgName = item?.organisationName;
    const target = orgId || (orgName ? slugify(orgName) : '');
    if (!target) return;
    const locale = getLocaleFromPath(pathname);
    setSearchOpen(false);
    router.push(locale ? `/${locale}/data-source/read/${target}` : `/data-source/read/${target}`);
  };

  const shouldShowDropdown = searchOpen && Boolean(searchValue.trim());
  const popperWidth = searchAnchorRef.current?.clientWidth;
  
  return (
    <Box className="appBarContainer">
    <AppBar
      sx={{
        backgroundColor: "#00182C",
        height: 80,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <Link href="/">
            <Image className='logoImg' src={Logo} alt={`${t("header")} logo`} width={58} />
          </Link>
          <Link className="navHeaderTextLink" href="/">
            <Typography
              className="headerText"
              sx={{
                fontSize:{ sm: '1rem', md: '1.5rem' },
                lineHeight: 1
              }}
            >
              {t('header')}
            </Typography>
            <Typography
              className="subHeaderText"
              sx={{
                fontSize:{ sm: '0.6rem', md: '1.1rem' },
              }}
            >
              {t('subHeader')}
            </Typography>
          </Link>
        </Box>

        <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
          <Box
            ref={searchAnchorRef}
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              justifyContent: 'center',
              width: { xs: 260, sm: 360, md: 520 },
              maxWidth: '60vw',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <TextField
                fullWidth
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (!searchOpen) setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search"
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />

              <Popper
                open={shouldShowDropdown}
                anchorEl={searchAnchorRef.current}
                placement="bottom-start"
                disablePortal
                sx={{ zIndex: 1400, width: popperWidth ? `${popperWidth}px` : undefined }}
              >
                <Paper sx={{ mt: 1, maxHeight: 360, overflowY: 'auto' }}>
                  {isSearching && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, padding: 2 }}>
                      <CircularProgress size={18} />
                      <Typography variant="body2">Searching…</Typography>
                    </Box>
                  )}

                  {!isSearching && searchFailed && (
                    <Box sx={{ padding: 2 }}>
                      <Typography variant="body2">Failed to search</Typography>
                    </Box>
                  )}

                  {!isSearching && !searchFailed && searchResults.length === 0 && (
                    <Box sx={{ padding: 2 }}>
                      <Typography variant="body2">No results</Typography>
                    </Box>
                  )}

                  {!isSearching && !searchFailed && searchResults.length > 0 && (
                    <List disablePadding>
                      {searchResults.map((item) => {
                        const record: any = item?.dataDisclosureAgreementRecord || {};
                        const primary = record?.purpose || item?.organisationName || 'Data Disclosure Agreement';
                        const secondary = item?.organisationName || record?.dataController?.name || '';
                        return (
                          <ListItemButton
                            key={item.id}
                            onClick={() => handleSelectResult(item)}
                          >
                            <ListItemText
                              primary={primary}
                              secondary={secondary}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  )}
                </Paper>
              </Popper>
            </Box>
          </Box>
        </ClickAwayListener>

        {
          pathnameWithoutLocale === 'login' ? null : (
            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" component={Link} href="/login" className="loginBtn">
              Login
            </Button>
            </Box>
          )
        }
      </Toolbar>
    </AppBar>
  </Box>
  );
}
