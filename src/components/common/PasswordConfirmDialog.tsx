"use client";

import * as React from "react";
import { useState } from "react";
import { Drawer, Typography, Button, Box, TextField } from "@mui/material";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import styles from "@/components/ddaAgreements/generalModal.module.scss";

interface PasswordConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isPending?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
}

export default function PasswordConfirmDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  error,
  title,
  description,
}: PasswordConfirmDialogProps): React.ReactElement {
  const t = useTranslations("common");
  const [password, setPassword] = useState("");

  React.useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    setPassword("");
  };

  const handleSubmit = () => {
    if (!password || isPending) return;
    onConfirm(password);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} className={styles["dd-modal"]}>
      <Box className={styles["dd-modal-container"]}>
        <Box className={styles["dd-modal-header"]}>
          <Typography sx={{ fontSize: "16px", display: "flex", alignItems: "center", gap: 1 }}>
            {title || t("passwordConfirm.title")}
          </Typography>
          <Button onClick={handleClose} className={styles["close-btn"]}>
            <XIcon size={24} />
          </Button>
        </Box>
        <Box className={styles["dd-modal-body"]}>
          <Box className={styles["dd-modal-description"]}>
            <Typography variant="body1">
              {description || t("passwordConfirm.description")}
            </Typography>
          </Box>
          <Box className={styles["dd-modal-input"]}>
            <TextField
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordConfirm.placeholder")}
              variant="outlined"
              size="small"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              InputProps={{ disableUnderline: false }}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
              }}
            />
            {error && (
              <Typography variant="body2" sx={{ color: "error.main", mt: 1 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
        <Box className={styles["dd-modal-footer"]}>
          <Button
            variant="outlined"
            onClick={handleClose}
            className={styles["cancel-btn"]}
            disabled={!!isPending}
            sx={{
              "&.Mui-disabled": { cursor: "not-allowed", pointerEvents: "auto" },
            }}
          >
            {t("cancel")}
          </Button>
          <Box sx={{ position: "relative", display: "inline-block", cursor: !password || isPending ? "not-allowed" : "auto" }}>
            {!password || isPending ? (
              <Box sx={{ position: "absolute", inset: 0, cursor: "not-allowed", zIndex: 1, pointerEvents: "auto" }} />
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={!password || !!isPending}
              className={styles["confirm-btn"]}
              sx={{
                "&.Mui-disabled": { cursor: "not-allowed", pointerEvents: "auto" },
              }}
            >
              {t("passwordConfirm.confirm")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
