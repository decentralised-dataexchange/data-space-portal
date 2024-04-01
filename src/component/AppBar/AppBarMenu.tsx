import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorageService } from "../../utils/localStorageService";
// import { formatISODateToLocalString } from "../../utils/formatISODateToLocalString";
import { Box, Menu, Typography, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import defaultAvatar from "../../../public/img/avatar.png";
import { useTranslation } from "react-i18next";
import { defaultLogoImg } from "../../utils/defalultImages";

type Props = {
  firstName: string;
  email: string;
  // lastVisited: string;
};

export const AppBarMenu = (props: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation("translation");

  const [userAvatar, setUserAvatar] = useState<any>(
    LocalStorageService.getUserProfilePic()
  );
  const [userName, setUserName] = useState<any>();
  const isAuthenticated = localStorage.getItem('Token');

  const handleClickLogOut = () => {
    LocalStorageService.clear();
    navigate('/login')
  };

  // useEffect(() => {
  //   setUserAvatar(LocalStorageService.getUserProfilePic());
  // }, [changeAvatar]);

  // useEffect(() => {
  //   HttpService.getOrganisationAdminDetails().then((res) => {
  //     setUserName(res.data.name);
  //   });
  // }, [changeAdminName]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    isAuthenticated ? setAnchorEl(event.currentTarget) : navigate('/login');
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={handleMenu}
        sx={{ marginLeft: "auto" }}
      >
        {userAvatar ? (
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={defaultAvatar}
          />
        ) : (
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={defaultAvatar}
            alt="img"
          />
        )}
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
            {props.email}
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
            onClick={() => navigate("/account/manage-admin")}
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
