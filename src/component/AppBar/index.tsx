import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { AppBarMenu } from "./AppBarMenu";
import Logo from "../../../public/img/logo.jpg";
import './style.scss';
import { useLocation } from "react-router-dom";
import { getDevice } from '../../utils/utils'

export default function MyAppBar({handleOpenMenu}) {
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
          <Box className='d-flex flex-column'>
            <Typography
                sx={{
                  fontSize: isMobile ? '1rem' : '1.5rem',
                  lineHeight: 1
                }}
              >
                CRANE d-HDSI Dataspace
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? '0.6rem' : '1.1rem',
                }}
              >
                Sweden - Region Västerbotten
              </Typography>
          </Box>
          <AppBarMenu firstName={""} email={""} lastVisited={""} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
