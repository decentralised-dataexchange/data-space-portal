"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Typography, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMfaVerify, useMfaResend } from "@/custom-hooks/auth";
import Image from "next/image";
import styles from "./login.module.scss";
import ArrowCircleRightIcon from "@/assets/icon/arrow-circle-right.svg";

interface MfaVerifyProps {
  sessionToken: string;
  onBack: () => void;
}

const RESEND_COOLDOWN = 60;

const MfaVerify: React.FC<MfaVerifyProps> = ({ sessionToken, onBack }) => {
  const t = useTranslations();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { verify, isLoading: isVerifying } = useMfaVerify();
  const { resend, isLoading: isResending } = useMfaResend();

  // Start cooldown timer on mount (code was just sent during login)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6 || isVerifying) return;
    verify({ session_token: sessionToken, code });
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    resend({ session_token: sessionToken });
    setCooldown(RESEND_COOLDOWN);
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const isCodeValid = code.length === 6;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
        maxWidth: "356px",
      }}
    >
      <Typography variant="body2" sx={{ color: "#555", textAlign: "center" }}>
        {t("mfa.description")}
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box className={styles.loginAuthInputsContainer}>
          <Box className={styles.textFieldWrapper}>
            <TextField
              autoFocus
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={styles.textField}
              value={code}
              onChange={handleCodeChange}
              variant="standard"
              label={false}
              placeholder={t("mfa.codePlaceholder")}
              fullWidth
              slotProps={{
                input: {
                  disableUnderline: true,
                  onKeyPress: handleKeyPress,
                  sx: { textAlign: "center", letterSpacing: "0.5em", fontWeight: 600 },
                  endAdornment: (
                    <IconButton
                      type="submit"
                      disabled={!isCodeValid || isVerifying}
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.25rem",
          mt: 0.5,
        }}
      >
        <Typography
          variant="body2"
          onClick={handleResend}
          sx={{
            cursor: cooldown > 0 || isResending ? "not-allowed" : "pointer",
            color: cooldown > 0 || isResending ? "#bbb" : "#1890FF",
            fontSize: "14px",
          }}
        >
          {cooldown > 0
            ? `${t("mfa.resend")} (${cooldown}s)`
            : t("mfa.resend")}
        </Typography>

        <Typography
          variant="body2"
          onClick={onBack}
          sx={{
            cursor: "pointer",
            color: "#888",
            fontSize: "14px",
          }}
        >
          {t("mfa.backToLogin")}
        </Typography>
      </Box>
    </Box>
  );
};

export default MfaVerify;
