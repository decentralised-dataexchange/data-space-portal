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
import Logo from '../../../public/img/logo.jpg';
import './login.scss'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()
  const FooterContainer = styled("div")({
    position: "fixed",
    left: 0,
    bottom: 16,
    width: "100%",
    textAlign: "center",
  }); 

  const submit = () => {
    navigate('/start');
  }

    return (
        <Box className='loginContainer'>
          <Box className='d-flex-center'>
            <img className="logoImg" src={Logo} alt="Logo" />
          </Box>
          <Box
            sx={{
              margin: "1rem",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p className='titleTxt'>CRANE dHDSI - Organisation dashboard</p>
          </Box>
          <Box className='text-field'>
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
              placeholder='Password'
              fullWidth
              InputProps={{
                startAdornment: <LockOutlined style={{ color: "#A1A1A1" }} />,
                disableUnderline: true,
                onKeyPress: () => {},
                endAdornment: (
                  <ArrowCircleRightOutlined
                    style={{ color: "#A1A1A1", cursor: "pointer" }}
                    onClick={submit}
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
              <Footer txt='v2024.03.1' />
            </FooterContainer>
        </Box>
    )
}

export default Login;