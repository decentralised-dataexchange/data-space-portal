import * as React from "react";
import { useState, useEffect } from "react"; // Import useEffect
import { Dispatch, SetStateAction } from "react";

import {
  Drawer,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { HttpService } from "../../service/HttpService";
import SnackbarComponent from "../../component/notification";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  headerText: string;
  onRefetch?: any;
  resourceName: string;
  selectedData?: any;
  confirmButtonText: string;
  refetchTable: boolean;
  setRefetchTable: Dispatch<SetStateAction<boolean>>;
}

export default function ListDDAModal(props: Props) {
  const {
    open,
    setOpen,
    headerText,
    setRefetchTable,
    refetchTable,
    selectedData,
    confirmButtonText,
  } = props;
  const [isOk, setIsOk] = useState(false);
  const [status, setStatus] = useState("");
  const { t } = useTranslation("translation");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedData && selectedData.status) {
      setStatus(selectedData.status);
    }
  }, [selectedData]);

  const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
    setStatus(event.target.value as string);
    event.target.value !== selectedData?.status
      ? setIsOk(true)
      : setIsOk(false);
  };

  const onSubmit = () => {
    if (isOk) {
      const payload = {
        status: status,
      };

      HttpService.updateDDAStatus(selectedData?.templateId, payload)
        .then(() => {
          setOpen(false);
          setIsOk(false);
          setStatus("");
          setRefetchTable(!refetchTable);
        })
        .catch((error) => {
          console.log("error", error.response.data.error);
          setError(error.response.data.error);
          setOpenSnackBar(true);
        });
    }
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
                {headerText}: {selectedData?.purpose}
              </Typography>
              <Typography color="#F3F3F6">
                {selectedData?.templateId}
              </Typography>
            </Box>
            <CloseIcon
              onClick={() => {
                setOpen(false);
                setIsOk(false);
                setStatus(selectedData.status);
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
              <Select
                value={status}
                onChange={(e) => handleChange(e as any)}
                fullWidth
                variant="outlined"
                sx={{ marginTop: "5px" }}
                size="small"
              >
                <MenuItem disabled value="awaitingForApproval">
                  <em>Select status action ...</em>
                </MenuItem>
                {status === "listed" && <MenuItem value="unlisted">Unlist</MenuItem>}
                {status === "unlisted" && <MenuItem value="awaitingForApproval">Request Review</MenuItem>}
                {status === "approved" && <MenuItem value="listed">List</MenuItem>}
                {status === "rejected" && <MenuItem value="awaitingForApproval">Request Review</MenuItem>}
                {/* <span style={{ cursor: "not-allowed" }}>
                  <MenuItem value="approved" disabled>
                    Approved
                  </MenuItem>
                </span>
                <span style={{ cursor: "not-allowed" }}>
                  <MenuItem value="rejected" disabled>
                    Rejected
                  </MenuItem>
                </span> */}
              </Select>
            </Box>
          </Box>
          <Box className="modal-footer">
            <Button
              onClick={() => {
                setOpen(false);
                setIsOk(false);
                setStatus(selectedData.status);
              }}
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
              className="delete-btn"
              onClick={onSubmit}
              variant="outlined"
              sx={{
                marginRight: "20px",
                cursor: !isOk ? "not-allowed" : "pointer",
                color: !isOk ? "#6D7676" : "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              {confirmButtonText}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
