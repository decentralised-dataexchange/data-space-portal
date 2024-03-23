import React, { useContext, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Tooltip,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { WidthWideTwoTone } from "@mui/icons-material";
import { VisibilityOffOutlined, ContentCopyOutlined } from '@mui/icons-material';

const Container = styled("div")(({ theme }) => ({
  margin: "0 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "52px 0 10px 0",
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
  const [apiKeyValue, setApiKeyValue] = useState<any>();
  const { t } = useTranslation("translation");

  // const refresh = useRefresh();
  const onRefetch = () => {
    refresh();
  };

  const handleCopy = () => {
    if (showAPI) {
      navigator.clipboard.writeText(apiKeyValue);
    }
  };

  // const DeleteButtonField = (props: any) => {
  //   const record = useRecordContext(props);
  //   if (!record || !props.source) {
  //     return null;
  //   }
  //   return (
  //     record[props.source] && (
  //       <Box
  //         onClick={() => {
  //           setOpenDeleteApiKey(true);
  //           setDeveloperApiDeleteID(record.id);
  //         }}
  //         sx={{
  //           cursor: "pointer",
  //         }}
  //       >
  //         <DeleteOutlineOutlinedIcon color="disabled" />
  //       </Box>
  //     )
  //   );
  // };

  const ExpiryField = (props: any) => {
    // const record = useRecordContext(props);
    if (!record || !props.source) {
      return null;
    }
    return (
      record[props.source] && (
        <Typography variant="body2">
          {/* {formatISODateToLocalString(record[props.source])} */}
        </Typography>
      )
    );
  };

  const ScopeField = (props: any) => {
    // const record = useRecordContext(props);
    if (!record || !props.source) {
      return null;
    }
    let scopes = record[props.source];
    return (
      <Box style={{ display: "flex" }}>
        {scopes.map((scope: any, i: number) => {
          if (i + 1 === scopes.length) {
            return (
              <Typography variant="body2">
                {/* {capitalizeFirstLetter(scope)}{" "} */}
              </Typography>
            );
          } else {
            return (
              <Typography variant="body2" style={{ marginRight: 7 }}>
                {/* {capitalizeFirstLetter(scope)},{" "} */}
              </Typography>
            );
          }
        })}
      </Box>
    );
  };

  return (
    <Container>
      <Snackbar
        open={showAPI}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        style={{ top: 100 }}
      >
        <Alert
          icon={<></>}
          sx={{
            width: "100%",
            background: "#E5E4E4",
            color: "black",
            display: "flex",
            alignItems: "center",
          }}
          onClose={() => setShowAPI(false)}
          action={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                color="inherit"
                size="small"
                style={{ fontWeight: "bold" }}
                onClick={handleCopy}
              >
                {t("developerAPIs.copy")}
              </Button>
              <Button
                color="inherit"
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => setShowAPI(false)}
              >
                <CloseIcon />
              </Button>
            </Box>
          }
        >
          {t("developerAPIs.apiKeyCopyMessage")}
        </Alert>
      </Snackbar>

      <HeaderContainer>
        <Typography variant="h6" fontWeight="bold">
          {t("developerAPIs.headerText")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer sx={{ flexGrow: 1 }}>
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
              652657969380f35fa1c30245
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
                652657969380f35fa1c30243
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
              https://staging-consent-bb-api.igrant.io/v2
              </Typography>
            </Item>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Item>
            <Typography
                  color="black"
                  variant="subtitle1"
                  fontWeight="bold"
                  mb={0.5}
                >
                  {t("developerAPIs.apiKey")}
                </Typography>
                <Grid container>
                  <Grid lg={11} md={12} sm={12} xs={12}>
                    <Typography color="grey" variant="body2">
                    eyjdfhdjdsjnfdsjhfdfmnbsdmnfbnf87jfdy7fdn652657969380f35fa1c3024587647564754856jhgjhdgjghgdhjfghsagfehfvbdnsafndffvdsnbfvsdfnbdvsfghdsvfbdsvfbsdvfghsdvfnbsdfv
                    eyjdfhdjdsjnfdsjhfdfmnbsdmnfbnf87jfdy7fdn652657969380f35fa1c3024587647564754856jhgjhdgjghgdhjfghsagfehfvbdnsafndffvdsnbfvsdfnbdvsfghdsvfbdsvfbsdvfghsdvfnbsdfv
                    eyjdfhdjdsjnfdsjhfdfmnbsdmnfbnf87jfdy7fdn652657969380f35fa1c3024587647564754856jhgjhdgjghgdhjfghsagfehfvbdns
                    </Typography>
                      
                  </Grid>
                    <Grid lg={1} md={12} sm={12} xs={12}>
                    <Box className="actionBtnContainer pointer d-flex-evenly" sx={{ cursor: "pointer" }}>
                        <VisibilityOffOutlined sx={{ color: 'black', fontSize: '1.25rem' }} />
                        <ContentCopyOutlined sx={{ color: 'black', fontSize: '1.25rem' }} />
                  </Box>
                  </Grid>
                  </Grid>
              </Item>
          </Grid>
        </Grid>
      </DetailsContainer>
    </Container>
  );
};

export default DeveloperAPIs;
