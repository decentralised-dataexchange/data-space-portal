import React, { useEffect, useState } from "react";

import { Grid, Typography, Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ManageAdminProfilePicUpload from "../../component/manageProfileAdmin";
import SnackbarComponent from "../../component/notification";
import { useTranslation } from "react-i18next";

const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
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
  paddingLeft: 30,
  height: "215px",
  borderRadius: 2,
  border: "1px solid #CECECE",
  [theme.breakpoints.down("md")]: {
    height: "auto",
  },
}));

const buttonStyle = {
  height: 30,
  width: 100,
  borderRadius: 0,
  border: "1px solid #DFDFDF",
};

const editStyleEnable: React.CSSProperties = {
  borderWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#DFE0E1",
  height: 23,
};

const ManageAdmin = () => {
  const [editMode, setEditMode] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any>();
  const [logoImageBase64, setLogoImageBase64] = useState<any>(null);
  const [adminName, setAdminName] = useState(adminDetails?.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formDataForImageUpload, setFormDataForImageUpload] = useState<any>();
  const [previewImage, setPreviewImage] = useState<any>();
  const { t } = useTranslation("translation");

  useEffect(() => {
    if (adminDetails?.name) {
      setAdminName(adminDetails.name);
    }
  }, [adminDetails]);

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setEditMode(!editMode);
    setFormDataForImageUpload("");
    setPreviewImage("");
  };

  return (
    <Container>
      <SnackbarComponent
        open={openSnackBar}
        setOpen={setOpenSnackBar}
        message={error}
        topStyle={100}
        successMessage={success}
      />
      <HeaderContainer>
        <Typography variant="h6" fontWeight="bold">
          {t("manageAdmin.adminUser")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer sx={{ flexGrow: 1 }}>
        <Typography variant="body2" mt={1.25} mb={1.5}>
          {t("manageAdmin.pageDescription")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item lg={7} md={6} sm={12} xs={12}>
            <Item>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
              >
                {t("manageAdmin.userSettings")}
              </Typography>
              <Grid container>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{ height: "130px" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: {
                        xs: "center",
                        sm: "center",
                        md: "normal",
                        lg: "center",
                      },
                    }}
                  >
                    <ManageAdminProfilePicUpload
                      editMode={editMode}
                      logoImageBase64={logoImageBase64}
                      setLogoImageBase64={setLogoImageBase64}
                      setFormDataForImageUpload={setFormDataForImageUpload}
                      previewImage={previewImage}
                      setPreviewImage={setPreviewImage}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  lg={9}
                  md={4}
                  sm={12}
                  xs={12}
                  sx={{ display: "grid", alignContent: "center" }}
                >
                  <Grid container height={"20px"}>
                    <Grid item lg={3} md={6} sm={6} xs={6}>
                      <Typography variant="body2">
                        {t("common.name")}:
                      </Typography>
                    </Grid>
                    <Grid item lg={9} md={5} sm={5} xs={5}>
                      {editMode ? (
                        <TextField
                          variant="standard"
                          autoComplete="off"
                          placeholder={t("common.name")}
                          sx={{ marginTop: -0.1 }}
                          style={{
                            ...editStyleEnable,
                          }}
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          InputProps={{
                            disableUnderline: true,
                            style: { fontSize: 14 },
                          }}
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ wordWrap: "break-word" }}
                        >
                          {adminDetails?.name}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container height={"20px"}>
                    <Grid item lg={3} md={6} sm={6} xs={6}>
                      <Typography variant="body2">
                        {t("manageAdmin.email")}:
                      </Typography>
                    </Grid>
                    <Grid item lg={9} md={5} sm={5} xs={5}>
                      <Typography
                        variant="body2"
                        sx={{ wordWrap: "break-word" }}
                      >
                        {adminDetails?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container height={"20px"}>
                    <Grid item lg={3} md={6} sm={6} xs={6}>
                      <Typography variant="body2">
                        {t("login.userid")}:
                      </Typography>
                    </Grid>
                    <Grid item lg={9} md={5} sm={5} xs={5}>
                      <Typography
                        variant="body2"
                        sx={{ wordWrap: "break-word" }}
                      >
                        {adminDetails?.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {editMode ? (
                  <Box style={{ textAlign: "right", width: "100%" }}>
                    <Button
                      onClick={handleEdit}
                      style={buttonStyle}
                      variant="outlined"
                      sx={{
                        color: "black",
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      style={buttonStyle}
                      variant="outlined"
                    //   onClick={onClickSave}
                      sx={{
                        color: "black",
                        "&:hover": {
                          backgroundColor: "black",
                          color: "white",
                        },
                      }}
                    >
                      {t("common.save")}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <Typography
                      onClick={handleEdit}
                      variant="body2"
                      style={{
                        cursor: "pointer",
                        color: "grey",
                      }}
                    >
                      {t("common.edit")}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Item>
          </Grid>
          <Grid item lg={5} md={6} sm={12} xs={12}>
            <Item sx={{ display: "grid", alignContent: "space-between" }}>
              <Typography color="black" variant="subtitle1" fontWeight="bold">
                {t("manageAdmin.userCredentials")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="body2">
                  {t("manageAdmin.currentPassword")}:
                </Typography>
                <TextField
                  variant="standard"
                  inputProps={{
                    autoComplete: "new-password",
                  }}
                  placeholder={t("manageAdmin.enterCurrentPassword")}
                  type="password"
                  sx={{ width: "50%", marginRight: "20px" }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="body2">
                  {t("manageAdmin.newPassword")}:
                </Typography>
                <TextField
                  variant="standard"
                  placeholder={t("manageAdmin.enterNewPassword")}
                  type="password"
                  sx={{ width: "50%", marginRight: "20px" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography variant="body2">{t("manageAdmin.confirmNewPassword")}:</Typography>
                <TextField
                  variant="standard"
                  placeholder={t("manageAdmin.confirmNewPassword")}
                  type="password"
                  sx={{ width: "50%", marginRight: "20px" }}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </Box>

              <Box sx={{ height: "30px", marginRight: "20px" }}>
                <Typography
                //   onClick={onClickRestPassWord}
                  variant="body2"
                  style={{
                    cursor: "pointer",
                    textAlign: "right",
                    color: "grey",
                    width: "100%",
                  }}
                >
                  {t("manageAdmin.changePassword")}
                </Typography>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </DetailsContainer>
    </Container>
  );
};

export default ManageAdmin;
