"use client";

import React, { useState } from 'react';
import { Box, Divider, TextField, IconButton, Typography } from "@mui/material";
import { ArrowCircleRightIcon, UserIcon, LockOpenIcon, MapPin, Briefcase, LinkSimple, EnvelopeSimple, Globe, TextAlignLeft } from "@phosphor-icons/react";
import Logo from '@/assets/img/logo.jpg';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import './style.scss';
import { useSignup } from '@/custom-hooks/auth';
import type { SignupPayload } from '@/types/auth';
import { useAppDispatch } from '@/custom-hooks/store';
import { setMessage } from '@/store/reducers/authReducer';

interface FormValue {
  // Organisation fields
  organisationName: string;
  sector: string;
  location: string;
  policyUrl: string;
  description: string;
  verificationRequestURLPrefix: string;
  // User fields
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = () => {
  const t = useTranslations();
  const [formValue, setFormValue] = useState<FormValue>({
    organisationName: '',
    sector: '',
    location: '',
    policyUrl: '',
    description: '',
    verificationRequestURLPrefix: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const { organisationName, sector, location, policyUrl, description, verificationRequestURLPrefix, userName, email, password, confirmPassword } = formValue;
  const { signup: doSignup, isLoading } = useSignup();
  const dispatch = useAppDispatch();
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const passwordLengthInvalid = password.length > 0 && (password.length < 8 || password.length > 20);

  const MAX_SHORT = 100;
  const MAX_DESC = 500;
  const NEAR_END_THRESHOLD = 10; // show counter when within last 10 chars

  const showNearMax = (val: string, max: number) => val.length >= Math.max(0, max - NEAR_END_THRESHOLD);

  // Reusable UI helpers for consistent icon and counter handling
  const iconStyle: React.CSSProperties = { color: "#777", marginRight: "0.5rem", transform: "translateY(-2px)" };
  const endCounter = (val: string, max: number) => (
    showNearMax(val, max) ? <span style={{ color: '#999', fontSize: '0.7rem' }}>{`${val.length}/${max}`}</span> : null
  );
  const inputSlots = (
    iconNode: React.ReactNode,
    val: string,
    max: number,
    includeCounter: boolean = true
  ) => ({
    startAdornment: iconNode,
    endAdornment: includeCounter ? endCounter(val, max) : null,
    disableUnderline: true,
    onKeyPress: handleKeyPress,
  });

  // Overall form validity (computed after validation flags above)
  const isFormValid = (
    !!organisationName &&
    !!sector &&
    !!location &&
    !!policyUrl &&
    !!description &&
    !!userName &&
    !!email &&
    !!verificationRequestURLPrefix &&
    !!password &&
    !!confirmPassword &&
    !passwordLengthInvalid &&
    password === confirmPassword
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validations
    if (!organisationName || !sector || !location || !policyUrl || !description || !userName || !email || !verificationRequestURLPrefix || !password || !confirmPassword) {
      setShowFieldErrors(true);
      dispatch(setMessage(t('signup.requiredFieldsMissing')));
      return;
    }
    if (passwordLengthInvalid) {
      setShowFieldErrors(true);
      dispatch(setMessage(t('signup.passwordLength')));
      return;
    }
    if (password !== confirmPassword) {
      setShowFieldErrors(true);
      dispatch(setMessage(t('signup.passwordMismatch')));
      return;
    }

    const payload = {
      organisation: {
        name: organisationName,
        sector,
        location,
        policyUrl,
        description,
        verificationRequestURLPrefix,
      },
      name: userName,
      email,
      password,
      confirmPassword
    };

    doSignup(payload as SignupPayload);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
            {/* User Name */}
            <TextField
              name="userName"
              type="text"
              value={userName}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.userName')}
              fullWidth
              slotProps={{ input: inputSlots(<UserIcon size={22} style={iconStyle} />, userName, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !userName}
              helperText={showFieldErrors && !userName ? t('signup.required') : ''}
            />
            <Divider />

            {/* Organisation Name */}
            <TextField
              name="organisationName"
              type="text"
              value={organisationName}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.organisationName')}
              fullWidth
              slotProps={{ input: inputSlots(<UserIcon size={22} style={iconStyle} />, organisationName, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !organisationName}
              helperText={showFieldErrors && !organisationName ? t('signup.required') : ''}
            />
            <Divider />

            {/* Sector */}
            <TextField
              name="sector"
              type="text"
              value={sector}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.sector')}
              fullWidth
              slotProps={{ input: inputSlots(<Briefcase size={22} style={iconStyle} />, sector, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !sector}
              helperText={showFieldErrors && !sector ? t('signup.required') : ''}
            />
            <Divider />

            {/* Location */}
            <TextField
              name="location"
              type="text"
              value={location}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.location')}
              fullWidth
              slotProps={{ input: inputSlots(<MapPin size={22} style={iconStyle} />, location, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !location}
              helperText={showFieldErrors && !location ? t('signup.required') : ''}
            />
            <Divider />

            {/* Policy URL */}
            <TextField
              name="policyUrl"
              type="url"
              value={policyUrl}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.policyUrl')}
              fullWidth
              slotProps={{ input: inputSlots(<LinkSimple size={22} style={iconStyle} />, policyUrl, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !policyUrl}
              helperText={showFieldErrors && !policyUrl ? t('signup.required') : ''}
            />
            <Divider />

            {/* Description */}
            <TextField
              name="description"
              multiline
              minRows={1}
              maxRows={6}
              value={description}
              onChange={handleChange}
              variant="standard"
              placeholder={t('signup.description')}
              fullWidth
              slotProps={{ input: inputSlots(<TextAlignLeft size={22} style={iconStyle} />, description, MAX_DESC, true) }}
              inputProps={{ maxLength: MAX_DESC }}
              helperText={showFieldErrors && !description ? t('signup.required') : undefined}
              error={showFieldErrors && !description}
              sx={{
                '& .MuiInputBase-root': { alignItems: 'center', minHeight: 40, paddingTop: 0, paddingBottom: 0 },
                '& .MuiInputBase-inputMultiline': { paddingTop: 0, paddingBottom: 0, lineHeight: '1.4375em', minHeight: '1.4375em' },
                // position the counter at bottom-right inside the input area
                '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  transform: 'translate(-2px, -2px)',
                  fontSize: '0.7rem',
                  color: '#999',
                  pointerEvents: 'none'
                }
              }}
            />
            <Divider />

            {/* Email */}
            <TextField
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.userId')}
              fullWidth
              slotProps={{ input: inputSlots(<EnvelopeSimple size={22} style={iconStyle} />, email, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !email}
              helperText={showFieldErrors && !email ? t('signup.required') : ''}
            />
            <Divider />

            {/* Verification Request URL Prefix */}
            <TextField
              name="verificationRequestURLPrefix"
              type="url"
              value={verificationRequestURLPrefix}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.verificationRequestURLPrefix')}
              fullWidth
              slotProps={{ input: inputSlots(<Globe size={22} style={iconStyle} />, verificationRequestURLPrefix, MAX_SHORT) }}
              inputProps={{ maxLength: MAX_SHORT }}
              error={showFieldErrors && !verificationRequestURLPrefix}
              helperText={showFieldErrors && !verificationRequestURLPrefix ? t('signup.required') : ''}
            />
            <Divider />

            {/* Password */}
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
                  endAdornment: (
                    showNearMax(password, 20) ? <span style={{ color: '#999', fontSize: '0.7rem' }}>{`${password.length}/20`}</span> : null
                  ),
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                }
              }}
              inputProps={{ maxLength: 20, minLength: 8 }}
              error={(showFieldErrors && !password) || passwordLengthInvalid}
              helperText={passwordLengthInvalid ? t('signup.passwordLength') : (showFieldErrors && !password ? t('signup.required') : '')}
            />
            <Divider />

            {/* Confirm Password */}
            <TextField
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleChange}
              variant="standard"
              label={false}
              placeholder={t('signup.confirmPassword')}
              fullWidth
              error={(showFieldErrors && !confirmPassword) || passwordsMismatch}
              helperText={passwordsMismatch ? t('signup.passwordMismatch') : (showFieldErrors && !confirmPassword ? t('signup.required') : '')}
              slotProps={{
                input: {
                  startAdornment: <LockOpenIcon size={22} style={{ color: "#777", marginRight: "0.5rem", transform: "translateY(-2px)" }} />,
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {showNearMax(confirmPassword, 20) && (
                        <span style={{ color: '#999', fontSize: '0.7rem' }}>{`${confirmPassword.length}/20`}</span>
                      )}
                      <IconButton type="submit" disabled={isLoading} sx={{ '&.Mui-disabled': { pointerEvents: 'all', cursor: 'not-allowed' } }}>
                        <ArrowCircleRightIcon
                          size={22}
                          style={{ color: "#888", transform: "translateY(-2px)" }} />
                      </IconButton>
                    </Box>
                  ),
                }
              }}
              inputProps={{ maxLength: 20 }}
            />
          </Box>
        </form>
        <Box sx={{ width: "100%", marginTop: ".5em", display: "flex", justifyContent: "center" }}>
          <Typography variant="body2" style={{ color: "#A1A1A1" }}>
            {t('signup.haveAccount')}
            {' '}
            <Link className="appLink" href="/login">{t('signup.login')}</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Signup;
