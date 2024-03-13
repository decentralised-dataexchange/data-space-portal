import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { AppBarMenu } from "./AppBarMenu";
import Logo from "../../../public/img/logo.jpg";
import './style.scss';
import { useLocation } from "react-router-dom";
import { getDevice } from '../../utils/utils'
import { useTranslation } from "react-i18next";

export default function MyAppBar({handleOpenMenu}) {
  const { t } = useTranslation('translation');
  const { isMobile } = getDevice();
  const { pathname } = useLocation();
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
            onClick={() => handleOpenMenu()}
            {...pathname === '/' ? {className: 'pointerNone'} : ''}
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
          <AppBarMenu firstName={""} email={""} lastVisited={""} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
