"use client"
import * as React from "react";
import { useState, useEffect } from "react";
import { Drawer, Typography, Button, Box, Select, MenuItem, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslations } from "next-intl";
import SnackbarComponent from "@/components/notification";
import { useUpdateDDAStatus } from "@/custom-hooks/dataDisclosureAgreements";

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
  const [status, setStatus] = useState<string>("");
  const t = useTranslations();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const { mutate: updateStatus, isPending } = useUpdateDDAStatus();

  useEffect(() => {
    if (selectedData?.status) {
      setStatus(selectedData.status);
    } else {
      setStatus("");
    }
  }, [selectedData]);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setStatus(event.target.value as string);
  };

  const getNextStatus = (currentStatus: string = "") => {
    if (currentStatus === "listed") {
      return "unlisted";
    } else if (currentStatus === "unlisted") {
      return "awaitingForApproval";
    } else if (currentStatus === "approved") {
      return "listed";
    } else if (currentStatus === "rejected") {
      return "awaitingForApproval";
    }
    return "";
  }

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

  return (
    <React.Fragment>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
          <Box className="dd-modal-header">
            <SnackbarComponent
              open={openSnackBar}
              setOpen={setOpenSnackBar}
              message={error}
              topStyle={100}
            />
            <Box pl={2} style={{ width: "90%" }}>
              <Typography className="dd-modal-header-text ">
                {headerText}: {selectedData?.purpose || 'N/A'}
              </Typography>
              <Typography color="#F3F3F6">
                {selectedData?.templateId || 'N/A'}
              </Typography>
            </Box>
            <CloseIcon
              onClick={() => {
                setOpen(false);
                if (selectedData?.status) {
                  setStatus(selectedData.status);
                } else {
                  setStatus("");
                }
              }}
              sx={{ paddingRight: 2, cursor: "pointer", color: "#F3F3F6" }}
            />
          </Box>
          <Box>
            <Box
              p={1.5}
              sx={{
                fontSize: "1rem",
                lineHeight: "1.5",
                letterSpacing: "0.00938em",
              }}
            >
              <Typography variant="subtitle1">
                Status Action:
                <span style={{ color: "rgba(224, 7, 7, 0.986)" }}>*</span>
              </Typography>
              {selectedData ? (
                <Select
                  value={getNextStatus(status)}
                  onChange={(e) => handleChange(e as any)}
                  fullWidth
                  variant="outlined"
                  sx={{ marginTop: "5px" }}
                  size="small"
                  defaultValue={selectedData.status ? getNextStatus(selectedData.status) : ""}
                >
                  <MenuItem disabled value="">
                    <em>Select status action ...</em>
                  </MenuItem>
                  {selectedData.status === "listed" && (
                    <MenuItem value="unlisted">Unlist</MenuItem>
                  )}
                  {selectedData.status === "unlisted" && (
                    <MenuItem value="awaitingForApproval">Request Review</MenuItem>
                  )}
                  {selectedData.status === "approved" && (
                    <MenuItem value="listed">List</MenuItem>
                  )}
                  {selectedData.status === "rejected" && (
                    <MenuItem value="awaitingForApproval">Request Review</MenuItem>
                  )}
                </Select>
              ) : (
                <Typography color="error">No data selected</Typography>
              )}
            </Box>
          </Box>
          <Box className="modal-footer">
            <Button
              onClick={handleClose}
              className="delete-btn"
              sx={{
                marginRight: "10px",
                color: "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
              variant="outlined"
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!status || isPending}
              className="confirm-btn"
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
