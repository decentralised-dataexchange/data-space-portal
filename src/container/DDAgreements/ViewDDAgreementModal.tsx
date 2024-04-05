import React, { Dispatch, SetStateAction } from "react";

import { Drawer, Typography, Box, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import { defaultCoverImage, defaultLogoImg } from "../../utils/defalultImages";
import { DataAttributeCardForDDA } from "./dataAttributeCardForDDA";
import { DDAPolicyCard } from "./dataPolicyCard";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: string;

}

export default function ViewDataAgreementModal(props: Props) {
  const { open, setOpen, mode } = props;
  const { t } = useTranslation("translation");
  const selectedData = {
    language: "string",
    version: "1.0.0",
    templateId: "5af1941c-008d-4334-9293-3ed1416ff815",
    dataController: {
      did: "did:sov:GbTFyzXVm998HyxKsGAJzk",
      name: "Nil",
      legalId: "did:sov:GbTFyzXVm998HyxKsGAJzk",
      url: "http://test.com",
      industrySector: "Nil",
    },
    agreementPeriod: 0,
    dataSharingRestrictions: {
      policyUrl: "string",
      jurisdiction: "string",
      industrySector: "string",
      dataRetentionPeriod: 0,
      geographicRestriction: "string",
      storageLocation: "string",
    },
    purpose: "string",
    purposeDescription: "string",
    lawfulBasis: "consent",
    personalData: [
      {
        attributeId: "eae1f76d-8a99-4f22-a65f-27554eb98430",
        attributeName: "name",
        attributeDescription: "string",
      },
    ],
    codeOfConduct: "string",
    connection: {
      invitationUrl:
        "http://igrant-ideapad-5-15itl05.taile165a.ts.net:8080?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiYWVmNmI2Y2EtMGEwYy00NjEzLWE5MGUtOWExODU0ZmZlNjEwIiwgImltYWdlVXJsIjogImh0dHA6Ly90ZXN0LmNvbS93ZWIiLCAic2VydmljZUVuZHBvaW50IjogImh0dHA6Ly9pZ3JhbnQtaWRlYXBhZC01LTE1aXRsMDUudGFpbGUxNjVhLnRzLm5ldDo4MDgwIiwgInJlY2lwaWVudEtleXMiOiBbIjNvOXZVbVBHMVpZeHlhWFNEZ3BtaG9QRTM4RXlxc2dDNFVYR25UYWozVGljIl0sICJsYWJlbCI6ICJOaWwifQ==",
    },
    status: "unlisted",
    revisions: [],
  };

  return (
    <>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
          <form>
            <Box className="dd-modal-header">
              <Box pl={2}>
                <Typography color="#F3F3F6">
                  View Data Disclosure Agreement: User Data for Third Parties
                </Typography>
                {mode !== "Create" && (
                  <Typography color="#F3F3F6">
                    654cf0db9684ed907ce07c5f
                  </Typography>
                )}
              </Box>
              <CloseIcon
                onClick={() => setOpen(false)}
                sx={{
                  paddingRight: 2,
                  cursor: "pointer",
                  color: "#F3F3F6",
                }}
              />
            </Box>
            <Box className="dd-modal-banner-container">
              <Box
                style={{ height: "150px", width: "100%" }}
                component="img"
                alt="Banner"
                src={defaultCoverImage}
              />
            </Box>
            <Box sx={{ marginBottom: "60px" }}>
              <Avatar
                src={defaultLogoImg}
                style={{
                  position: "absolute",
                  marginLeft: 50,
                  marginTop: "-65px",
                  width: "110px",
                  height: "110px",
                  border: "solid white 6px",
                }}
              />
            </Box>

            <Box className="dd-modal-details">
              <Box p={1.5}>
                <Typography variant="h6" fontWeight="bold">
                  {/* {organisationDetails.name} */}
                  Hospital AB
                </Typography>
                <Typography color="#9F9F9F">
                  {/* {organisationDetails.location} */}
                  Stockholm, SE
                </Typography>
                <Typography variant="subtitle1" mt={3}>
                  {t("common.overView")}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="#9F9F9F"
                  mt={1}
                  sx={{ wordWrap: "breakWord" }}
                >
                  {/* {organisationDetails.description} */}
                  For queries about how we are managing your data please contact
                  the Data Protection Officer.
                </Typography>

                <Typography color="grey" mt={3} variant="subtitle1">
                  {/* {selectedData?.data_disclosure_agreement.purpose.toUpperCase()} */}
                  USER DATA FOR THIRD PARTIES
                </Typography>

                <DataAttributeCardForDDA selectedData={selectedData} />

                <DDAPolicyCard
                  selectedData={selectedData}
                  handleCloseViewDDAModal={setOpen}
                />
              </Box>

              <Box className="modal-footer ">
                <Button
                  onClick={() => {
                    setOpen(false);
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
          </form>
        </Box>
      </Drawer>
    </>
  );
}
