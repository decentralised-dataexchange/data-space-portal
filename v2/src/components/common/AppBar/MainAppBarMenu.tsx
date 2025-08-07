"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { LocalStorageService } from "@/utils/localStorageService";
import { Box, Menu, Typography, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { defaultLogoImg } from "@/constants/defalultImages";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { logout } from "@/store/reducers/authReducer";
import { GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useGetGettingStartData, useGetLogoImage } from "@/custom-hooks/gettingStarted";

type Props = {
  firstName?: string;
  email?: string;
};

export const MainAppBarMenu = (props: Props) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const adminDetails = useAppSelector((state) => state.auth.adminDetails);
  const organisationDetails = useAppSelector((state) => state.gettingStart.data);
  const orgImages = useAppSelector((state) => state.gettingStart.imageSet);

  // Use admin details from Redux first, fallback to props
  const userEmail = adminDetails?.email || props.email || '';
  const userName = adminDetails?.name || props.firstName || '';

  const { data: gettingStartData } = useGetGettingStartData();
  const { data: logoImage } = useGetLogoImage();

  const orgName = gettingStartData?.dataSource?.name || organisationDetails?.name || 'Organisation';
  const orgLocation = gettingStartData?.dataSource?.location || organisationDetails?.location || 'Location';
  const orgAvatarUrl = logoImage || orgImages?.logo || defaultLogoImg;


  const handleClickLogOut = () => {
    dispatch(logout());
    LocalStorageService.clear();
    router.push('/login');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    isAuthenticated ? setAnchorEl(event.currentTarget) : router.push('/login');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', ml: 1, justifyContent: 'center', gap: 1 }}>
          <Typography noWrap sx={{ fontSize: '16px', color: 'white', lineHeight: 1, marginBottom: '2px' }}>
            {orgName}
          </Typography>
          <Typography noWrap sx={{ fontSize: '12px', color: 'white', lineHeight: 1 }}>
            {orgLocation}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenu}
        >
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={orgAvatarUrl}
            alt={`Logo of ${orgName}`}
          />
        </IconButton>
      </Box>
      <Menu
        sx={{ mt: "65px" }}
        id="menu-appbar"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box
          style={{
            display: "grid",
            justifyItems: "center",
            minWidth: 220,
            padding: 10,
          }}
        >
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={orgAvatarUrl}
            alt={`Logo of ${orgName}`}
          />
          <Typography
            variant="body2"
            style={{ fontWeight: "bold", margin: "0.5rem 4px" }}
          >
            {userName || props.firstName}
          </Typography>
          <Typography variant="caption" style={{ marginBottom: "6px" }}>
            {userEmail}
          </Typography>
        </Box>
        <Box style={{ color: "black", borderTop: "1px solid #BDBDBD" }}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              padding: 7,
              paddingLeft: 15,
              cursor: "pointer",
            }}
            onClick={() => router.push("/account/manage-admin")}
          >
            <GearSixIcon size={24} />
            <Typography ml={1} variant="body2">
              {t("appBar.settings")}
            </Typography>
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              padding: 7,
              paddingLeft: 15,
              cursor: "pointer",
              marginTop: 5,
            }}
            onClick={handleClickLogOut}
          >
            <SignOutIcon size={24} />
            <Typography ml={1} variant="body2">
              {t("appBar.signout")}
            </Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
