"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { LocalStorageService } from "@/utils/localStorageService";
import { Box, Menu, Typography, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { defaultLogoImg } from "@/constants/defalultImages";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { useAuth as useAuthContext } from "@/components/common/AuthProvider";
import { GearSixIcon, SignOutIcon } from "@phosphor-icons/react";
import { useGetOrganisation } from "@/custom-hooks/gettingStarted";

type Props = {
  firstName?: string;
  email?: string;
};

export const MainAppBarMenu = (props: Props) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { logout } = useAuthContext();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const adminDetails = useAppSelector((state) => state.auth.adminDetails);
  const organisationDetails = useAppSelector((state) => state.gettingStart.data);
  const orgImages = useAppSelector((state) => state.gettingStart.imageSet);

  // Use admin details from Redux first, then LocalStorage, then props, then email prefix
  const userEmail = adminDetails?.email || props.email || '';
  const storedUser = LocalStorageService.getUser();
  const storedName = (storedUser as any)?.name || (storedUser as any)?.firstName || (storedUser as any)?.first_name || '';
  const emailPrefix = userEmail ? userEmail.split('@')[0] : '';
  const userName = adminDetails?.name || storedName || props.firstName || emailPrefix;

  const { data: organisationResp } = useGetOrganisation();
  // Use organisation response shape { organisation: {...} }
  const orgFromHook = organisationResp?.organisation || {} as any;
  const orgFromRedux = (organisationDetails as any)?.organisation || organisationDetails || {};
  const orgName = orgFromHook?.name || orgFromRedux?.name || 'Organisation';
  const orgLocation = orgFromHook?.location || orgFromRedux?.location || 'Location';
  // Use organization logo instead of user avatar for the navbar avatar
  const orgLogoFromImages = orgImages?.logo;
  const orgLogoUrl = orgLogoFromImages || orgFromHook?.logoUrl || orgFromRedux?.logoUrl || defaultLogoImg;


  const handleClickLogOut = () => {
    // Use centralized logout to clear React Query and all storages
    logout();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    isAuthenticated ? setAnchorEl(event.currentTarget) : router.push('/login');
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            src={orgLogoUrl}
            alt={`Organization logo`}
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
            src={orgLogoUrl}
            alt={`Organization logo`}
          />
          <Typography
            variant="body2"
            style={{ fontWeight: "bold", margin: "0.5rem 4px" }}
          >
            {userName}
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
