"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { LocalStorageService } from "@/utils/localStorageService";
import { Box, Menu, Typography, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useTranslations } from "next-intl";
import { defaultLogoImg } from "@/constants/defalultImages";
import { useAppDispatch, useAppSelector } from "@/custom-hooks/store";
import { logout } from "@/store/reducers/authReducer";

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

  // Use admin details from Redux first, fallback to props
  const userEmail = adminDetails?.email || props.email || '';
  const userName = adminDetails?.name || props.firstName || '';
  
  // Get user avatar from localStorage
  const [userAvatar, setUserAvatar] = useState<any>(
    LocalStorageService.getUserProfilePic()
  );

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
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleMenu}
        sx={{ marginLeft: "auto" }}
      >
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={defaultLogoImg}
            alt="img"
          />
      </IconButton>
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
            src={defaultLogoImg}
            alt="img"
          />
          <Typography
            variant="body2"
            style={{ fontWeight: "bold", marginBottom: "4px" }}
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
            <SettingsOutlinedIcon />
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
            <ExitToAppIcon />
            <Typography ml={1} variant="body2">
              {t("appBar.signout")}
            </Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
