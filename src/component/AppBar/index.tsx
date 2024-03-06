import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";
import { AppBarMenu } from "./AppBarMenu";
import Logo from "../../../public/img/logo.jpg";
import './style.scss';

export default function MyAppBar() {

  return (
    <Box className="appBarContainer">
      <AppBar
        sx={{
          backgroundColor: "#212636",
          height: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {}}
          >
            <MenuIcon style={{ height: 60, width: 60 }} />
          </IconButton>
          <img className='logoImg' src={Logo} alt="Logo" />

          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "contents" },
            }}
            variant="h6"
          >
            CRANE d-HDSI Dataspace
          </Typography>
          <AppBarMenu firstName={""} email={""} lastVisited={""} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
