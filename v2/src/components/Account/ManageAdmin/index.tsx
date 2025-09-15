"use client"

import React, { useEffect, useState } from "react";

import { Grid, Typography, Box, Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ManageAdminProfilePicUpload from "./manageProfileAdmin";
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import { setAdminDetails } from "@/store/reducers/authReducer";
import { useGetAdminDetails, useUpdateAdminDetails, useResetPassword } from "@/custom-hooks/manageAdmin";
import { LocalStorageService } from "@/utils/localStorageService";
import '../style.scss'
import { setMessage } from "@/store/reducers/authReducer";

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
  padding: "15px 30px",
  height: "100%",
  borderRadius: 2,
  border: "1px solid #CECECE",
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
  // Get admin data from Redux store (for backward compatibility)
  const adminData = useAppSelector(
    (state) => state?.auth?.adminDetails
  );
  
  // React Query hooks
  const { data: adminQueryData } = useGetAdminDetails();
  const updateAdminMutation = useUpdateAdminDetails();
  const resetPasswordMutation = useResetPassword();
  const dispatch = useAppDispatch();
  
  // Use admin data from either Redux or React Query
  const currentAdminData = adminQueryData || adminData;
  
  const [editMode, setEditMode] = useState(false);
  const [logoImageBase64, setLogoImageBase64] = useState<any>(null);
  const [adminName, setAdminName] = useState(currentAdminData?.name);
  const [emailName, setEmailName] = useState('admin@igrant.io');
  const [passwordValue, setPasswordValue] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { currentPassword, newPassword, confirmPassword } = passwordValue
  const [formDataForImageUpload, setFormDataForImageUpload] = useState<any>();
  const [previewImage, setPreviewImage] = useState<any>();
  const t = useTranslations();

  useEffect(() => {
    if (currentAdminData?.name) {
      setAdminName(currentAdminData.name);
    }
    setEditMode(false);
  }, [currentAdminData]);

  // Seed the avatar preview with the current user's avatar URL when data loads
  useEffect(() => {
    if (currentAdminData?.avatarImageUrl) {
      setLogoImageBase64(currentAdminData.avatarImageUrl as any);
    }
  }, [currentAdminData?.avatarImageUrl]);

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    setEditMode(!editMode);
    setFormDataForImageUpload("");
    setPreviewImage("");
  };

  const onClickSave = async () => {
    // clear any prior local error (now using global snackbar)
    const payload = {
      name: adminName ? adminName : currentAdminData.name,
    };

    try {
      // Update admin details (avatar uploads immediately on crop)
      const updatedUser = await updateAdminMutation.mutateAsync(payload as any);

      // 3) Immediately sync Redux and LocalStorage so navbar text updates
      if (updatedUser) {
        try {
          dispatch(setAdminDetails(updatedUser));
          LocalStorageService.updateUser(updatedUser);
        } catch (_) {
          // non-fatal
        }
      }

      setEditMode(false);
      // Success toasts suppressed globally; do not open snackbar on success
      setFormDataForImageUpload("");
      // keep preview so user sees updated image; it will be replaced once query refetches
    } catch (e: any) {
      const errorMessage = e instanceof Error ? e.message : t("manageAdmin.error");
      dispatch(setMessage(errorMessage));
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValue({
      ...passwordValue,
      [name]: value
    })
  }

  const onClickRestPassWord = () => {
    // clear any prior local error (now using global snackbar)
    
    if (newPassword !== confirmPassword) {
      dispatch(setMessage(t("manageAdmin.samePassword")));
      return;
    } 
    
    if (
      currentPassword.length > 7 &&
      newPassword.length > 7 &&
      confirmPassword.length > 7 &&
      newPassword === confirmPassword
    ) {
      const payload = {
        "old_password": currentPassword,
        "new_password1": newPassword,
        "new_password2": confirmPassword
      };
      
      resetPasswordMutation.mutate(payload, {
        onSuccess: () => {
          setPasswordValue({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          // Success toasts suppressed globally; do not open snackbar on success
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : t("manageAdmin.error");
          dispatch(setMessage(errorMessage));
        }
      });
    }
  };

  return (
    <Container className="pageContainer manageAdmin-container">
      <HeaderContainer>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
          {t("manageAdmin.adminUser")}
        </Typography>
      </HeaderContainer>
      <DetailsContainer sx={{ flexGrow: 1 }}>
        <Typography variant="body2" mt={1.25} mb={1.5} sx={{ fontSize: '14px' }}>
          {t("manageAdmin.pageDescription")}
        </Typography>
        <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
          <Grid size={{lg: 7, md:6, sm:12, xs:12}} sx={{ display: 'flex' }}>
            <Item sx={{ height: '100%', flex: 1, minHeight: { sm: 215 } }}>
              <Typography
                color="black"
                variant="subtitle1"
                fontWeight="bold"
                mb={1}
              >
                {t("manageAdmin.userSettings")}
              </Typography>
              <Grid container spacing={2}>
                <Grid
                  size={{lg: 3, md: 4, sm: 12, xs: 12}}
                  sx={{ height: "auto", paddingBottom: "1rem" }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      // height: "100%",
                      display: "flex",
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
                  size={{lg: 9, md: 8, sm: 12, xs: 12}}
                  sx={{ display: "grid", alignContent: "center" }}
                >
                  <Grid container>
                    <Grid size={{lg: 2, md: 5, sm: 5, xs: 5}}>
                      <Typography variant="body2">
                        {t("common.name")}:
                      </Typography>
                    </Grid>
                    <Grid size={{lg: 9, md: 7, sm: 7, xs: 7}}>
                      {editMode ? (
                        <TextField
                          variant="standard"
                          autoComplete="off"
                          placeholder={t("common.name")}
                          sx={{ marginTop: -0.5 }}
                          style={{
                            ...editStyleEnable,
                          }}
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          InputProps={{
                            disableUnderline: true,
                            style: { fontSize: 14 },
                          }}
                          fullWidth
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ wordWrap: "break-word", overflowWrap: 'anywhere' }}
                        >
                          {currentAdminData?.name}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid size={{lg: 2, md: 5, sm: 5, xs: 5}}>
                      <Typography variant="body2">
                        {t("manageAdmin.email")}:
                      </Typography>
                    </Grid>
                    <Grid size={{lg: 9, md: 7, sm: 7, xs: 7}}>
                        <Typography
                        variant="body2"
                        sx={{ wordWrap: "break-word", overflowWrap: 'anywhere' }}
                      >
                        {currentAdminData?.email}
                      </Typography>
                      {/* )} */}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid size={{lg: 2, md: 5, sm: 5, xs: 5}}>
                      <Typography variant="body2">
                        {t("login.userId")}:
                      </Typography>
                    </Grid>
                    <Grid size={{lg: 9, md: 7, sm: 7, xs: 7}}>
                      <Typography
                        variant="body2"
                        sx={{ wordWrap: "break-word", overflowWrap: 'anywhere' }}
                      >
                       {currentAdminData?.id}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {editMode ? (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      flexWrap: 'wrap', 
                      gap: 1,
                    }}
                  >
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
                      onClick={onClickSave}
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
                      marginTop: "20px",
                      marginRight: "0.7rem",
                      marginBottom: "0.1rem"
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
          <Grid size={{lg: 5, md:6, sm:12, xs:12}} sx={{ display: 'flex' }}>
            <Item sx={{ display: "grid", alignContent: "space-between", height: '100%', flex: 1, minHeight: { sm: 215 } }}>
              <Typography color="black" variant="subtitle1" fontWeight="bold">
                {t("manageAdmin.userCredentials")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: { xs: "flex-start", sm: "space-between" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.25, sm: 0 },
                  width: "100%",
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <Typography variant="body2">
                  {t("manageAdmin.currentPassword")}:
                </Typography>
                <TextField
                className="manageAdmin-txt"
                  variant="standard"
                  inputProps={{
                    autoComplete: "new-password",
                  }}
                  placeholder={t("manageAdmin.enterCurrentPassword")}
                  type="password"
                  value={currentPassword}
                  name={'currentPassword'}
                  onChange={onChangePassword}
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: { xs: "flex-start", sm: "space-between" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.25, sm: 0 },
                  width: "100%",
                  mb: { xs: 2, sm: 0 },
                }}
              >
                <Typography variant="body2">
                  {t("manageAdmin.newPassword")}:
                </Typography>
                <TextField
                  className="manageAdmin-txt"
                  variant="standard"
                  placeholder={t("manageAdmin.enterNewPassword")}
                  type="password"
                  value={newPassword}
                  name="newPassword"
                  onChange={onChangePassword}
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "stretch", sm: "center" },
                  justifyContent: { xs: "flex-start", sm: "space-between" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1.25, sm: 0 },
                  width: "100%",
                }}
              >
                <Typography variant="body2">{t("manageAdmin.confirmNewPassword")}:</Typography>
                <TextField
                  className="manageAdmin-txt"
                  variant="standard"
                  placeholder={t("manageAdmin.confirmNewPassword")}
                  type="password"
                  value={confirmPassword}
                  name='confirmPassword'
                  onChange={onChangePassword}
                  fullWidth
                />
              </Box>

              <Box sx={{ height: "30px", marginRight: "20px" }}>
                <Typography
                  onClick={onClickRestPassWord}
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
