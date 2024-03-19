import React, {useState} from "react";
import { Box, Grid, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import OrgLogoImageUpload from "../../component/OrganisationDetails/OrgLogoImageUpload";
import DrawerComponent from "../../component/Drawer";
import AddCredentialComponent from "../../container/AddCredential";
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import './style.scss';
import { useTranslation } from "react-i18next";

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  borderRadius: 2,
  backgroundColor: "#FFFFF",
  padding: 10,
});

const editStyleEnable: React.CSSProperties = {
  borderWidth: 1.5,
  borderBottomStyle: "solid",
  borderBottomColor: "#DFE0E1",
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
  setOganisationDetails: React.Dispatch<React.SetStateAction<any>>;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>;
};

const OrganisationDetailsContainer = (props: Props) => {
  const [ formValue, setFormValue ] = useState({'orgName': 'Organization', 'location': 'Sweden', 'policyUrl': 'www.sample-url.com'})
  const { t } = useTranslation('translation');
  const [openRightSideDrawer, setOpenRightSideDrawer] = useState(false)
  const {
    editMode,
    logoImageBase64,
    organisationDetails,
    handleEdit,
    setOganisationDetails,
    setLogoImageBase64,
  } = props;

  const callRightSideDrawer = () => {
    setOpenRightSideDrawer(!openRightSideDrawer)
}

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormValue({
    ...formValue,
    [name]: value,
  });
}
  
const isVerify = sessionStorage.getItem('isVerify');
  return (
    <DetailsContainer sx={{ flexGrow: 1, padding: 0 }} className="gettingStarted">
      <DrawerComponent
            openRightSideDrawer={openRightSideDrawer}
            callRightSideDrawer={callRightSideDrawer}>
            <AddCredentialComponent callRightSideDrawer={callRightSideDrawer} />
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
              <TextField
                autoFocus
                value={formValue.orgName}
                defaultValue={organisationDetails.name}
                onChange={(e) => handleChange(e)}
                variant="standard"
                label={false}
                placeholder={t("gettingStarted.organisationName")}
                fullWidth
                name='orgName'
                style={{
                  ...editStyleEnable,
                  height: "26px"
                }}
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 20, fontWeight: "bold", marginTop:"-4px" },
                }}
              />
              <Typography
                color="#9F9F9F"
                variant="body2"
                height="23px"
                style={{ marginTop: "10px" }}
              >
                {t("gettingStarted.sector")} Public
              </Typography>
              <TextField
                variant="standard"
                label={false}
                value={formValue.location}
                name='location'
                onChange={(e) => handleChange(e)}
                placeholder={t("gettingStarted.location")}
                fullWidth
                style={{ ...editStyleEnable, marginTop: "-1px" }}
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 14 },
                }}
              />
              <TextField
                variant="standard"
                label={false}
                // value={organisationPolicyURL}
                onChange={(e) => handleChange(e)}
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
              <Box sx={{ display: "flex", alignItems: 'center'}}>
                  <Typography variant="h6" fontWeight="bold">
                    {t('gettingStarted.organisationName')}
                  </Typography>
                  {isVerify ? <CheckCircleOutlineOutlinedIcon className="verify" /> : <DoNotDisturbOnIcon className="no-verify" /> }
                  <p className="add-credential" onClick={callRightSideDrawer}>
                  {(t('gettingStarted.addCredential'))}
                  </p>
                  {/* <p className="edit" onClick={() => { handleEdit() }}>
                    {(t('gettingStarted.edit'))}
                  </p> */}
              </Box>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.sector'))} Public
                </Typography>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.location'))} Sweden
                </Typography>
                <Typography variant="body2" height="23px">
                {(t('gettingStarted.policyUrl'))} www.sampleUrl.com
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
              }}
            >
              <Button
                onClick={handleEdit}
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
                // onClick={handleSave}
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
          ) : (
            <p className="edit" onClick={() => { handleEdit() }}>
              {(t('gettingStarted.edit'))}
            </p>
          )}
          </Grid>
      </Grid>
      <Box>
        <Typography variant="h6" sx={{ marginTop: "70px"}} fontWeight="bold" >{t('gettingStarted.overView')}</Typography>
        <Box className="pt-20">
          <Typography className="txtOverview" >{(t('gettingStarted.descriptionPlaceholder'))}</Typography>
        </Box>
      </Box>
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
