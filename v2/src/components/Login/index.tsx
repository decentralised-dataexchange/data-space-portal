"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton
} from "@mui/material";
import { PersonOutlineOutlined, ArrowCircleRightOutlined, LockOpenOutlined } from "@mui/icons-material";
import Logo from '@/assets/img/logo.jpg';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SnackbarComponent from '@/components/notification';
import { useLogin } from '@/custom-hooks/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios, { AxiosError } from 'axios';
import './style.scss';

interface FormValue {
  email: string,
  password: string
}

const Login = () => {
  const t = useTranslations();
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [formValue, setFormValue] = useState<FormValue>({ email: '', password: '' });
  const { email, password } = formValue;
  const { login, error } = useLogin();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('Token');
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  // Handle errors from login attempt
  useEffect(() => {
    if (error) {
      setOpenSnackBar(true);
      setSuccessMessage('');
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // Extract error message from response if available
        const responseData = axiosError.response?.data as any;
        const errorMsg = responseData?.detail || 
                        responseData?.message || 
                        axiosError.message || 
                        'Invalid email or password';
        setErrorMessage(errorMsg);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Login failed');
      }
    }
  }, [error]);
  
  // Watch for successful login attempts
  useEffect(() => {
    // This will run after a successful login
    const token = localStorage.getItem('Token');
    if (token && !error) {
      setOpenSnackBar(true);
      setSuccessMessage('Login successful');
      setErrorMessage('');
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setOpenSnackBar(true);
      setErrorMessage('Please enter email and password');
      setSuccessMessage('');
      return;
    }

    sessionStorage.removeItem('isVerify');
    login({ email, password });
    
    // Show success message on successful login
    if (!error) {
      setOpenSnackBar(true);
      setSuccessMessage('Login successful');
      setErrorMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  return (
    <Box className="loginWrapper">
      <SnackbarComponent
        open={openSnackBar}
        setOpen={setOpenSnackBar}
        message={errorMessage || t("login.errorMessage")}
        successMessage={successMessage}
      />
      <Box className='loginContainer'>
        <Box className='d-flex-center'>
          <Link href="/">
            <Image className="logoImg" src={Logo} alt="Logo" width={180} height={180} priority />
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
        <form onSubmit={handleSubmit}>
          <Box className='text-field'>
            <TextField
              autoFocus
              name="email"
              type="email"
              style={{ marginTop: "-0.5rem" }}
              value={email}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('login.userId')}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <PersonOutlineOutlined style={{ color: "#A1A1A1" }} />
                  ),
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                }
              }}
            />
            <Divider />
            <TextField
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('login.password')}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <LockOpenOutlined style={{ color: "#A1A1A1" }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  endAdornment: (
                    <IconButton type="submit">
                      <ArrowCircleRightOutlined
                        style={{ color: "#A1A1A1", cursor: "pointer" }}
                      />
                    </IconButton>
                  ),
                }
              }}
            />
          </Box>
        </form>
        <Box
          sx={{
            width: "100%",
            marginTop: ".5em",
            display: "flex",
            justifyContent: "center"
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
      </Box>
    </Box>
  )
}

export default Login;
