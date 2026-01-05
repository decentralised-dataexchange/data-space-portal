"use client"
import * as React from "react";
import { useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { CustomSelect } from "@/components/common";
import { useTranslations } from "next-intl";
import { useUpdateDDAStatus } from "@/custom-hooks/dataDisclosureAgreements";
import { getStatus } from "@/utils/dda";
import { useAppDispatch } from "@/custom-hooks/store";
import { setMessage } from "@/store/reducers/authReducer";
import RightSidebar from "@/components/common/RightSidebar";

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

  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
        {headerText}: {selectedData?.purpose || 'N/A'}
      </Typography>
      <Typography sx={{ fontSize: '12px', color: '#F3F3F6', opacity: 0.8, mt: 0.5 }}>
        {selectedData?.templateId || 'N/A'}
      </Typography>
    </Box>
  );

  const footerContent = (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
      <Button
        variant="outlined"
        onClick={handleClose}
        disabled={isPending}
        className="delete-btn"
      >
        {t("common.cancel")}
      </Button>
      <Button
        variant="outlined"
        onClick={handleSubmit}
        disabled={!status || isPending}
        className="delete-btn"
      >
        {isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          confirmButtonText
        )}
      </Button>
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
        <Typography sx={{ fontSize: '1rem', mb: 1 }}>
          Status Action:<span style={{ color: '#e00707fc', marginLeft: '4px' }}>*</span>
        </Typography>
        {selectedData ? (
          <Box sx={{ mt: 1 }}>
            <CustomSelect
              value={getOptionValue()}
              onChange={handleChange}
              options={[
                { value: getOptionValue(), label: getDefaultAction() }
              ]}
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
    </RightSidebar>
  );
}
