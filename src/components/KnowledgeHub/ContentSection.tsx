"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowUpRight } from '@phosphor-icons/react';

interface ContentSectionProps {
  title: string;
  content: string;
  link?: { label: string; href: string };
}

/** Render simple markdown: **bold**, - bullet lists, and \n line breaks */
function renderContent(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    elements.push(
      <Box component="ul" key={`ul-${elements.length}`} sx={{ pl: 2.5, my: 1, listStyleType: "'–  '" }}>
        {bulletBuffer.map((item, i) => (
          <Box component="li" key={i} sx={{ fontSize: '15px', color: '#424245', lineHeight: 1.7, letterSpacing: '-0.01em', mb: 0.5 }}>
            {renderInline(item)}
          </Box>
        ))}
      </Box>
    );
    bulletBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('- ')) {
      bulletBuffer.push(line.slice(2));
    } else {
      flushBullets();
      if (line.trim() === '') {
        elements.push(<Box key={`br-${i}`} sx={{ height: '0.5em' }} />);
      } else {
        elements.push(
          <Typography key={`p-${i}`} sx={{ fontSize: '15px', color: '#424245', lineHeight: 1.7, letterSpacing: '-0.01em' }}>
            {renderInline(line)}
          </Typography>
        );
      }
    }
  }
  flushBullets();
  return elements;
}

/** Render **bold**, [link](url), and **[bold link](url)** inline */
export function renderInline(text: string): React.ReactNode {
  // Split on **bold**(which may contain a link) and [label](url) patterns
  const parts = text.split(/(\*\*(?:[^*]|\*(?!\*))+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      // Check if the bold content is a link: **[text](url)**
      const boldLinkMatch = inner.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (boldLinkMatch) {
        return (
          <a
            key={i}
            href={boldLinkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 700 }}
          >
            {boldLinkMatch[1]}
          </a>
        );
      }
      return <strong key={i}>{inner}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default function ContentSection({ title, content, link }: ContentSectionProps) {
  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 2.5, md: 3.5 },
        borderRadius: '16px',
        backgroundColor: '#fff',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <Typography
        sx={{
          fontSize: '17px',
          fontWeight: 600,
          color: '#1d1d1f',
          letterSpacing: '-0.02em',
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Box>{renderContent(content)}</Box>
      {link && (
        <Box sx={{ mt: 2 }}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0071e3',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              letterSpacing: '-0.01em',
            }}
          >
            {link.label} <ArrowUpRight size={14} weight="bold" />
          </a>
        </Box>
      )}
    </Box>
  );
}
