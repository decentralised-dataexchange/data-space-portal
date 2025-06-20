import { useTranslations } from "next-intl";

export const getStatus = (t: ReturnType<typeof useTranslations>, status: string) => {
    const statusMap: Record<string, string> = {
      unlisted: t('dataAgreements.statuses.unlisted'),
      awaitingForApproval: t('dataAgreements.statuses.inReview'),
      approved: t('dataAgreements.statuses.approved'),
      rejected: t('dataAgreements.statuses.rejected'),
      listed: t('dataAgreements.statuses.listed')
    };
    return statusMap[status] || status;
  };