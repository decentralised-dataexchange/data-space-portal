import React, { Dispatch, SetStateAction, useEffect } from "react";

import { Drawer, Typography, Box, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useTranslation } from "react-i18next";
import { defaultCoverImage, defaultLogoImg } from "../../utils/defalultImages";
import { DataAttributeCardForDDA } from "./dataAttributeCardForDDA";
import { DDAPolicyCard } from "./dataPolicyCard";
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { gettingStartAction } from "../../redux/actionCreators/gettingStart";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: string;
  selectedData: any;
}

export default function ViewDataAgreementModal(props: Props) {
  const { open, setOpen, mode, selectedData } = props;
  const { t } = useTranslation("translation");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(gettingStartAction());
  }, []);

  const gettingStartData = useAppSelector(
    (state) => state?.gettingStart?.data?.dataSource
  );

  return (
    <>
      <Drawer anchor="right" open={open}>
        <Box className="dd-modal-container">
          <form>
            <Box className="dd-modal-header">
              <Box pl={2}>
                <Typography color="#F3F3F6">
                  View Data Disclosure Agreement: {selectedData?.purpose}
                </Typography>
                {mode !== "Create" && (
                  <Typography color="#F3F3F6">
                    {selectedData?.templateId}
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

            <Box className="dd-modal-details" style={{ paddingBottom: "80px" }}>
              <Box p={1.5}>
                <Typography variant="h6" fontWeight="bold">
                  {gettingStartData?.name}
                </Typography>
                <Typography color="#9F9F9F">
                  {gettingStartData?.location}
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
                  {gettingStartData?.description}
                </Typography>

                <Typography color="grey" mt={3} variant="subtitle1">
                  {selectedData?.purpose.toUpperCase()}
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
