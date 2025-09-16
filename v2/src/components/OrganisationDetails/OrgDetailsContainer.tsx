"use client"
import React, { useEffect, useState } from "react";
import { useUpdateOrganisation } from "@/custom-hooks/gettingStarted";
import { Box, Grid, Typography, TextField, Button, Avatar, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import OrgLogoImageUpload from "@/components/OrganisationDetails/OrgLogoImageUpload";
import ViewCredentials from "@/components/ViewCredentials";
import RightSidebar from "@/components/common/RightSidebar";
import './style.scss';
import { useTranslations } from "next-intl";
import VerifiedBadge from "../common/VerifiedBadge";
import DeleteCredentialsModal from "./DeleteCredentialsModal";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon, PencilSimple as PencilIcon, TrashSimple as TrashIcon } from "@phosphor-icons/react";
import { Organisation } from "@/types/organisation";
import { OrgIdentityResponse } from "@/types/orgIdentity";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
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
  organisationDetails: any;
  handleEdit: () => void;
  setOganisationDetails: (field: string, value: string) => void;
  isEnableAddCredential: boolean;
  originalOrganisation?: Organisation;
  isVerified?: boolean;
  addCredentialUrl?: string;
  onAddCredentialsClick?: () => void;
  addCredentialsLoading?: boolean;
  coverImageBase64?: string;
  logoImageBase64?: string;
  orgIdentity?: OrgIdentityResponse;
};

