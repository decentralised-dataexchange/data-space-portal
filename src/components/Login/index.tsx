"use client";

import React, { useState } from "react";
import {
  Box,
  Divider,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import { UserIcon, LockOpenIcon } from "@phosphor-icons/react";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import Logo from "@/assets/img/logo.jpg";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useLogin } from "@/custom-hooks/auth";
import Image from "next/image";
import styles from "./login.module.scss";
import ArrowCircleRightIcon from "@/assets/icon/arrow-circle-right.svg";
import MfaVerify from "./MfaVerify";

interface FormValue {
  email: string;
  password: string;
}

const Login = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [formValue, setFormValue] = useState<FormValue>({
    email: "",
    password: "",
  });
  const { email, password } = formValue;
  const { login, data: loginData } = useLogin();

  // MFA state: when login returns mfa_required, store the session token
  const mfaRequired =
    loginData && "mfa_required" in loginData && loginData.mfa_required === true;
  const sessionToken = mfaRequired ? loginData.session_token : null;

  // Determine if form is valid for enabling submit
  const isFormValid = !!email && !!password;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    sessionStorage.removeItem("isVerify");
    login({ email, password });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleMfaBack = () => {
    // Force a page reload to reset the mutation state and go back to credentials
    window.location.reload();
  };

  return (
    <Box className={styles.loginWrapper}>
      <Box className={styles.loginContainer}>
        <Box className={styles.dFlexCenter}>
          <Link href="/">
            <Image
              className={styles.logoImg}
              src={Logo}
              alt={t("login.logoAlt")}
              priority
            />
          </Link>
        </Box>
        <Box sx={{ mt: 2, mb: 3, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#1d1d1f',
              letterSpacing: '-0.02em',
            }}
          >
            {mfaRequired ? t("mfa.title") : t("common.orgDashboardTitle")}
          </Typography>
        </Box>

        {mfaRequired && sessionToken ? (
          <MfaVerify sessionToken={sessionToken} onBack={handleMfaBack} />
        ) : (
          <>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <Box className={styles.loginAuthInputsContainer}>
                <Box className={styles.textFieldWrapper}>
                  <TextField
                    autoFocus
                    name="email"
                    type="email"
                    className={styles.textField}
                    value={email}
                    onChange={handleChange}
                    variant="standard"
                    label={false}
                    placeholder={t("login.userId")}
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <UserIcon
                            size={16}
                            style={{
                              color: "#999",
                              marginRight: "0.5rem",
                              transform: "translateY(-2px)",
                            }}
                          />
                        ),
                        disableUnderline: true,
                        onKeyPress: handleKeyPress,
                      },
                    }}
                  />
                </Box>
                <Divider />
                <Box className={styles.textFieldWrapper}>
                  <TextField
                    name="password"
                    type="password"
                    value={password}
                    onChange={handleChange}
                    variant="standard"
                    label={false}
                    placeholder={t("login.password")}
                    fullWidth
                    className={styles.textField}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <LockOpenIcon
                            size={16}
                            style={{ color: "#999", marginRight: "0.5rem" }}
                          />
                        ),
                        disableUnderline: true,
                        onKeyPress: handleKeyPress,
                        endAdornment: (
                          <IconButton
                            type="submit"
                            disabled={!isFormValid}
                            sx={{
                              "&.Mui-disabled": {
                                pointerEvents: "all",
                                cursor: "not-allowed",
                              },
                            }}
                          >
                            <Image
                              src={ArrowCircleRightIcon}
                              alt="arrow"
                              width={18}
                              height={18}
                              style={{ opacity: 0.6 }}
                            />
                          </IconButton>
                        ),
                      },
                    }}
                  />
                </Box>
              </Box>
            </form>
            <Box className={styles.rememberForgotRow}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    size="small"
                    sx={{
                      color: "#ccc",
                      "&.Mui-checked": { color: "#1890FF" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '13px', color: '#86868b' }}>
                    {t("login.rememberMe")}
                  </Typography>
                }
              />
              <Link className={styles.forgotLink} href="/forgot-password">
                {t("login.forgotPassword")}
              </Link>
            </Box>
            <Divider sx={{ width: "100%", maxWidth: 340, my: 1.5 }} />
            <Box sx={{ mt: 0.5, textAlign: "center" }}>
              <Link className={`appLink ${styles.registerLink}`} href="/onboarding">
                {t("login.noAccount")} {t("login.createNow")}
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Login;
