import React, { useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { AppBarMenu } from "./AppBarMenu";
import Logo from "../../../public/img/logo.jpg";
import './style.scss';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDevice, publicRoutes } from '../../utils/utils'
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../customHooks";

export default function MyAppBar({handleOpenMenu}) {
  const { t } = useTranslation('translation');
  const { isMobile } = getDevice();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('Token');

  const adminData = useAppSelector(
    (state) => state?.user?.data
  );

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
            sx={{cursor: publicRoutes(pathname) && !isAuthenticated ? 'not-allowed' : 'pointer'}}
            edge="start"
            color="inherit"
            onClick={() => isAuthenticated ? handleOpenMenu() : ''}
          >
            <MenuIcon style={{ height: 60, width: 60 }} />
          </IconButton>
           <Link to="/">
             <img className='logoImg' src={Logo} alt="Logo" />
           </Link>
          <Box className='flex-column' onClick={() => navigate('/')} sx={{cursor: 'pointer'}}>
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
