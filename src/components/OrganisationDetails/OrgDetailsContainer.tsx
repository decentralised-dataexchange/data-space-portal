"use client"
import React, { useEffect, useState, useRef } from "react";
import { useUpdateOrganisation } from "@/custom-hooks/gettingStarted";
import { Box, Grid, Typography, TextField, Button, Avatar, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import OrgLogoImageUpload from "@/components/OrganisationDetails/OrgLogoImageUpload";
import ViewCredentialsController from "@/components/DataSources/ViewCredentialsController";
import './style.scss';
import { useTranslations } from "next-intl";
import VerifiedBadge from "../common/VerifiedBadge";
import DeleteCredentialsModal from "./DeleteCredentialsModal";
import { Organisation } from "@/types/organisation";
import { OrgIdentityResponse } from "@/types/orgIdentity";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";
import SoftwareStatementSection from "@/components/ViewCredentials/SoftwareStatementSection";
import { useGetSoftwareStatement } from "@/custom-hooks/developerApis";

const DetailsContainer = styled("div")({
  height: "auto",
  width: "100%",
  backgroundColor: "#FFFFF",
  padding: 10,
});

const editStyleEnable: SxProps<Theme> = {
  width: 344,
  height: 23,
  boxSizing: 'border-box',
  border: 'none',
  borderBottomStyle: 'solid',
  borderBottomColor: '#DFE0E1',
  borderBottomWidth: 1,
  '& .MuiInputBase-root': {
    padding: 0,
    minHeight: '23px',
    alignItems: 'center',
  },
  '& input': {
    padding: 0,
    paddingBottom: 0,
  },
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

  const isVerify = Boolean(
    props.orgIdentity?.verified ??
    (props.orgIdentity?.organisationalIdentity as any)?.verified ??
    (props.orgIdentity?.organisationalIdentity as any)?.presentationRecord?.verified ??
    props.isVerified ??
    false
  );
  const hasIdentity = !!props.orgIdentity && Object.keys((props.orgIdentity as any)?.organisationalIdentity || {}).length > 0;
  // Prefetch Software Statement as soon as organisation is verified
  // so that the modal has data ready instantly when opened
  const { data: softwareStatementRes } = useGetSoftwareStatement({ enabled: isVerify });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormValue = {
      ...formValue,
      [name]: value,
    };
    setFormValue(updatedFormValue);
    setOganisationDetails(name, value);
  }

  const handleDescriptionInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const text = e.currentTarget.textContent ?? '';
    setFormValue((prev) => ({ ...prev, description: text }));
    setOganisationDetails('description', text);
  }

  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

  // Initialize editable content when entering edit mode without causing caret resets
  useEffect(() => {
    if (editMode && descriptionRef.current) {
      // Prefer current form value, fallback to existing organisation description
      const initial = (formValue.description ?? organisationDetails?.description ?? '') as string;
      // Only update DOM if it differs to avoid caret jumps
      if (descriptionRef.current.innerText !== initial) {
        descriptionRef.current.innerText = initial;
      }
    }
  }, [editMode]);

  const handleDescriptionPaste = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    // Paste as plain text to avoid styled content interfering with caret/DOM
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    // Insert at caret position
    document.execCommand('insertText', false, text);
  };

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

  const badgeLabel = isVerify
    ? t('gettingStarted.viewCredential')
    : t('gettingStarted.addCredential');
  const canTriggerBadgeAction = isVerify || (!!props.isEnableAddCredential && !props.addCredentialsLoading);
  const handleBadgeAction = () => {
    if (props.addCredentialsLoading) return;
    // For verified users, ViewCredentialsController handles the click.
    // For unverified users looking to add credential:
    if (props.isEnableAddCredential) {
      props.onAddCredentialsClick?.();
    }
  };

  const deleteButton = (
    hasIdentity && (
      <Tooltip title={t('gettingStarted.tooltipDeleteCredentials')} placement="top">
        <Button
          onClick={() => setOpenDeleteCredentials(true)}
          className="delete-btn"
          variant="outlined"
          sx={{
            minWidth: 120,
            textTransform: 'none',
            borderColor: '#DFDFDF',
            color: 'black',
            borderRadius: '0 !important',
            '&:hover': { backgroundColor: 'black', color: 'white', borderColor: 'black' },
          }}
        >
          {t('common.delete')}
        </Button>
      </Tooltip>
    )
  );

  const organisationForController = {
    id: props.originalOrganisation?.id,
    name: props.originalOrganisation?.name,
    description: props.originalOrganisation?.description,
    location: props.originalOrganisation?.location,
    policyUrl: props.originalOrganisation?.policyUrl,
    sector: props.originalOrganisation?.sector,
    logoUrl: props.logoImageBase64 || defaultLogoImg,
    coverImageUrl: props.coverImageBase64 || defaultCoverImage,
    softwareStatement: (softwareStatementRes as any)?.softwareStatement,
  };

  return (
    <DetailsContainer
      sx={{
        flexGrow: 1,
        boxSizing: 'border-box',
        height: 'auto',
      }}
      className="gettingStarted"
    >
      <DeleteCredentialsModal
        open={openDeleteCredentials}
        setOpen={setOpenDeleteCredentials}
        onSuccess={() => {}}
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
              // Use a consistent value across modes to avoid 1px layout shift on xs
              marginTop: { xs: "8px", sm: "0px" },
              display: "flex",
              flexDirection:"column",
              rowGap: '4px',
              flexGrow: "1",
              width: "auto",
              maxWidth: "800px",
            }}
          >
            {editMode ? (
              <>
                <Box sx={{ display: "flex", alignItems: 'flex-end', height: '24px', gap: 1 }} mt={"-7px"}>
                  <TextField
                    autoFocus
                    onChange={handleChange}
                    variant="standard"
                    name='name'
                    value={formValue.name}
                    sx={editStyleEnable}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    inputProps={{
                      style: {
                        padding: 0,
                        paddingBottom: 0,
                        fontSize: '20px',
                        lineHeight: 1.2,
                        fontWeight: 700,
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    }}
                  />
                  {isVerify ? (
                    <ViewCredentialsController
                      organisation={organisationForController as any}
                      organisationIdentity={props.orgIdentity}
                      trustedOverride={true}
                      extraFooterContent={deleteButton}
                    />
                  ) : (
                    <Tooltip title={badgeLabel} placement="top">
                      <Box
                        component="button"
                        type="button"
                        onClick={handleBadgeAction}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleBadgeAction();
                          }
                        }}
                        aria-label={badgeLabel}
                        disabled={!canTriggerBadgeAction}
                        sx={{
                          ml: 0.5,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          cursor: canTriggerBadgeAction ? 'pointer' : 'not-allowed',
                          opacity: canTriggerBadgeAction ? 1 : 0.5,
                          '&:focus-visible': {
                            outline: '2px solid #03182b',
                            outlineOffset: 2,
                          },
                          '&:disabled': {
                            cursor: 'not-allowed',
                          },
                        }}
                      >
                        <VerifiedBadge trusted={isVerify} />
                      </Box>
                    </Tooltip>
                  )}
                </Box>
                {editMode ? (
                  <Box sx={{ height: '15px' }} />
                ) : null}
                <Box sx={{ height: '23px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    variant="standard"
                    value={formValue.sector}
                    name='sector'
                    onChange={handleChange}
                    placeholder={t('gettingStarted.sector')}
                    sx={editStyleEnable}
                    InputProps={{ disableUnderline: true }}
                    inputProps={{
                      style: {
                        padding: 0,
                        paddingBottom: 0,
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ height: '23px', display: 'flex', alignItems: 'center' }}>
                  <TextField
                    variant="standard"
                    value={formValue.location}
                    name='location'
                    onChange={handleChange}
                    sx={editStyleEnable}
                    InputProps={{ disableUnderline: true }}
                    inputProps={{
                      style: {
                        padding: 0,
                        paddingBottom: 0,
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ height: '23px', display: 'flex', alignItems: 'center', width: '100%' }}>
                  <TextField
                    variant="standard"
                    onChange={handleChange}
                    value={formValue.policyUrl}
                    name='policyUrl'
                    placeholder={t('gettingStarted.policyUrl')}
                    sx={editStyleEnable}
                    InputProps={{ disableUnderline: true }}
                    inputProps={{
                      style: {
                        padding: 0,
                        paddingBottom: 0,
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                        color: 'rgba(0, 0, 0, 0.87)',
                      },
                    }}
                    />
                </Box>
              </>
            ) :
              <>
                <Box sx={{ display: "flex", alignItems: 'flex-end', height: '24px' }} mt={"-7px"} >
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px', lineHeight: '1.2', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {organisationDetails?.name}
                    {isVerify ? (
                      <ViewCredentialsController
                        organisation={organisationForController as any}
                        organisationIdentity={props.orgIdentity}
                        trustedOverride={true}
                        extraFooterContent={deleteButton}
                      />
                    ) : (
                      <Tooltip title={badgeLabel} placement="top">
                        <Box
                          component="button"
                          type="button"
                          onClick={handleBadgeAction}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              handleBadgeAction();
                            }
                          }}
                          aria-label={badgeLabel}
                          disabled={!canTriggerBadgeAction}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            cursor: canTriggerBadgeAction ? 'pointer' : 'not-allowed',
                            opacity: canTriggerBadgeAction ? 1 : 0.5,
                            '&:focus-visible': {
                              outline: '2px solid #03182b',
                              outlineOffset: 2,
                            },
                            '&:disabled': {
                              cursor: 'not-allowed',
                            },
                          }}
                        >
                          <VerifiedBadge trusted={isVerify} />
                        </Box>
                      </Tooltip>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ height: '24px' }} />
                <Typography variant="body2" height="23px" sx={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {(t('gettingStarted.sector'))}:&nbsp;
                  {organisationDetails?.sector}
                </Typography>
                <Typography variant="body2" height="23px" sx={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {(t('gettingStarted.location'))}:&nbsp; {organisationDetails?.location}
                </Typography>
                <Typography variant="body2" height="23px" sx={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {(t('gettingStarted.policyUrl'))}:&nbsp;
                  {organisationDetails?.policyUrl ? (
                    <a
                      href={organisationDetails.policyUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0000FF', wordBreak: 'break-all', fontSize: '14px', lineHeight: '1.5' }}
                    >
                      {organisationDetails.policyUrl}
                    </a>
                  ) : (
                    <span>-</span>
                  )}
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
              marginRight: "0.7rem"
            }}
          >
            {t("common.edit")}
          </Typography>}
        </Grid>
      </Grid>
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
          <p
            className="txtOverview"
            contentEditable={editMode}
            suppressContentEditableWarning
            aria-label={t('common.description')}
            onInput={handleDescriptionInput}
            onPaste={handleDescriptionPaste}
            ref={descriptionRef}
            style={{ outline: 'none' }}
          >
            {!editMode ? (organisationDetails?.description || '') : null}
          </p>
        </Box>
      </Box>
    </DetailsContainer>
  );
};

export default OrganisationDetailsContainer;
