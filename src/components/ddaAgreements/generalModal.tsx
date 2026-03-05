"use client";

import * as React from "react";
import { useState } from "react";
import { Typography, Button, Box, TextField, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { useDeleteDDA } from "@/custom-hooks/dataDisclosureAgreements";
import RightSidebar from "@/components/common/RightSidebar";

interface DDAItem {
  templateId: string;
  purpose?: string;
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
  const { mutate: deleteDDA, isPending } = useDeleteDDA();

  const handleCancelConfirmationText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmationTextInput(value);
    setIsOk(value === confirmText);
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

  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography noWrap sx={{ fontSize: '16px', color: '#f5f5f7', fontWeight: 600, letterSpacing: '-0.01em' }}>
        {headerText}{selectedData?.purpose ? `: ${selectedData.purpose}` : ''}{selectedData?.templateId ? ` - ${selectedData.templateId}` : ''}
      </Typography>
    </Box>
  );

  const footerContent = (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
      <Button
        variant="outlined"
        onClick={handleClose}
        className="delete-btn"
        disabled={isPending}
        sx={{
          '&.Mui-disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto'
          }
        }}
      >
        {t("common.cancel")}
      </Button>
      <Box sx={{ position: 'relative', display: 'inline-block', cursor: (!isOk || isPending) ? 'not-allowed' : 'auto' }}>
        {(!isOk || isPending) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              cursor: 'not-allowed',
              zIndex: 1,
              pointerEvents: 'auto'
            }}
          />
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit}
          disabled={!isOk || isPending}
          className="delete-btn"
          sx={{
            '&.Mui-disabled': {
              cursor: 'not-allowed',
              pointerEvents: 'auto',
              backgroundColor: '#e8e8ed !important',
              color: '#86868b !important',
              borderColor: '#e8e8ed !important',
            }
          }}
        >
          {confirmButtonText}
        </Button>
      </Box>
    </Box>
  );

  return (
    <RightSidebar
      open={open}
      onClose={handleClose}
      headerContent={headerContent}
      footerContent={footerContent}
      width={580}
      maxWidth={580}
      className="drawer-dda"
    >
      <Box sx={{ pt: 1 }}>
        <Box sx={{ mb: 3, color: '#1d1d1f', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {modalDescriptionText}
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            value={confirmationTextInput}
            onChange={handleCancelConfirmationText}
            placeholder={`Type "${confirmText}" to confirm`}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d2d2d7',
                  transition: 'border-color 0.2s ease',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#86868b',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1d1d1f',
                  borderWidth: '1px',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1d1d1f',
                  padding: '12px 14px',
                },
              },
            }}
          />
        </Box>
      </Box>
    </RightSidebar>
  );
}
