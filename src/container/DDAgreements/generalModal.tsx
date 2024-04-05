import * as React from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { HttpService } from "../../service/HttpService";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmText: string;
  headerText: string;
  modalDescriptionText: any;
  onRefetch?: any;
  resourceName: string;
  selectedData?: any;
  confirmButtonText: string;
  refetchTable: boolean;
  setRefetchTable: Dispatch<SetStateAction<boolean>>;
}

export default function GeneralModal(props: Props) {
  const {
    open,
    setOpen,
    confirmText,
    headerText,
    modalDescriptionText,
    // onRefetch,
    // resourceName,
    selectedData,
    confirmButtonText,
    setRefetchTable,
    refetchTable,
  } = props;
  const [isOk, setIsOk] = useState(false);
  const [confirmationTextInput, setConfirmationTextInput] = useState("");
  const { t } = useTranslation("translation");

  const handleCancelConfirmationText = (event: any) => {
    setConfirmationTextInput(event.target.value);
    event.target.value === confirmText ? setIsOk(true) : setIsOk(false);
  };

  const onSubmit = () => {
    if (isOk) {
      HttpService.deleteDDA(selectedData?.templateId).then(() => {
        setConfirmationTextInput("");
        setOpen(false);
        setIsOk(false);
        setRefetchTable(!refetchTable);
      });
    }
  };

  return (
    <React.Fragment>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
          <Box className="dd-modal-header">
            <Box pl={2}>
              <Typography color="#F3F3F6">
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
              {modalDescriptionText}
              <TextField
                autoFocus
                variant="outlined"
                fullWidth
                value={confirmationTextInput}
                onChange={handleCancelConfirmationText}
                size="small"
                sx={{marginTop:"5px"}}
              />
            </Box>
          </Box>
          <Box className="modal-footer">
            <Button
              onClick={() => {
                setOpen(false);
                setIsOk(false);
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
