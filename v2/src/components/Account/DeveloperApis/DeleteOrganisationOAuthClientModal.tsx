"use client";

import * as React from "react";
import { useState } from "react";
import { Drawer, Typography, Button, Box, TextField } from "@mui/material";
import { XIcon, CaretLeftIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import styles from "@/components/ddaAgreements/generalModal.module.scss";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function DeleteOrganisationOAuthClientModal({ open, setOpen, onConfirm, isPending }: Props): React.ReactElement {
  const t = useTranslations();
  const dT = useTranslations("developerAPIs");
  const [confirmationTextInput, setConfirmationTextInput] = useState("");
  const confirmText = dT("orgOauth2DeleteModal.confirmText");
  const isOk = confirmationTextInput === confirmText;

  // Clear input when the modal is closed externally or via header close
  React.useEffect(() => {
    if (!open) {
      setConfirmationTextInput("");
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setConfirmationTextInput("");
  };

  const handleSubmit = () => {
    if (!isOk || isPending) return;
    onConfirm();
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} className={styles["dd-modal"]}>
      <Box className={styles["dd-modal-container"]}>
        <Box className={styles["dd-modal-header"]}>
          <Typography sx={{ fontSize: "16px", display: "flex", alignItems: "center", gap: 1 }}>
            <CaretLeftIcon size={18} onClick={handleClose} style={{ cursor: "pointer" }}/>{" "}
            {dT("orgOauth2DeleteModal.title")}
          </Typography>
          <Button onClick={handleClose} className={styles["close-btn"]}>
            <XIcon size={24} />
          </Button>
        </Box>
        <Box className={styles["dd-modal-body"]}>
          <Box className={styles["dd-modal-description"]}>
            <Typography variant="body1">{dT("orgOauth2DeleteModal.description")}</Typography>
          </Box>
          <Box className={styles["dd-modal-input"]}>
            <TextField
              fullWidth
              value={confirmationTextInput}
              onChange={(e) => setConfirmationTextInput(e.target.value)}
              placeholder={`${t("common.typeToConfirm", { text: confirmText })}`}
              variant="outlined"
              size="small"
              InputProps={{ disableUnderline: false }}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
              }}
            />
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
            {t("common.cancel")}
          </Button>
          <Box sx={{ position: "relative", display: "inline-block", cursor: !isOk || isPending ? "not-allowed" : "auto" }}>
            {!isOk || isPending ? (
              <Box sx={{ position: "absolute", inset: 0, cursor: "not-allowed", zIndex: 1, pointerEvents: "auto" }} />
            ) : null}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={!isOk || !!isPending}
              className={styles["confirm-btn"]}
              sx={{
                "&.Mui-disabled": { cursor: "not-allowed", pointerEvents: "auto" },
              }}
            >
              {dT("orgOauth2DeleteModal.confirmButton")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
