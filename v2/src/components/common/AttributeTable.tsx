"use client";

import React from "react";
import { Box, Typography, Tooltip, Link as MuiLink } from "@mui/material";
import CopyButton from "@/components/common/CopyButton";

export type AttributeRow = {
  label: string;
  value?: string;
  href?: string;
  copy?: boolean;
  mask?: boolean;
  action?: React.ReactNode;
  // Optional tooltip text to show when hovering the entire row
  tooltip?: string;
};

const cardContainerStyle: React.CSSProperties = {
  margin: "10px 0",
  border: "none",
  borderRadius: 7,
  backgroundColor: "#FFFFFF",
};

export const AttributeTable: React.FC<{
  rows: AttributeRow[];
  showValues?: boolean;
  labelMinWidth?: number;
  labelMaxPercent?: number;
  hideEmptyDash?: boolean;
  hideValueColumn?: boolean; // when true, don't render the right value column
}> = ({ rows, showValues = true, labelMinWidth = 180, labelMaxPercent = 36, hideEmptyDash = false, hideValueColumn = false }) => {
  return (
    <Box style={cardContainerStyle}>
      {rows.map((row, idx) => {
        const isLast = idx === rows.length - 1;
        const isFirst = idx === 0;
        const full = row.value ?? "";
        return (
          <Box key={`${row.label}-${idx}`}>
            <Box sx={{ mt: 1.25, mx: 1.25, mb: 0.625 }}>
              <Tooltip title={row.tooltip || ''} disableInteractive arrow placement="top-start">
              <Box
                sx={{
                  ...(isFirst ? { pt: 1.25 } : {}),
                  ...(isLast ? { pb: 1.25 } : {}),
                  borderBottom: isLast ? 'none' : 'solid 1px #dee2e6',
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: hideValueColumn ? { xs: "1fr", sm: `minmax(${labelMinWidth}px, ${labelMaxPercent}%)` } : { xs: "1fr", sm: `minmax(${labelMinWidth}px, ${labelMaxPercent}%) 1fr` },
                    alignItems: "center",
                    columnGap: 2,
                    rowGap: 0.5,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ wordBreak: "break-word", lineHeight: '20px', textWrap: "nowrap"}}>
                    {row.label}
                  </Typography>
                  {!hideValueColumn && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, height: '20px', justifyContent: 'flex-end' }}>
                    {showValues ? (
                      <Box sx={{ flex: 1, minWidth: 0, display: 'block', textAlign: 'right' }}>
                        <Tooltip title={full} placement="top-start" disableInteractive arrow>
                          {row.href ? (
                            <MuiLink
                              href={row.href}
                              target="_blank"
                              rel="noreferrer"
                              underline="hover"
                              sx={{
                                color: "#0000FF",
                                minWidth: 0,
                                display: "block",
                                width: '100%',
                                textAlign: 'right',
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {full}
                            </MuiLink>
                          ) : (
                            <Typography
                              variant="subtitle2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                minWidth: 0,
                                lineHeight: '20px',
                                textAlign: 'right',
                                width: '100%'
                              }}
                            >
                              {hideEmptyDash && !full ? "" : (full || "-")}
                            </Typography>
                          )}
                        </Tooltip>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0, justifyContent: 'flex-end' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            filter: 'blur(2px)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minWidth: 0,
                            lineHeight: '20px',
                            textAlign: 'right'
                          }}
                        >
                          {"********"}
                        </Typography>
                      </Box>
                    )}
                    {showValues && row.copy && !!full && <CopyButton text={full} />}
                    {row.action && (
                      <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                        {row.action}
                      </Box>
                    )}
                  </Box>
                  )}
                </Box>
              </Box>
              </Tooltip>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
