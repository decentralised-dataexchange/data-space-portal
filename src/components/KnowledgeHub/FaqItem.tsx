"use client";

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { Plus, Minus } from '@phosphor-icons/react';

interface FaqItemProps {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        mb: 0,
        borderRadius: '0 !important',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        '&:before': { display: 'none' },
        '&:first-of-type': { borderRadius: '16px 16px 0 0 !important' },
        '&:last-of-type': { borderRadius: '0 0 16px 16px !important', borderBottom: 'none' },
        '&.Mui-expanded': { margin: 0 },
        backgroundColor: '#fff',
      }}
    >
      <AccordionSummary
        expandIcon={expanded ? <Minus size={18} color="#86868b" /> : <Plus size={18} color="#86868b" />}
        sx={{
          py: 1,
          px: { xs: 2.5, md: 3 },
          textTransform: 'none !important',
          '& .MuiAccordionSummary-content': { my: 1.5 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '15px',
            color: '#1d1d1f',
            letterSpacing: '-0.01em',
          }}
        >
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: 2.5, pt: 0 }}>
        <Typography
          sx={{
            color: '#424245',
            lineHeight: 1.7,
            fontSize: '14px',
            letterSpacing: '-0.01em',
            whiteSpace: 'pre-line',
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
