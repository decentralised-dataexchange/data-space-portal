"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { useTranslations } from "next-intl";
import { apiService } from "@/lib/apiService/apiService";
import { DataDisclosureAgreement } from "@/types/dataDisclosureAgreement";
import TagEditor from "@/components/common/TagEditor";
import RightSidebar from "@/components/common/RightSidebar";

interface Props {
  open: boolean;
  onClose: () => void;
  dda: DataDisclosureAgreement | null;
  onTagsUpdated?: () => void;
}

export default function TagEditModal({
  open,
  onClose,
  dda,
  onTagsUpdated,
}: Props) {
  const t = useTranslations();
  const [tags, setTags] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (dda) {
      setTags(dda.tags || []);
    }
  }, [dda]);

  const handleClose = () => {
    onClose();
    if (dda?.tags) {
      setTags(dda.tags);
    } else {
      setTags([]);
    }
  };

  const handleSubmit = async () => {
    if (!dda) return;

    const ddaId = dda.templateId || dda["@id"] || dda.dataAgreementId;
    if (!ddaId) return;

    setIsPending(true);
    try {
      await apiService.updateDDATags(ddaId, tags);
      onTagsUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update tags:", error);
    } finally {
      setIsPending(false);
    }
  };

  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
        Edit Tags: {dda?.purpose || 'N/A'}
      </Typography>
      <Typography sx={{ fontSize: '12px', color: '#F3F3F6', opacity: 0.8, mt: 0.5 }}>
        {dda?.templateId || 'N/A'}
      </Typography>
    </Box>
  );

  const footerContent = (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
      <Button
        variant="outlined"
        onClick={handleClose}
        disabled={isPending}
        className="delete-btn"
      >
        {t("common.cancel")}
      </Button>
      <Button
        variant="outlined"
        onClick={handleSubmit}
        disabled={isPending}
        className="delete-btn"
      >
        {isPending ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          t("common.save")
        )}
      </Button>
    </Box>
  );

  return (
    <RightSidebar
      open={open}
      onClose={handleClose}
      headerContent={headerContent}
      footerContent={footerContent}
      width={580}
      maxWidth={580}
      className="drawer-dda"
    >
      <Box sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: '1rem', mb: 1 }}>
          Tags
        </Typography>
        {dda ? (
          <TagEditor
            tags={tags}
            onTagsChange={setTags}
            isLoading={isPending}
            placeholder="Add a tag..."
          />
        ) : (
          <Typography color="error">{t("common.noDataSelected")}</Typography>
        )}
      </Box>
    </RightSidebar>
  );
}
