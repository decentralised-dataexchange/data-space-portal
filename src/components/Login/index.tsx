"use client";

import React, { useState } from 'react';
import {
  Box,
  Divider,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton
} from "@mui/material";
import { ArrowCircleRightIcon, UserIcon, LockOpenIcon } from "@phosphor-icons/react";
import Logo from '@/assets/img/logo.jpg';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useLogin } from '@/custom-hooks/auth';
import Image from 'next/image';
import styles from './style.module.scss';

interface FormValue {
  email: string,
  password: string
}

const Login = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [formValue, setFormValue] = useState<FormValue>({ email: '', password: '' });
  const { email, password } = formValue;
  const { login } = useLogin();

  const onboardingHref = locale ? `/${locale}/onboarding` : '/onboarding';

  // Determine if form is valid for enabling submit
  const isFormValid = !!email && !!password;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    sessionStorage.removeItem('isVerify');
    login({ email, password });
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

  // Shared styles to ensure both inputs look identical with 56px height
  const inputSx = {
    '& .MuiInputBase-root': {
      height: 56,
      minHeight: 56,
      alignItems: 'center',
      marginTop: 0,
    },
    '& .MuiInputBase-input': {
      height: 56,
      lineHeight: '56px',
      padding: 0,
      fontSize: '0.875rem',
    },
  } as const;

  return (
    <Box className={styles.loginWrapper}>
      {/* No local Snackbar; using global Snackbar in AppLayout */}
      <Box className={styles.loginContainer}>
        <Box className={styles.dFlexCenter}>
          <Link href="/">
            <Image className={styles.logoImg} src={Logo} alt="Logo" width={180} height={180} priority />
          </Link>
        </Box>
        <Box
          sx={{
            margin: "1rem",
            textAlign: "center", 
            display: "flex", 
            flexDirection: "column", 
            gap: "1rem"
          }}
        >
          <h1 className='titleTxt'>{t('common.orgDashboardTitle')}</h1>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box className={styles.textField}>
            <TextField
              autoFocus
              name="email"
              type="email"
              sx={inputSx}
              value={email}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('login.userId')}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <UserIcon size={22} style={{ color: "#777", marginRight: "0.5rem", transform: "translateY(-2px)" }} />
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
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: <LockOpenIcon size={22} style={{ color: "#777", marginRight: "0.5rem"
                    
                  }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  endAdornment: (
                    <IconButton type="submit" disabled={!isFormValid} sx={{ '&.Mui-disabled': { pointerEvents: 'all', cursor: 'not-allowed' } }}>
                      <ArrowCircleRightIcon
                        size={22}
                        style={{ color: "#888", transform: "translateY(-2px)" }}
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
        <Box sx={{ width: "100%", marginTop: ".5em", display: "flex", justifyContent: "center" }}>
          <Typography variant="body2" style={{ color: "#A1A1A1" }}>
            {t('login.noAccount')}
            {' '}
            <Link className="appLink" href={onboardingHref}>{t('login.createNow')}</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Login;
