"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Drawer, Typography, Button, Box, CircularProgress } from "@mui/material";
import { CustomSelect } from "@/components/common";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useUpdateDDAStatus } from "@/custom-hooks/dataDisclosureAgreements";
import styles from "./listDDAModal.module.scss";
import { getStatus } from "@/utils/dda";
import { useAppDispatch } from "@/custom-hooks/store";
import { setMessage } from "@/store/reducers/authReducer";

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
  const dispatch = useAppDispatch();
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

  const handleChange = (value: string) => {
    setStatus(value);
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
          dispatch(setMessage(err.message || "Failed to update status"));
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
            <Box className={styles['header-content']}>
              <Typography variant="h6" className={styles['header-text']}>
                {headerText}: {selectedData?.purpose || 'N/A'}
              </Typography>
              <Typography className={styles['template-id']}>
                {selectedData?.templateId || 'N/A'}
              </Typography>
            </Box>
            <XIcon
              size={24}
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
                  <CustomSelect
                    value={getOptionValue()}
                    onChange={handleChange}
                    options={[
                      { value: getOptionValue(), label: getDefaultAction() }
                    ]}
                    sx={{ marginTop: "5px" }}
                    size="small"
                    fullWidth
                    MenuProps={{
                      disablePortal: false,
                      style: { zIndex: 1500 },
                      MenuListProps: {
                        style: { zIndex: 1500 }
                      }
                    }}
                  />
                </Box>
              ) : (
                <Typography color="error">{t("common.noDataSelected")}</Typography>
              )}
            </Box>
          </Box>
          
          <Box className={styles['modal-footer']}>
            <Button
              variant="outlined"
              onClick={handleClose}
              className={styles['cancel-btn']}
              disabled={isPending}
              sx={{
                borderRadius: "0px"
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={!status || isPending}
              className={styles['confirm-btn']}
              sx={{
                borderRadius: "0px"
              }}
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
