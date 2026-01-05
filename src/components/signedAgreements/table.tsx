"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { EyeIcon, SignOutIcon, SignInIcon } from "@phosphor-icons/react";
import { Tooltip, Box, Button, Typography } from "@mui/material";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import RightSidebar from "../common/RightSidebar";
import JsonViewer from "@/components/common/JsonViewer";
import { loader as monacoLoader } from "@monaco-editor/react";
import PaginationControls from "@/components/common/PaginationControls";
import { getStatus } from "@/utils/dda";
import { useTranslations } from "next-intl";
import { SignedAgreementsListResponse } from "@/types/signedAgreement";
import { formatLocalDate } from "@/utils/dateFormat";
import { useClipboard } from "@/custom-hooks/useClipboard";
import { StyledTableCell, StyledTableRow } from "@/components/common/Table/StyledTable";
import { TIMEOUTS } from "@/constants/dimensions";

interface Props {
  tabledata: SignedAgreementsListResponse | { dataDisclosureAgreementRecord: any[]; pagination: any };
  limit: number;
  offset: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onView: (row: any) => void;
}

const SignedAgreementsTable: React.FC<Props> = ({
  tabledata,
  limit,
  offset,
  onPageChange,
  onRowsPerPageChange,
  onView,
}) => {
  const t = useTranslations();

  const rows = (tabledata?.dataDisclosureAgreementRecord || []) as any[];
  const { copiedKey, copy } = useClipboard({ timeout: TIMEOUTS.COPY_FEEDBACK });
  const [openJson, setOpenJson] = React.useState(false);
  const [jsonContent, setJsonContent] = React.useState<string>("");
  const [jsonHeader, setJsonHeader] = React.useState<{ purpose: string; id: string }>({ purpose: '', id: '' });

  const openJsonViewer = async (rawRow: any) => {
    const rec = rawRow?.dataDisclosureAgreementRecord || rawRow || {};
    try {
      // Prefer pretty-printing the full record object. If it is a string, parse first.
      const toShow = typeof rec === 'string' ? JSON.parse(rec) : rec;
      setJsonContent(JSON.stringify(toShow, null, 2));
    } catch {
      // As a fallback, show string form
      setJsonContent(typeof rec === 'string' ? rec : JSON.stringify(rec));
    }
    try {
      const objDataStr = rec?.dataDisclosureAgreementTemplateRevision?.objectData;
      let obj: any = {};
      if (typeof objDataStr === 'string') {
        try { obj = JSON.parse(objDataStr) || {}; } catch {}
      }
      const purpose = obj?.purpose || '';
      const recordId = rawRow?.dataDisclosureAgreementRecordId || '';
      const templateId = rawRow?.dataDisclosureAgreementTemplateId
        || obj?.templateId || obj?.templateID
        || rec?.templateId || rec?.templateID || '';
      setJsonHeader({ purpose, id: recordId || templateId });
    } catch {}
    await monacoLoader.init();
    setOpenJson(true);
  };

  const headerContent = (
    <Box sx={{ width: '100%' }}>
      <Typography noWrap sx={{ fontSize: '16px' }}>
        {t('signedAgreements.jsonViewer.title')}: {jsonHeader.purpose}
      </Typography>
      <Typography color="#F3F3F6" variant="body2" noWrap sx={{ fontSize: '12px' }}>
        {jsonHeader.id}
      </Typography>
    </Box>
  );

  const footerContent = (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <Button onClick={() => setOpenJson(false)} className="delete-btn" variant="outlined">
        {t('common.close')}
      </Button>
      <Tooltip
        title={copiedKey === 'json' ? t('common.copied') : t('common.copy')}
        placement="top"
        open={copiedKey === 'json' || undefined}
        disableHoverListener={copiedKey === 'json'}
        disableFocusListener={copiedKey === 'json'}
        disableTouchListener={copiedKey === 'json'}
      >
        <span>
          <Button
            onClick={() => copy(jsonContent || '', 'json')}
            className="delete-btn"
            variant="outlined"
          >
            {t('common.copy')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );

  return (
    <>
    <TableContainer className="dd-container" sx={{ backgroundColor: 'transparent', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
      <Table size="small" aria-label="signed agreements table">
        <TableHead>
          <TableRow>
            <StyledTableCell>{t("signedAgreements.table.headers.dataSource")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.ddaRecordId")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.usagePurpose")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.version")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.agreementEvent")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.signatureStatus")}</StyledTableCell>
            <StyledTableCell>{t("signedAgreements.table.headers.lastModifiedDate")}</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: 120 }}></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: '#FFFFFF' }}>
          {rows.length > 0 ? (
            rows.map((row: any) => {
              // Support both SignedAgreementRecord (with nested dataDisclosureAgreementRecord)
              // and flat DataDisclosureAgreementRecord items
              const rec = row?.dataDisclosureAgreementRecord || row || {};
              const objDataStr = rec?.dataDisclosureAgreementTemplateRevision?.objectData;
              let obj: any = {};
              try {
                obj = objDataStr ? JSON.parse(objDataStr) : {};
              } catch (e) {
                obj = {};
              }
              const recordId = row?.dataDisclosureAgreementRecordId || '';
              const purpose = obj?.purpose || '';
              const version = obj?.version || obj?.templateVersion || '';
              const dataSourceName = rec?.dataSourceSignature?.signatureDecoded?.name || '';
              const dsSig = rec?.dataSourceSignature?.signature || '';
              const dusSig = rec?.dataUsingServiceSignature?.signature || '';
              const status = row?.optIn ? "Opt-in" : "Opt-out";
              return (
                <StyledTableRow key={row?.id || rec?.id || rec?.dataDisclosureAgreementTemplateRevision?.id}>
                  <StyledTableCell>{dataSourceName}</StyledTableCell>
                  <StyledTableCell>{recordId}</StyledTableCell>
                  <StyledTableCell>{purpose}</StyledTableCell>
                  <StyledTableCell>{version}</StyledTableCell>
                  <StyledTableCell>{status}</StyledTableCell>
                  <StyledTableCell sx={{ width: '140px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      {/* Signature Status Label */}
                      <Box sx={{ fontSize: '14px', fontWeight: 'medium', color: 'rgba(0, 0, 0, 0.87)', whiteSpace: 'nowrap', marginRight: '10px' }}>
                        {dsSig && dusSig ? t('signedAgreements.signatures.mutuallySigned') : 
                         dsSig ? t('signedAgreements.signatures.dataSourceSigned') : 
                         ''}
                      </Box>
                      {/* Signature Icons */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/* Data Source Signature */}
                        <Tooltip
                          title={copiedKey === String(row?.id || rec?.id) + '-ds' ? t('common.copied') : t('signedAgreements.signatures.dataSourceSigned')}
                          placement="top"
                        >
                          <span style={{ cursor: dsSig ? 'pointer' : 'not-allowed' }}>
                            <IconButton
                              aria-label="copy-data-source-signature"
                              size="small"
                              onClick={() => dsSig && copy(dsSig, String(row?.id || rec?.id) + '-ds')}
                              disabled={!dsSig}
                              sx={{ color: dsSig ? '#000' : '#BDBDBD', padding: '2px' }}
                            >
                              <SignOutIcon size={16} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {/* Data Using Service Signature */}
                        <Tooltip
                          title={
                            copiedKey === String(row?.id || rec?.id) + '-dus'
                              ? t('common.copied')
                              : (dusSig
                                  ? t('signedAgreements.signatures.dataUsingServiceSigned')
                                  : t('signedAgreements.signatures.dataUsingServiceUnsigned'))
                          }
                          placement="top"
                        >
                          <span style={{ cursor: dusSig ? 'pointer' : 'not-allowed' }}>
                            <IconButton
                              aria-label="copy-data-using-service-signature"
                              size="small"
                              onClick={() => dusSig && copy(dusSig, String(row?.id || rec?.id) + '-dus')}
                              disabled={!dusSig}
                              sx={{ color: dusSig ? '#000' : '#BDBDBD', padding: '2px' }}
                            >
                              <SignInIcon size={16} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{formatLocalDate(row?.updatedAt || row?.createdAt)}</StyledTableCell>
                  <StyledTableCell align="center" sx={{ whiteSpace: 'nowrap', display: 'flex', justifyContent: 'center', gap: 1 }} style={{ border: 'none' }}>
                    <Tooltip title={t("signedAgreements.tooltipView")} placement="top">
                      <IconButton aria-label="view" onClick={() => onView(row)} sx={{ color: '#000' }}>
                        <EyeIcon size={17} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('signedAgreements.table.tooltips.viewJson')} placement="top">
                      <IconButton aria-label="view-json" onClick={() => openJsonViewer(row)} sx={{ color: '#000' }}>
                        <IntegrationInstructionsOutlinedIcon sx={{ fontSize: 19, color: 'inherit', opacity: 0.8 }} />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <StyledTableCell colSpan={8} align="center">
                {t("common.noResultsFound")}
              </StyledTableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {rows.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <PaginationControls
              totalItems={tabledata?.pagination?.totalItems || 0}
              defaultRowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
              page={Math.max(1, Math.floor((offset || 0) / Math.max(1, limit)) + 1)}
              rowsPerPage={limit}
              onChangePage={(next) => onPageChange(null, next - 1)}
              onChangeRowsPerPage={(next) => onRowsPerPageChange({ target: { value: String(next) } } as any)}
            />
          </Box>
      )}
    </TableContainer>

    {/* Right-side modal for JSON viewer */}
    <RightSidebar
      open={openJson}
      onClose={() => setOpenJson(false)}
      headerContent={headerContent}
      showBanner={false}
      footerContent={footerContent}
      className="drawer-dda"
      width={580}
      maxWidth={580}
    >
      <Box sx={{ mt: 2 }}>
        <JsonViewer value={jsonContent} height="600px" />
      </Box>
    </RightSidebar>
    </>
  );
};

export default SignedAgreementsTable;
