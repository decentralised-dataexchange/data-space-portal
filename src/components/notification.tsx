"use client";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dispatch, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  message?: string;
  topStyle?: number;
};

export default function SnackbarComponent(props: Props) {
  const { open, setOpen, message, topStyle } = props;

  const handleClose = () => {
    setOpen(false);
  };

  // Only display error messages. Success messages are suppressed globally.
  // Compute text to display from error message only. If none, render nothing to avoid flicker.
  const text = message || '';
  if (!open || !text) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      style={{ top: topStyle ? topStyle : 100 }}
    >
      <Alert
        onClose={handleClose}
        severity={"error"}
        sx={{ width: "100%" }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
}
