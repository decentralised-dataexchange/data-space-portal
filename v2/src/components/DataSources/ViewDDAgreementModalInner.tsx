"use client";
import "./style.scss";
import React from "react";

import { Drawer, Typography, Box, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslations } from "next-intl";
import { DataAttributeCardForDDA } from "./dataAttributeCardForDDA";
import { DDAPolicyCard } from "./dataPolicyCard";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: string;
  selectedData: any;
  dataSourceName: any;
  dataSourceLocation: any;
  dataSourceDescription: any;
  coverImage: any;
  logoImage: any;
}

export default function ViewDataAgreementModalInner(props: Props) {
  const { open, setOpen, mode, selectedData, dataSourceName, dataSourceLocation, dataSourceDescription, coverImage, logoImage } = props;
  const t = useTranslations();

  return (
    <>
      <Drawer anchor="right" open={open} className='drawer-dda'>
        <Box className="dd-modal-container">
          <form>
            <Box className="dd-modal-header">
              <Box pl={2} style={{ width: "90%" }}>
                <Typography className="dd-modal-header-text ">
                  {selectedData?.purpose}
                </Typography>
                {mode !== "Create" && (
                  <Typography color="#F3F3F6">
                    {selectedData?.templateId}
                  </Typography>
                )}
              </Box>
              <CloseIcon
                fontSize="large"
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
                style={{
                  height: "150px",
                  width: "100%",
                  backgroundImage: coverImage ? `url(${coverImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: coverImage ? 'transparent' : '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '14px'
                }}
                component="div"
              >
                {!coverImage && 'No banner image available'}
              </Box>
            </Box>
            <Box sx={{ marginBottom: "60px" }}>
              <Avatar
                src={logoImage}
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

            <Box className="dd-modal-details" style={{ paddingBottom: "80px" }}>
              <Box p={1.5}>
                <Typography variant="h6" fontWeight="bold">
                  {dataSourceName}
                </Typography>
                <Typography color="#9F9F9F">
                  {dataSourceLocation}
                </Typography>
                <Typography variant="subtitle1" mt={3}>
                  {"OVERVIEW"}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="#9F9F9F"
                  mt={1}
                  sx={{ wordWrap: "breakWord" }}
                >
                  {dataSourceDescription}
                </Typography>

                <Typography color="black" mt={3} variant="subtitle1">
                  {"DATASET"}
                </Typography>

                <DataAttributeCardForDDA selectedData={selectedData} />

                <DDAPolicyCard
                  selectedData={selectedData}
                  handleCloseViewDDAModal={setOpen}
                />
              </Box>

              <Box className="modal-footer ">
                {mode === "public" && <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedData?.connection?.invitationUrl);
                  }}
                  className="copy-connection-btn"
                  sx={{
                    marginLeft: "15px",
                    marginRight: "auto",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                  }}
                  variant="outlined"
                >
                  {"Copy Connection"}
                </Button>}
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
