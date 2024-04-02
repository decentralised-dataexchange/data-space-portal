import * as React from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  confirmText: string;
  headerText: string;
  modalDescriptionText: any;
  onRefetch?: any;
  userAccessId?: string;
  resourceName: string;
  developerApiDeleteID?:string
  selectededDataAgreementFromDataAgreement?: any
  selectedWebhookDetails?: any
  setSelectedDropdownValue?:any
  confirmButtonText: string
}

export default function DeleteModal(props: Props) {
  const {
    open,
    setOpen,
    confirmText,
    headerText,
    modalDescriptionText,
    onRefetch,
    userAccessId,
    resourceName,
    developerApiDeleteID,
    selectededDataAgreementFromDataAgreement,
    selectedWebhookDetails,
    setSelectedDropdownValue,
    confirmButtonText
  } = props;
  const [isOk, setIsOk] = useState(false);
  const [confirmationTextInput, setConfirmationTextInput] = useState("");
  const { t } = useTranslation("translation");

  const handleCancelConfirmationText = (event: any) => {
    setConfirmationTextInput(event.target.value);
    event.target.value === confirmText ? setIsOk(true) : setIsOk(false);
  };

  

  return (
    <React.Fragment>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
            <Box className="dd-modal-header">
              <Box pl={2}>
                <Typography color="#F3F3F6">
                    Delete Data Agreement: User Data for Third Parties
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
              <Box p={1.5}>
                You are about to delete an existing data agreement and ALL its revisions. Please type DELETE to confirm and click DELETE. This action is not reversible.
                <TextField
                  autoFocus
                  variant="outlined"
                  fullWidth
                  value={confirmationTextInput}
                  onChange={handleCancelConfirmationText}
                />
              </Box>
            </Box>
              <Button
                onClick={() => {
                  setOpen(false);
                  setIsOk(false);
                }}
                // style={buttonStyle}
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
                // onClick={onSubmit}
                // style={!isOk ? disabledButtonstyle : buttonStyle}
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
              >{t("common.delete")}
                
              </Button>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
