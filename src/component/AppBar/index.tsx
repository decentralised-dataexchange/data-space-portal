import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { AppBarMenu } from "./AppBarMenu";
import Logo from "../../../public/img/logo.jpg";
import './style.scss';
import { useLocation } from "react-router-dom";
import { getDevice, publicRoutes } from '../../utils/utils'
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { adminAction } from "../../redux/actionCreators/login";

export default function MyAppBar({handleOpenMenu}) {
  const { t } = useTranslation('translation');
  const dispatch = useAppDispatch();
  const { isMobile } = getDevice();
  const { pathname } = useLocation();
  const isAuthenticated = localStorage.getItem('Token');

  const adminData = useAppSelector(
    (state) => state?.user?.data
  );

  useEffect(() => {
    !adminData?.name && dispatch(adminAction());
  }, [])

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
            sx={{cursor: publicRoutes(pathname) ? 'not-allowed' : 'pointer'}}
            edge="start"
            color="inherit"
            onClick={() => publicRoutes(pathname) ? '' : handleOpenMenu()}
          >
            <MenuIcon style={{ height: 60, width: 60 }} />
          </IconButton>
          <img className='logoImg' src={Logo} alt="Logo" />
          <Box className='flex-column'>
            <Typography
                sx={{
                  fontSize: isMobile ? '1rem' : '1.5rem',
                  lineHeight: 1
                }}
              >
                {t('appBar.header')}
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? '0.6rem' : '1.1rem',
                }}
              >
                {t('appBar.subHeader')}
              </Typography>
          </Box>
          {/* {isAuthenticated && */}
            <AppBarMenu
            firstName={adminData?.name}
            // lastVisited={'march 29'}
            email={adminData?.email}
          />
          {/* } */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
