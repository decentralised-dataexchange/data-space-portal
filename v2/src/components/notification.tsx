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
  successMessage?: string;
};

export default function SnackbarComponent(props: Props) {
  const { open, setOpen, message, topStyle, successMessage } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      style={{ top: topStyle ? topStyle : 100 }}
    >
      <Alert
        onClose={handleClose}
        severity={successMessage ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {successMessage ? successMessage : message}
      </Alert>
    </Snackbar>
  );
}
