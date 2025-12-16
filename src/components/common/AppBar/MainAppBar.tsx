"use client";

import React from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, TextField, Paper, List, ListItemButton, ListItemText, Popper, ClickAwayListener, CircularProgress } from "@mui/material";
import { MainAppBarMenu } from "./MainAppBarMenu";
import Image from "next/image";
import Logo from "@/assets/img/logo.jpg";

import './styles.scss';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/custom-hooks/store";
import { ListIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { apiService } from "@/lib/apiService/apiService";
import type { ServiceSearchDdaItem } from "@/types/serviceSearch";

interface Props {
    handleOpenMenu: () => void;
}

export default function MainAppBar({ handleOpenMenu }: Props) {
    const t = useTranslations();
    const router = useRouter();
    const locale = useLocale();
    const pathname = usePathname();
    const adminData = useAppSelector((state) => state.auth.adminDetails);

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

    // Determine if we're on onboarding (strip locale prefix like /en, /fi, /sv)
    const isOnOnboarding = React.useMemo(() => {
        if (!pathname) return false;
        const match = pathname.match(/^\/(en|fi|sv)(?:\/|$)(.*)/);
        const pathNoLocale = match ? `/${match[2]}` : pathname;
        return pathNoLocale.startsWith('/onboarding');
    }, [pathname]);

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
        setSearchOpen(false);
        router.push(`/${locale}/data-source/read/${target}`);
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
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleOpenMenu}
                        >
                            <ListIcon size={32} />
                        </IconButton>
                        <Link href="/">
                            <Image 
                                src={Logo} 
                                alt="Logo" 
                                className='logoImg' 
                                width={58}
                                height={58}
                                priority
                            />
                        </Link>
                        {!isOnOnboarding && (
                            <Box className='flex-column' onClick={() => router.push('/')} sx={{ cursor: 'pointer' }}>
                                <Typography
                                    sx={{
                                        xs: {
                                            fontSize: '1rem',
                                            lineHeight: 1
                                        },
                                        md: {
                                            fontSize: '1.5rem',
                                            lineHeight: 1
                                        }
                                    }}
                                >
                                    {t('appBar.header')}
                                </Typography>
                                <Typography
                                    sx={{
                                        xs: {
                                            fontSize: '0.6rem',
                                            lineHeight: 1
                                        },
                                        md: {
                                            fontSize: '1.1rem',
                                            lineHeight: 1
                                        }
                                    }}
                                >
                                    {t('appBar.subHeader')}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {!isOnOnboarding && (
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
                    )}

                    <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <MainAppBarMenu
                            firstName={adminData?.name || ''}
                            email={adminData?.email || ''}
                        />
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
