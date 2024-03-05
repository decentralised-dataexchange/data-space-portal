import React from 'react';
import {
    Box,
    Divider,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox
  } from "@mui/material";

  // icons
import { PersonOutlineOutlined, ArrowCircleRightOutlined, LockOutlined }  from "@mui/icons-material";
import Footer from '../../component/Footer';
import { styled } from "@mui/material/styles";

const Login = () => {
  const FooterContainer = styled("div")({
    position: "fixed",
    left: 0,
    bottom: 16,
    width: "100%",
    textAlign: "center",
  }); 
    return (
        <Box
            style={{
                display: "flex",
                minHeight: "90dvh",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFF",
            }}
            >
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={Logo} alt="Logo1" />
          </Box> */}
          <Box
            sx={{
              margin: "1rem",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Typography variant="h5">CRANE dHDSI - Organisation dashboard</Typography>
          </Box>
          <Box
            style={{
              boxSizing: "border-box",
              padding: 5,
              border: "1px solid #cecece",
              borderRadius: 7,
              width:400
            }}
          >
            <TextField
              autoFocus
              name="email"
              type="email"
              style={{ marginTop: "-0.5rem" }}
            //   value={username}
            //   onChange={(e) => setUsername(e.target.value)}
            //   source="username"
              variant="standard"
              label={false}
              placeholder='User ID'
              fullWidth
              InputProps={{
                startAdornment: (
                  <PersonOutlineOutlined style={{ color: "#A1A1A1" }} />
                ),
                disableUnderline: true,
                onKeyPress: () => {},
              }}
            />
            <Divider />
            <TextField
              name="password"
              type="password"
            //   value={password}
            //   onChange={(e) => setPassword(e.target.value)}
            //   source="password"
              variant="standard"
              label={false}
              placeholder='password'
              fullWidth
              InputProps={{
                startAdornment: <LockOutlined style={{ color: "#A1A1A1" }} />,
                disableUnderline: true,
                onKeyPress: () => {},
                endAdornment: (
                  <ArrowCircleRightOutlined
                    style={{ color: "#A1A1A1", cursor: "pointer" }}
                    // onClick={submit}
                  />
                ),
              }}
            />
          </Box>

          <Box
              sx={{
                width: "100%",
                marginTop: ".5em",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    sx={{
                      color: "#A1A1A1",
                      "&.Mui-checked": {
                        color: "#1890FF",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2">
                    Remember me
                  </Typography>
                }
                style={{ color: "#A1A1A1" }}
              />
            </Box>
            <FooterContainer>
              <Footer version='v2024.03.1' />
            </FooterContainer>
        </Box>
    )
}

export default Login;