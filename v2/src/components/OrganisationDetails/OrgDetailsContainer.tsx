"use client"
import React, { useEffect, useState } from "react";
import { useUpdateDataSource } from "@/custom-hooks/gettingStarted";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import OrgLogoImageUpload from "@/components/OrganisationDetails/OrgLogoImageUpload";
import DrawerComponent from "@/components/common/Drawer";
import AddCredentialComponent from "@/components/AddCredential";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './style.scss';
import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/custom-hooks/store";
import { apiService } from "@/lib/apiService/apiService";

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
  backgroundColor: "#FFFFF",
  padding: 10,
});

const editStyleEnable: React.CSSProperties = {
  borderWidth: 1,
  borderBottomStyle: "solid",
  borderBottomColor: "#DFE0E1",
  height: 23,
};

const buttonStyle = {
  height: 30,
  width: 100,
  borderRadius: 0,
  border: "1px solid #DFDFDF",
};

type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  organisationDetails: any;
  handleEdit: () => void;
  setOganisationDetails: (field: string, value: string) => void;
  setLogoImageBase64: (image: string) => void;
  isEnableAddCredential: boolean;
};

const OrganisationDetailsContainer = (props: Props) => {
  const t = useTranslations();
  const [openRightSideDrawer, setOpenRightSideDrawer] = useState(false)
  const {
    editMode,
    organisationDetails,
    handleEdit,
    isEnableAddCredential,
    setOganisationDetails
  } = props;
  const [coverImageBase64, setCoverImageBase64] = useState();
  const [logoImageBase64, setLogoImageBase64] = useState();
  const dispatch = useAppDispatch();
  const [formValue, setFormValue] = useState({
    'name': '',
    'location': '',
    'policyUrl': '',
    'description': '',
    'sector': ''
  })

  useEffect(() => {
    setFormValue({
      'name': organisationDetails?.name || '',
      'location': organisationDetails?.location || '',
      'policyUrl': organisationDetails?.policyUrl || '',
      'description': organisationDetails?.description || '',
      'sector': organisationDetails?.sector || ''
    })
    // Use apiService to get logo image
    apiService.getLogoImage().then((logoImage) => {
      setLogoImageBase64(logoImage);
      localStorage.setItem('cachedLogoImage', logoImage)
    });
  }, [organisationDetails])

  const verifyConnectionObj = useAppSelector(
    (state) => state?.gettingStart?.data
  );

  const isVerify = verifyConnectionObj?.verification?.presentationState === 'verified';

  const callRightSideDrawer = () => {
    setOpenRightSideDrawer(!openRightSideDrawer)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormValue = {
      ...formValue,
      [name]: value,
    };
    setFormValue(updatedFormValue);
    // Update parent component's state with field name and value
    setOganisationDetails(name, value);
  }

  const { mutateAsync: updateDataSource } = useUpdateDataSource();

  const handleSave = async () => {
    try {
      const obj = {
        "dataSource": formValue
      };

      // Use the custom hook for updating data source
      await updateDataSource(obj);

      // Exit edit mode after successful save
      handleEdit();
    } catch (error) {
      console.error('Error saving organization details:', error);
      // You might want to show an error toast here
    }
  }

  const addCredentialClass = isVerify ? 'view-credential' : !isEnableAddCredential ? 'add-credential cursorNotAllowed' : 'add-credential';
  return (
    <DetailsContainer sx={{ flexGrow: 1 }} className="gettingStarted">
      <DrawerComponent
        openRightSideDrawer={openRightSideDrawer}
        onCloseRightSideDrawer={callRightSideDrawer}>
        <AddCredentialComponent isVerify={isVerify} callRightSideDrawer={callRightSideDrawer} />
      </DrawerComponent>
      <Grid
        sx={{
          display: { xs: "grid", sm: "flex" },
          justifyContent: "space-between",
          paddingLeft: { xs: "0", sm: "50px" },
        }}
      >
        <Grid
          sx={{
            height: { xs: "auto", sm: "90px" },
            display: { xs: "grid", sm: "flex" },
            width: "auto",
          }}
        >
          <OrgLogoImageUpload
            editMode={editMode}
            logoImageBase64={logoImageBase64}
            setLogoImageBase64={setLogoImageBase64}
            handleEdit={handleEdit}
          />

          <Box
            sx={{
              marginLeft: { xs: "0", sm: "30px" },
              marginTop:
                editMode === true
                  ? { xs: "-150px", sm: "0px" }
                  : { xs: "9px", sm: "0px" },
            }}
          >
            {editMode ? (
              <>
                <Box sx={{ display: "flex", alignItems: 'center' }} mb={"11px"} mt={"-2px"}>
                  <TextField
                    autoFocus
                    value={formValue.name}
                    onChange={handleChange}
                    variant="standard"
                    placeholder={t("gettingStarted.organisationName")}
                    fullWidth
                    name='name'
                    style={{
                      ...editStyleEnable,
                      marginTop: "0.9px",
                      fontSize: "0.875rem !important"
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 20, fontWeight: "bold", marginTop: "-4px" },
                    }}
                  />
                </Box>
                <Typography variant="body2" height="23px" sx={{ marginTop: '10px', color: '#9F9F9F' }}>
                  {t('gettingStarted.sector')} {t('gettingStarted.public')}
                </Typography>
                <Typography variant="body2" height="23px" sx={{ marginTop: '10px', color: '#9F9F9F' }}>
                  {t('gettingStarted.industry')} {formValue.sector}
                </Typography>
                <TextField
                  variant="standard"
                  value={formValue.location}
                  name='location'
                  onChange={handleChange}
                  placeholder={t("gettingStarted.location")}
                  fullWidth
                  style={{ ...editStyleEnable, marginTop: "-4px" }}
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 14 },
                  }}
                />
                <TextField
                  variant="standard"
                  onChange={handleChange}
                  placeholder={t("common.policyUrl")}
                  value={formValue.policyUrl}
                  fullWidth
                  name='policyUrl'
                  style={{ ...editStyleEnable }}
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 14 },
                  }}
                />
              </>
            ) :
              <>
                <Box sx={{ display: "flex", alignItems: 'center' }} mt={"-7px"} >
                  <Typography variant="h6" fontWeight="bold">
                    {organisationDetails?.name}
                  </Typography>
                  {isVerify ? <CheckCircleIcon className="verify" /> : <DoNotDisturbOnIcon className="no-verify" />}
                  <p className={addCredentialClass} onClick={callRightSideDrawer}>
                    {isVerify ? (t('gettingStarted.viewCredential')) : (t('gettingStarted.addCredential'))}
                  </p>
                </Box>
                <Typography variant="body2" height="23px">
                  {(t('gettingStarted.sector'))} {t('gettingStarted.public')}
                </Typography>
                <Typography variant="body2" height="23px">
                  {(t('gettingStarted.industry'))}:&nbsp;
                  {organisationDetails?.sector}
                </Typography>
                <Typography variant="body2" height="23px">
                  {(t('gettingStarted.location'))}:&nbsp; {organisationDetails?.location}
                </Typography>
                <Typography variant="body2" height="23px">
                  {(t('gettingStarted.policyUrl'))}:&nbsp;
                  {organisationDetails?.policyUrl}
                </Typography>
              </>
            }
          </Box>
        </Grid>
        <Grid>
          {editMode ? (
            <Box
              sx={{
                textAlign: { xs: "left", sm: "right" },
                marginTop: { xs: "-40px", sm: "0px" },
                paddingTop: "8px"
              }}
            >
              <Button
                onClick={() => handleEdit()}
                style={buttonStyle}
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                  color: "black",
                }}
              >
                {t("common.cancel")}
              </Button>
              <Button
                onClick={() => handleSave()}
                style={buttonStyle}
                variant="outlined"
                sx={{
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                  color: "black",
                }}
              >
                {t("common.save")}
              </Button>
            </Box>
          ) : <Typography
            onClick={() => handleEdit()}
            sx={{
              cursor: "pointer",
              textAlign: { xs: "left", sm: "right" },
              marginTop: { xs: "14px", sm: "0px" },
              padding: "10px"
            }}
          >
            {t("common.edit")}
          </Typography>}
        </Grid>
      </Grid>
      <Box sx={{ minHeight: 100, maxHeight: 160, overflow: "auto", marginTop: "50px" }}>
        <Typography variant="h6" fontWeight="bold" >{t('gettingStarted.overView')}</Typography>
        {editMode ? (
          <TextField
            variant="standard"
            value={formValue?.description}
            multiline={true}
            onChange={handleChange}
            name='description'
            label={false}
            placeholder={(t('gettingStarted.descriptionPlaceholder'))}
            fullWidth
            style={{ marginTop: "-4px" }}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: 14 },
            }}
          />
        ) : (
          <>
            <Box>
              <p className="txtOverview" >{organisationDetails?.description}</p>
            </Box>
          </>
        )}
      </Box>
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
