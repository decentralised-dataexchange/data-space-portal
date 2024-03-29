import React, { useState, useEffect } from 'react';
import {
    Box,
    Divider,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox
  } from "@mui/material";
import { PersonOutlineOutlined, ArrowCircleRightOutlined, LockOpenOutlined }  from "@mui/icons-material";
import Footer from '../../component/Footer';
import { styled } from "@mui/material/styles";
import Logo from '../../../public/img/logo.jpg';
import './login.scss'
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SnackbarComponent from '../../component/notification';
import { useAppDispatch } from "../../customHooks";
import { loginAction } from "../../redux/actionCreators/login";
import { LocalStorageService } from '../../utils/localStorageService';

interface FormValue {
  email: string,
  password: string
}

const Login = () => {
  const { t } = useTranslation('translation');
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [ formValue, setFormValue ] = useState<FormValue>({ email: '', password: '' });
  const { email, password }  = formValue;
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const FooterContainer = styled("div")({
    position: "fixed",
    left: 0,
    bottom: 16,
    width: "100%",
    textAlign: "center",
  }); 

  const isAuthenticated = localStorage.getItem('Token');

  useEffect(() => {
    isAuthenticated && navigate('/start');
  }, []);

  const callback = (isLogin) => {
    isLogin ? navigate('/start') : setOpenSnackBar(true);
  }

  const submit = () => {
    sessionStorage.removeItem('isVerify');
    dispatch(loginAction(email, password, callback));
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    })
  }

    return (
      <Box className="loginWrpper">
        <SnackbarComponent
          open={openSnackBar}
          setOpen={setOpenSnackBar}
          message={t("login.errorMessage")}
        />
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
          <form onSubmit={(e) => submit(e)}>
            <Box className='text-field'>
              <TextField
                autoFocus
                name="email"
                type="email"
                style={{ marginTop: "-0.5rem" }}
                value={email}
                onChange={(e) => handleChange(e)}
                variant="standard"
                label={false}
                placeholder={t('login.userId')}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <PersonOutlineOutlined style={{ color: "#A1A1A1" }} />
                  ),
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                }}
              />
              <Divider />
              <TextField
                name="password"
                type="password"
                value={password}
                onChange={(e) => handleChange(e)}
                variant="standard"
                label={false}
                placeholder={t('login.password')}
                fullWidth
                InputProps={{
                  startAdornment: <LockOpenOutlined style={{ color: "#A1A1A1" }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  endAdornment: (
                    <ArrowCircleRightOutlined
                      style={{ color: "#A1A1A1", cursor: "pointer" }}
                      onClick={submit}
                    />
                  ),
                }}
              />
            </Box>
          </form>
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
