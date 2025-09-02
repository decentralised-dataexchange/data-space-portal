"use client";

import React, { useState } from 'react';
import { Box, Divider, TextField, IconButton, Typography } from "@mui/material";
import { ArrowCircleRightIcon, UserIcon, LockOpenIcon } from "@phosphor-icons/react";
import Logo from '@/assets/img/logo.jpg';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './style.scss';
import { useSignup } from '@/custom-hooks/auth';

interface FormValue {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const t = useTranslations();
  const [formValue, setFormValue] = useState<FormValue>({ name: '', email: '', password: '', confirmPassword: '' });
  const { name, email, password, confirmPassword } = formValue;
  const { signup: doSignup, isLoading } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validations
    if (!email || !password) return;
    if (password !== confirmPassword) return;

    doSignup({ email, password, name: name || undefined });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  return (
    <Box className="loginWrapper">
      <Box className='loginContainer'>
        <Box className='d-flex-center'>
          <Link href="/">
            <Image className="logoImg" src={Logo} alt="Logo" width={180} height={180} priority />
          </Link>
        </Box>
        <Box sx={{ margin: "1rem", textAlign: "center", gap: "1rem", display: "flex", flexDirection: "column" }}>
          <p className='titleTxt'>{t('common.orgDashboardTitle')}</p>
          <p className='titleTxt'>{t('signup.title')}</p>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box className='text-field'>
            <TextField
              name="name"
              type="text"
              value={name}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.name')}
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
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.email')}
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
              slotProps={{
                input: {
                  startAdornment: <LockOpenIcon size={22} style={{ color: "#777", marginRight: "0.5rem", transform: "translateY(-2px)" }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                }
              }}
            />
            <Divider />
            <TextField
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.confirmPassword')}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <LockOpenIcon size={22} style={{ color: "#777", marginRight: "0.5rem", transform: "translateY(-2px)" }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  endAdornment: (
                    <IconButton type="submit" disabled={isLoading}>
                      <ArrowCircleRightIcon
                        size={22}
                        style={{ color: "#888", cursor: "pointer", transform: "translateY(-2px)" }}
                      />
                    </IconButton>
                  ),
                }
              }}
            />
          </Box>
        </form>
        <Box sx={{ width: "100%", marginTop: ".5em", display: "flex", justifyContent: "center" }}>
          <Typography variant="body2" style={{ color: "#A1A1A1" }}>
            {t('signup.haveAccount')}
            {' '}
            <Link href="/login">{t('signup.login')}</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Signup;
