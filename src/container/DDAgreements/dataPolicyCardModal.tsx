import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import PolicyDetailsBox from "./PolicyDetailBox";
import DataControllerCard from "./dataControllerCard";
import VerfiedDABoxForDDA from "./verifiedDABox";
import IndividualDecentralisedIdentifierBoxForDDA from "./individuaDecentralisedId";

// import VerifiedDABox from "../issuanceHistory/verfiedDABox";
// import IndividualDecentralisedIdentifierBox from "../issuanceHistory/individualDecentralisedIdentifierBox";
// import { getLawfulBasisOfProcessing } from "../../service/adapter";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  headerText: string;
  selectedData: any;
  handleCloseViewDDAModal: any;
}

const titleAttrRestrictionStyle = {
  fontWeight: "normal",
  marginTop: "20px",
  lineHeight: "1.5rem",
  display: "grid",
  alignItems: "center",
  cursor: "pointer",
  border: "1px solid #DFE0E1",
  borderRadius: 5,
  padding: "12px",
};

export default function DataAgreementPolicyCardModal(props: Props) {
  const { t, i18n } = useTranslation("translation");
  const { open, setOpen, headerText, selectedData, handleCloseViewDDAModal } =
    props;

    const SSIpolicyDetailsForContainer = [
      {
        name: "Lawful basis of processing",
        // value: getLawfulBasisOfProcessing(
        //   selectedData.dataAgreement?.lawfulBasis,
        //   i18n.t
        // ),
        value: "Consent",
      },
      {
        name: "Data retention period",
        value: "365",
      },
      {
        name:"Policy URL",
        value: "https://igrant.io/policy.html",
      },
      {
        name: "Jurisdiction",
        value: "Sweden",
      },
      {
        name: "Industry sector",
        value: "Healthcare",
      },

      {
        name: "Geographic restriction",
        value: "Sweden",
      },
      {
        name: "Storage location",
        value: "Sweden",
      },
      {
        name: "Agreement Period",
        value: "",
      },
      {
        name: "Blink",
        value: "",
      },
      {
        name: "did:mydata",
        value: "",
      },
    ];

  return (
    <React.Fragment>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
          <Box className="dd-modal-header">
            <Box pl={2} display={"flex"} alignItems={"center"}>
              <ArrowBackIosIcon
              fontSize="small"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  setOpen(false);
                }}
              />
              <Typography color="#F3F3F6">{headerText}</Typography>
            </Box>
            <CloseIcon
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
              sx={{ paddingRight: 2, cursor: "pointer", color: "#F3F3F6" }}
            />
          </Box>


          <Box className="dd-modal-details" style={{paddingBottom:"70px"}}>
          <Box m={1.5} style={titleAttrRestrictionStyle}>

          <DataControllerCard />
          </Box>
            <Box m={1.5} style={titleAttrRestrictionStyle}>
              {SSIpolicyDetailsForContainer?.map((policyDetail, index) => (
                <PolicyDetailsBox
                  key={index}
                  selectedData={selectedData}
                  isLastAttribute={
                    index === SSIpolicyDetailsForContainer.length - 1
                  }
                  name={policyDetail.name}
                  value={policyDetail.value}
                />
              ))}
            </Box>

            {/* {selectedData.data_disclosure_agreement.proofChain &&
            selectedData.data_disclosure_agreement?.proofChain[0] ? (
              <> */}
                <Box m={1.5} style={titleAttrRestrictionStyle}>
                  <VerfiedDABoxForDDA selectedData={selectedData} />
                </Box>
                <Box m={1.5} style={titleAttrRestrictionStyle}>
                  <IndividualDecentralisedIdentifierBoxForDDA
                    selectedData={selectedData}
                  />
                </Box>
              {/* </>
            ) : (
              <Box m={1.5} style={titleAttrRestrictionStyle}>
                <VerfiedDABoxForDDA selectedData={selectedData} />
              </Box>
            )} */}

        
          </Box>
          <Box className="modal-footer ">
            <Button
              onClick={() => {
                setOpen(false);
                handleCloseViewDDAModal(false);
              }}
            className="delete-btn"
              sx={{
                marginRight: "15px",
                color: "black",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
              variant="outlined"
            >
              {t("common.close")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
