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
  const { login } = useLogin();

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

  return (
    <Box className={styles.loginWrapper}>
      {/* No local Snackbar; using global Snackbar in AppLayout */}
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
        <Box
          sx={{
            margin: "1rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h1 className="titleTxt">{t("common.orgDashboardTitle")}</h1>
        </Box>
        <form onSubmit={handleSubmit}>
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
                          color: "#777",
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
                        style={{ color: "#777", marginRight: "0.5rem" }}
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
        <Box
          sx={{
            width: "100%",
            marginTop: "1.75em",
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
              <Typography variant="body2">{t("login.rememberMe")}</Typography>
            }
            style={{ color: "#A1A1A1" }}
          />
        </Box>
        <Divider sx={{ width: "310px", my: 0.5 }} />
        <Box
          sx={{
            width: "100%",
            marginTop: ".5em",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link className={`appLink ${styles.registerLink}`} href="/onboarding">
            {t("login.noAccount")} {t("login.createNow")}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
