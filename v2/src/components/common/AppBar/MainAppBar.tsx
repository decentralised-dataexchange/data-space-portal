"use client";

import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { MainAppBarMenu } from "./MainAppBarMenu";
import Image from "next/image";
import Logo from "@/assets/img/logo.jpg";

import './styles.scss';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/custom-hooks/store";

interface Props {
    handleOpenMenu: () => void;
}

export default function MainAppBar({ handleOpenMenu }: Props) {
    const t = useTranslations();
    const router = useRouter();
    const adminData = useAppSelector((state) => state.auth.adminDetails);
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
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleOpenMenu}
                    >
                        <MenuIcon style={{ height: 60, width: 60 }} />
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

                    <MainAppBarMenu
                        firstName={adminData?.name || ''}
                        email={adminData?.email || ''}
                    />

                </Toolbar>
            </AppBar>
        </Box>
    );
}