const OrganisationDetailsContainer = (props: Props) => {
  const t = useTranslations();
  const [openRightSideDrawer, setOpenRightSideDrawer] = useState(false)
  const [showValues, setShowValues] = useState(false);
  const [openDeleteCredentials, setOpenDeleteCredentials] = useState(false);
  const {
    editMode,
    organisationDetails,
    handleEdit,
    isEnableAddCredential,
    setOganisationDetails
  } = props;
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
  }, [organisationDetails])

  const isVerify = !!props.isVerified;
  const hasIdentity = !!props.orgIdentity && Object.keys((props.orgIdentity as any)?.organisationalIdentity || {}).length > 0;

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
    setOganisationDetails(name, value);
  }

  const { mutateAsync: updateOrganisation } = useUpdateOrganisation();

  const handleSave = async () => {
    try {
      // Merge edited form values onto the original organisation object to preserve required fields
      const fullOrganisation: Organisation = {
        ...(props.originalOrganisation as Organisation),
        name: formValue.name,
        location: formValue.location,
        policyUrl: formValue.policyUrl,
        description: formValue.description,
        sector: formValue.sector,
      };

      const payload = { organisation: fullOrganisation };
      await updateOrganisation(payload);

      handleEdit();
    } catch (error) {
      console.error('Error saving organization details:', error);
    }
  }

  const addCredentialClass = isVerify ? 'view-credential' : !isEnableAddCredential ? 'add-credential cursorNotAllowed' : 'add-credential';
  return (
    <DetailsContainer
      sx={{
        flexGrow: 1,
        boxSizing: 'border-box',
        height: 'auto',
      }}
      className="gettingStarted"
    >
      <RightSidebar
        open={openRightSideDrawer}
        onClose={callRightSideDrawer}
        width={594}
        maxWidth={594}
        height="100%"
        headerContent={
          <Box sx={{ width: "100%" }}>
            <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
              {isVerify ? 
                t('gettingStarted.viewCredential') : 
                `${t('gettingStarted.connectWalletTitle')} ${t('gettingStarted.choose')}`}
            </Typography>
          </Box>
        }
        bannerContent={
          <>
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                alt="Banner"
                src={props.coverImageBase64 || defaultCoverImage}
                sx={{ height: 194, width: '100%', objectFit: 'cover' }}
              />
              <IconButton
                onClick={() => setShowValues(!showValues)}
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  zIndex: 10,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  }
                }}
              >
                {showValues ? <EyeSlashIcon size={20} color="white" /> : <EyeIcon size={20} color="white" />}
              </IconButton>
              <Box sx={{ position: "relative", height: '65px', left: -25 }}>
                      <Avatar
                        src={props.logoImageBase64 || defaultLogoImg}
                        sx={{
                          position: 'absolute',
                          left: 50,
                          top: -65,
                          width: 110,
                          height: 110,
                          border: '6px solid white',
                          backgroundColor: 'white'
                        }}
                      />
                    </Box>
            </Box>
          </>
        }
        showBanner={true}
        showFooter={true}
        footerContent={
          <Button
            onClick={callRightSideDrawer}
            className="delete-btn"
            sx={{
              marginRight: "10px",
              color: "black",
              "&:hover": {
                backgroundColor: "black",
                color: "white",
              },
            }}
            variant="outlined"
          >
            {t('common.close')}
          </Button>
        }
      >
        <ViewCredentials 
          callRightSideDrawer={callRightSideDrawer}
          orgIdentity={props.orgIdentity}
          organisation={props.originalOrganisation}
          showValues={showValues}
        />
      </RightSidebar>
      <DeleteCredentialsModal
        open={openDeleteCredentials}
        setOpen={setOpenDeleteCredentials}
      />
      <Grid
        sx={{
          display: { xs: "grid", sm: "flex" },
          justifyContent: "space-between",
          paddingLeft: { xs: "0", sm: "50px" },
        }}
      >
        <Grid
          sx={{
            height: editMode ? { xs: 'auto', sm: 'auto' } : { xs: "auto", sm: "90px" },
            display: { xs: "grid", sm: "flex" },
            width: "auto",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <OrgLogoImageUpload
            editMode={editMode}
            handleEdit={handleEdit}
          />

          <Box
            sx={{
              marginLeft: { xs: "0", sm: "30px" },
              // Small spacing below avatar on mobile; keep content high
              marginTop: editMode ? { xs: "8px", sm: "0px" } : { xs: "9px", sm: "0px" },
              display: "flex",
              flexDirection:"column",
              flexGrow: "1",
              width: "auto",
              maxWidth: "800px",
            }}
          >
            {editMode ? (
              <>
                <Box sx={{ display: "flex", alignItems: 'flex-start', flexDirection: 'column', width: '100%', maxWidth: { xs: '100%', sm: 500 } }} mb={"11px"} mt={"-2px"}>
                  <Typography variant="subtitle2" sx={{ color: '#000', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5 }}>
                    {t("gettingStarted.organisationName")}
                  </Typography>
                  <TextField
                    autoFocus
                    onChange={handleChange}
                    variant="standard"
                    fullWidth
                    name='name'
                    style={{
                      ...editStyleEnable,
                      marginTop: 0,
                      fontSize: "0.875rem !important"
                    }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 20, fontWeight: "bold", marginTop: "-4px" },
                    }}
                    value={formValue.name}
                  />
                </Box>
                <Box sx={{ mt: 1, width: '100%', maxWidth: { xs: '100%', sm: 500 } }}>
                  <Typography variant="subtitle2" sx={{ color: '#000', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5 }}>
                    {t('gettingStarted.sector')}
                  </Typography>
                  <TextField
                    variant="standard"
                    value={formValue.sector}
                    name='sector'
                    onChange={handleChange}
                    fullWidth
                    style={{ ...editStyleEnable, marginTop: 0 }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 14 },
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1, width: '100%', maxWidth: { xs: '100%', sm: 500 } }}>
                  <Typography variant="subtitle2" sx={{ color: '#000', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5 }}>
                    {t("gettingStarted.location")}
                  </Typography>
                  <TextField
                    variant="standard"
                    value={formValue.location}
                    name='location'
                    onChange={handleChange}
                    fullWidth
                    style={{ ...editStyleEnable, marginTop: 0 }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 14 },
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1, width: '100%', maxWidth: { xs: '100%', sm: 500 } }}>
                  <Typography variant="subtitle2" sx={{ color: '#000', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5 }}>
                    {t("common.policyUrl")}
                  </Typography>
                  <TextField
                    variant="standard"
                    onChange={handleChange}
                    value={formValue.policyUrl}
                    fullWidth
                    name='policyUrl'
                    style={{ ...editStyleEnable, marginTop: 0 }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 14 },
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1, maxWidth: { xs: '100%', sm: 500 } }}>
                  <Typography variant="subtitle2" sx={{ color: '#000', fontSize: { xs: '13px', sm: '14px' }, mb: 0.5 }}>
                    {t("common.description")}
                  </Typography>
                  <TextField
                    variant="standard"
                    onChange={handleChange}
                    value={formValue.description}
                    fullWidth
                    name='description'
                    multiline
                    minRows={1}
                    maxRows={6}
                    style={{ ...editStyleEnable, marginTop: 0, height: 'auto' }}
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: 14 },
                    }}
                  />
                </Box>
              </>
            ) :
              <>
                <Box sx={{ display: "flex", alignItems: 'center' }} mt={"-7px"} >
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
                    {organisationDetails?.name}
                  </Typography>
                  {isVerify ? (
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <p
                        style={{ marginLeft: '0.5rem' }}
                        className={addCredentialClass}
                        onClick={callRightSideDrawer}
                      >
                        {t('gettingStarted.viewCredential')}
                      </p>
                      {hasIdentity && (
                        <Tooltip title={t('gettingStarted.tooltipDeleteCredentials')} placement="top">
                          <IconButton
                            aria-label="delete-credentials"
                            onClick={() => setOpenDeleteCredentials(true)}
                            size="small"
                            sx={{ ml: 0.5, color: '#d80606', p: 0.25, '&:hover': { backgroundColor: 'transparent', color: '#b10505' } }}
                          >
                            <TrashIcon size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ) : props.isEnableAddCredential ? (
                    <Button
                      variant="text"
                      className={'view-credential'}
                      onClick={props.addCredentialsLoading ? undefined : props.onAddCredentialsClick}
                      disabled={!!props.addCredentialsLoading}
                      sx={{
                        ml: '0.5rem',
                        minWidth: 'auto',
                        padding: 0,
                        lineHeight: 1,
                        textTransform: 'none !important',
                        '&:hover': { backgroundColor: 'transparent' },
                        '&.Mui-disabled': { opacity: 0.6 },
                      }}
                    >
                      {props.addCredentialsLoading ? t('common.pleaseWait') : t('gettingStarted.addCredential')}
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      className={'view-credential'}
                      disabled
                      sx={{
                        ml: '0.5rem',
                        minWidth: 'auto',
                        padding: 0,
                        lineHeight: 1,
                        textTransform: 'none !important',
                        '&:hover': { backgroundColor: 'transparent' },
                        '&.Mui-disabled': { opacity: 0.6 }
                      }}
                    >
                      {t('gettingStarted.addCredential')}
                    </Button>
                  )}
                </Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: 1, paddingTop: '3px', color: isVerify ? '#2e7d32' : '#d32f2f' }}>
                    {isVerify ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
                    <VerifiedBadge trusted={isVerify} />
                  </Typography>
                <Typography variant="body2" height="23px">
                  {(t('gettingStarted.sector'))}:&nbsp;
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
                marginTop: { xs: "12px", sm: "0px" },
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
              padding: "10px",
              marginRight: "0.7rem"
            }}
          >
            {t("common.edit")}
          </Typography>}
        </Grid>
      </Grid>
      {!editMode && (
        <Box
          sx={{
            minHeight: 100,
            maxHeight: { xs: 'none', sm: 160 },
            overflow: { xs: 'visible', sm: 'auto' },
            marginTop: { xs: '24px', sm: '50px' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>{t('gettingStarted.overView')}</Typography>
          </Box>
          <Box>
            <p className="txtOverview" >{organisationDetails?.description}</p>
          </Box>
        </Box>
      )}
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
