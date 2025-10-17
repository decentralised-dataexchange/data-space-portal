"use client";

import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/system";
import { EyeIcon, SignOutIcon, SignInIcon } from "@phosphor-icons/react";
import { Tooltip, Pagination, Box, Button } from "@mui/material";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import RightSidebar from "../common/RightSidebar";
import JsonViewer from "@/components/common/JsonViewer";
import { loader as monacoLoader } from "@monaco-editor/react";
import PaginationControls from "@/components/common/PaginationControls";
import { getStatus } from "@/utils/dda";
import { useTranslations } from "next-intl";
import { SignedAgreementsListResponse } from "@/types/signedAgreement";

interface Props {
  tabledata: SignedAgreementsListResponse | { dataDisclosureAgreementRecord: any[]; pagination: any };
  limit: number;
  offset: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onView: (row: any) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    backgroundColor: "#e5e4e4",
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.875rem",
    fontWeight: "lighter",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
});

const NumericPaginationActions: React.FC<any> = ({ count, page, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil((count || 0) / (rowsPerPage || 1)) || 0;
  if (totalPages <= 1) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Pagination
        count={totalPages}
        page={(page ?? 0) + 1}
        onChange={(_, value) => onPageChange?.(null, value - 1)}
        size="small"
        siblingCount={0}
        boundaryCount={1}
        sx={{
          '& .MuiPagination-ul': { alignItems: 'center' },
          '& .MuiPaginationItem-root': { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, lineHeight: '28px', fontSize: '12px', margin: '0 2px' },
          '& .MuiPaginationItem-root.MuiPaginationItem-previousNext': { minWidth: 28, height: 28, lineHeight: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
          '& .MuiPaginationItem-icon': { fontSize: 18, margin: 0, display: 'block' },
          '& .MuiSvgIcon-root': { fontSize: 18, verticalAlign: 'middle', display: 'block' },
          '& .MuiPaginationItem-previousNext .MuiPaginationItem-icon': { transform: 'translateY(-1px)' },
          '& .MuiPaginationItem-previousNext .MuiSvgIcon-root': { transform: 'translateY(-1px)' },
        }}
      />
    </Box>
  );
};

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
  const [copied, setCopied] = React.useState<{ key: string | null }>(() => ({ key: null }));
  const [openJson, setOpenJson] = React.useState(false);
  const [jsonContent, setJsonContent] = React.useState<string>("");
  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ key });
      window.setTimeout(() => setCopied({ key: null }), 1200);
    } catch {}
  };

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
    await monacoLoader.init();
    setOpenJson(true);
  };

  const headerContent = (
    <Box sx={{ width: '100%' }}>
      {/* Reuse generic header styling */}
      <span style={{ color: '#F3F3F6', fontSize: 16 }}>{t('signedAgreements.jsonViewer.title')}</span>
    </Box>
  );

  const footerContent = (
    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
      <Button onClick={() => setOpenJson(false)} className="delete-btn" variant="outlined">
        {t('common.close')}
      </Button>
      <Tooltip
        title={copied.key === 'json' ? t('common.copied') : t('common.copy')}
        placement="top"
        open={copied.key === 'json' || undefined}
        disableHoverListener={copied.key === 'json'}
        disableFocusListener={copied.key === 'json'}
        disableTouchListener={copied.key === 'json'}
      >
        <span>
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(jsonContent || '');
                setCopied({ key: 'json' });
                window.setTimeout(() => setCopied({ key: null }), 1200);
              } catch {}
            }}
            className="delete-btn"
            variant="outlined"
          >
            {t('common.copy')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );

  const formatLocalDate = (val?: string) => {
    if (!val) return "";
    const d = new Date(val);
    return isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

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
            <StyledTableCell align="center"></StyledTableCell>
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
                          title={copied.key === String(row?.id || rec?.id) + '-ds' ? t('common.copied') : t('signedAgreements.signatures.dataSourceSigned')}
                          placement="top"
                        >
                          <span style={{ cursor: dsSig ? 'pointer' : 'not-allowed' }}>
                            <IconButton
                              aria-label="copy-data-source-signature"
                              size="small"
                              onClick={() => dsSig && handleCopy(dsSig, String(row?.id || rec?.id) + '-ds')}
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
                            copied.key === String(row?.id || rec?.id) + '-dus'
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
                              onClick={() => dusSig && handleCopy(dusSig, String(row?.id || rec?.id) + '-dus')}
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
              <StyledTableCell colSpan={7} align="center">
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
