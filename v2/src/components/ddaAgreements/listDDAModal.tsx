"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Drawer, Typography, Button, Box, Select, MenuItem, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import SnackbarComponent from "@/components/notification";
import { useUpdateDDAStatus } from "@/custom-hooks/dataDisclosureAgreements";
import styles from "./listDDAModal.module.scss";
import { getStatus } from "@/utils/dda";

interface DDAItem {
  id: string;
  templateId: string;
  status?: string;
  purpose?: string;
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  headerText: string;
  resourceName: string;
  selectedData: DDAItem | null;
  confirmButtonText: string;
  onSuccess?: () => void;
}

export default function ListDDAModal({
  open,
  setOpen,
  headerText,
  selectedData,
  confirmButtonText,
  onSuccess,
}: Props) {
  const t = useTranslations();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const { mutate: updateStatus, isPending } = useUpdateDDAStatus();

  const getOptionValue = () => {
    switch (selectedData?.status) {
      case "listed":
        return "unlisted";
      case "unlisted":
      case "rejected":
        return "awaitingForApproval";
      case "approved":
        return "listed";
      default:
        return "";
    }
  }

  const [status, setStatus] = useState(getOptionValue());

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setStatus(event.target.value as string);
  };

  const handleClose = () => {
    setOpen(false);
    if (selectedData?.status) {
      setStatus(selectedData.status);
    } else {
      setStatus("");
    }
  };

  const handleSubmit = () => {
    if (!status || !selectedData?.id) return;
    
    updateStatus(
      { id: selectedData.id, status },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
        onError: (err: Error) => {
          setError(err.message || "Failed to update status");
          setOpenSnackBar(true);
        },
      }
    );
  };

  const getDefaultAction = () => {
    switch (selectedData?.status) {
      case "listed":
        return t("dataAgreements.actions.unlist");
      case "unlisted":
      case "rejected":
        return t("dataAgreements.actions.requestReview");
      case "approved":
        return t("dataAgreements.actions.list");
      default:
        return "";
    }
  };




  return (
    <React.Fragment>
      <Drawer 
        anchor="right" 
        open={open}
        className={styles['dd-modal']}
      >
        <Box className={styles['dd-modal-container']}>
          <Box className={styles['dd-modal-header']}>
            <SnackbarComponent
              open={openSnackBar}
              setOpen={setOpenSnackBar}
              message={error}
              topStyle={100}
            />
            <Box className={styles['header-content']}>
              <Typography variant="h6" className={styles['header-text']}>
                {headerText}: {selectedData?.purpose || 'N/A'}
              </Typography>
              <Typography className={styles['template-id']}>
                {selectedData?.templateId || 'N/A'}
              </Typography>
            </Box>
            <CloseIcon
              onClick={handleClose}
              className={styles['close-btn']}
            />
          </Box>
          
          <Box className={styles['modal-content']}>
            <Box className={styles['status-section']}>
              <Typography className={styles['status-label']}>
                Status Action:
                <span className={styles['required']}>*</span>
              </Typography>
              {selectedData ? (
                <Box className={styles['select-container']}>
                  <Select
                     value={getOptionValue()}
                     onChange={(e) => handleChange(e as any)}
                     fullWidth
                     variant="outlined"
                     sx={{ marginTop: "5px" }}
                     size="small"
                     defaultValue={getOptionValue()}
                  >
                    <MenuItem disabled value="">
                      <em>Select status action ...</em>
                    </MenuItem>
                    <MenuItem value={getOptionValue()}>
                      {getDefaultAction()}
                    </MenuItem>
                  </Select>
                </Box>
              ) : (
                <Typography color="error">No data selected</Typography>
              )}
            </Box>
          </Box>
          
          <Box className={styles['modal-footer']}>
            <Button
              variant="outlined"
              onClick={handleClose}
              className={styles['cancel-btn']}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!status || isPending}
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
    </React.Fragment>
  );
}
