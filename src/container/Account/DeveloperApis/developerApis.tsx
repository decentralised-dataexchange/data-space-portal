import {
  ContentCopyOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../style.scss";
import { HttpService } from "../../../service/HttpService";
import SnackbarComponent from "../../../component/notification";

const Container = styled("div")(({ theme }) => ({
  margin: "0 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: "10px",
});

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
});

const Item = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  padding: 10,
  paddingLeft: 20,
  height: "auto",
  borderRadius: 2,
  border: "1px solid #CECECE",
}));

const DeveloperAPIs = () => {
  const [showAPI, setShowAPI] = useState(false);
  const { t } = useTranslation("translation");
  const token = "Bearer " + JSON.parse(localStorage.getItem("Token"));
  const [openApiUrl, setOpenApiUrl] = useState("");
  const [isOk, setIsOk] = useState(false);
  const [userId, setUserId] = useState("");
  const [orgDetails, setOrgDetails] = useState<any>();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
  };

  useEffect(() => {
    HttpService.getAdminDetails().then((res) => {
      setUserId(res.data.id);
    });
  }, []);

  useEffect(() => {
    HttpService.getOrganisationsDetails().then((res) => {
      setOrgDetails(res.data.dataSource);
      setOpenApiUrl(res.data.dataSource.openApiUrl);
    });
  }, []);

  const handleUpdateUrl = (event: any) => {
    setOpenApiUrl(event.target.value);
    event.target.value !== orgDetails?.openApiUrl
      ? setIsOk(true)
      : setIsOk(false);
  };

  const udateOpenApiUrls = () => {
    if (isOk) {
      const payload = {
        dataSource: {
          openApiUrl: openApiUrl,
        },
      };
      HttpService.updateOpenApiUrl(payload)
        .then(() => {
          setOpenSnackBar(true);
          setSuccess("Successfully updated open api specifiaction url");
          setIsOk(false);
        })
        .catch(() => {
          setOpenSnackBar(true);
          setError("Updating open api specification url failed");
        });
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <SnackbarComponent
          open={openSnackBar}
          setOpen={setOpenSnackBar}
          message={error}
          topStyle={100}
          successMessage={success}
        />
        <Typography variant="h6" fontWeight="bold">
          {t("developerAPIs.headerText")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer>
        <Typography variant="body2" mt={1.25} mb={1}>
          {t("developerAPIs.pageDescription")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.organizationID")}
              </Typography>
              <Typography color="grey" variant="body2">
                {orgDetails?.id}
              </Typography>
            </Item>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.yourUserID")}
              </Typography>
              <Typography color="grey" variant="body2">
                {userId}
              </Typography>
            </Item>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={0.5}
              >
                {t("developerAPIs.configuredBaseURL")}
              </Typography>
              <Typography color="grey" variant="body2">
                https://api.nxd.foundation{" "}
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </DetailsContainer>
      <Box className="apiKey">
        <Grid container spacing={1}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              color="black"
              variant="subtitle1"
              fontWeight="bold"
              mb={0.5}
            >
              {t("developerAPIs.apiKey")}
            </Typography>
          </Grid>
          <Grid item lg={11} md={11} sm={12} xs={12}>
            <Typography color="grey" variant="body1" className="description">
              {showAPI
                ? token
                : "************************************************************************************************************************************************************************************"}
            </Typography>
          </Grid>
          <Grid item lg={1} md={1} sm={12} xs={12}>
            <Box
              className="actionBtnContainer pointer d-flex-evenly"
              sx={{ cursor: "pointer" }}
            >
              {showAPI ? (
                <VisibilityOffOutlined
                  onClick={() => setShowAPI(false)}
                  sx={{ color: "black", fontSize: "1.25rem" }}
                />
              ) : (
                <VisibilityOutlined
                  onClick={() => setShowAPI(true)}
                  sx={{ color: "black", fontSize: "1.25rem" }}
                />
              )}

              <ContentCopyOutlined
                onClick={handleCopy}
                sx={{ color: "black", fontSize: "1.25rem" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box className="apiKey">
        <Grid container spacing={1} alignItems={"center"}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              color="black"
              variant="subtitle1"
              fontWeight="bold"
              mb={0.5}
            >
              Configure OpenAPI Specification
            </Typography>
          </Grid>
          <Grid item lg={2} md={2} sm={12} xs={12}>
            <Typography color="grey" variant="body1" className="description">
              OpenAPI Specification URL: 
            </Typography>
          </Grid>
          <Grid item lg={6} md={2} sm={12} xs={12}>
            <TextField
              autoFocus
              variant="outlined"
              fullWidth
              value={openApiUrl}
              onChange={handleUpdateUrl}
              size="small"
              sx={{ marginTop: "5px", borderRadius: '0px' }}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <Button
              variant="outlined"
              onClick={udateOpenApiUrls}
              sx={{
                width: "auto",
                marginRight: "20px",
                cursor: !isOk ? "not-allowed" : "pointer",
                color: !isOk ? "#6D7676" : "black",
                height: "40px",
                border: "1px solid #DFDFDF",
                borderRadius: "0px",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            >
              Upload
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DeveloperAPIs;
