"use client";

import * as React from "react";
import { useState } from "react";
import { Drawer, Typography, Button, Box, TextField, CircularProgress } from "@mui/material";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useDeleteDDA } from "@/custom-hooks/dataDisclosureAgreements";
import styles from "./generalModal.module.scss";
// Define the minimal required type for selectedData
interface DDAItem {
  templateId: string;
  purpose?: string; // Made optional to handle cases where it might be undefined
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  confirmText: string;
  headerText: string;
  modalDescriptionText: React.ReactNode;
  resourceName: string;
  selectedData?: DDAItem;
  confirmButtonText: string | React.ReactNode;
  onSuccess?: () => void;
}

export default function GeneralModal({
  open,
  setOpen,
  confirmText,
  headerText,
  modalDescriptionText,
  selectedData,
  confirmButtonText,
  onSuccess,
}: Props): React.ReactElement {
  const [isOk, setIsOk] = useState(false);
  const [confirmationTextInput, setConfirmationTextInput] = useState("");
  const t = useTranslations();
  const ddaT = useTranslations("dataAgreements");
  const { mutate: deleteDDA, isPending } = useDeleteDDA();

  const handleCancelConfirmationText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmationTextInput(value);
    setIsOk(value === confirmText);
  };

  const getPlaceholderText = () => {
    return `Type ${confirmText} to confirm`;
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmationTextInput("");
    setIsOk(false);
  };

  const handleSubmit = () => {
    if (isOk && selectedData?.templateId) {
      deleteDDA(selectedData.templateId, {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      });
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      className={styles['dd-modal']}
    >
      <Box className={styles['dd-modal-container']}>
        <Box className={styles['dd-modal-header']}>
          <Typography sx={{ fontSize: '16px' }}>
            {headerText}{selectedData?.purpose ? `: ${selectedData.purpose}` : ''}
          </Typography>
          <Button onClick={handleClose} className={styles['close-btn']}>
            <XIcon size={24} />
          </Button>
        </Box>
        <Box className={styles['dd-modal-body']}>
          <Box className={styles['dd-modal-description']}>
            {modalDescriptionText}
          </Box>
          <Box className={styles['dd-modal-input']}>
            <TextField
              fullWidth
              value={confirmationTextInput}
              onChange={handleCancelConfirmationText}
              placeholder={getPlaceholderText()}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        <Box className={styles['dd-modal-footer']}>
          <Button
            variant="outlined"
            onClick={handleClose}
            className={styles['cancel-btn']}
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit}
            disabled={!isOk || isPending}
            className={styles['confirm-btn']}
          >
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              confirmButtonText
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
