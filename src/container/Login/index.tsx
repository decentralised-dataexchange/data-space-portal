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
import { PersonOutlineOutlined, ArrowCircleRightOutlined, LockOpenOutlined }  from "@mui/icons-material";
import Footer from '../../component/Footer';
import { styled } from "@mui/material/styles";
import Logo from '../../../public/img/logo.jpg';
import './login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {

  const { t } = useTranslation('translation');
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
    sessionStorage.removeItem('isVerify');
  }

    return (
      <Box className="loginWrpper">
        <Box className='loginContainer'>
          <Box className='d-flex-center'>
            <Link to="/">
              <img className="logoImg" src={Logo} alt="Logo" />
            </Link>
          </Box>
          <Box
            sx={{
              margin: "1rem",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <p className='titleTxt'>{t('login.header')}</p>
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
              placeholder={t('login.userId')}
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
              placeholder={t('login.password')}
              fullWidth
              InputProps={{
                startAdornment: <LockOpenOutlined style={{ color: "#A1A1A1" }} />,
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
                    {t('login.rememberMe')}
                  </Typography>
                }
                style={{ color: "#A1A1A1" }}
              />
            </Box>
            <FooterContainer>
              <Footer txt='v2024.03.1' />
            </FooterContainer>
        </Box>
        </Box>
    )
}

export default Login;