import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface PdfViewerProps {
  pdfUrl: string;
  initialPage?: number | null;
  height?: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, initialPage, height = 500 }) => {
  const [page, setPage] = useState(initialPage || 1);
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    setPage(initialPage || 1);
  }, [initialPage]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, display: 'flex', alignItems: 'center', gap: 1, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton size="small" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          <ArrowBack fontSize="small" />
        </IconButton>
        <Typography variant="caption">Page {page}</Typography>
        <IconButton size="small" onClick={() => setPage((p) => p + 1)}>
          <ArrowBack fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          variant="outlined"
          onClick={() => window.open(pdfUrl, '_blank')}
        >
          Open in new tab
        </Button>
      </Box>
      <Box sx={{ overflow: 'auto', height: height - 36 }}>
        <object
          ref={objectRef}
          data={`${pdfUrl}#page=${page}`}
          type="application/pdf"
          style={{ width: '100%', height: '100%' }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Unable to display PDF inline.{' '}
            <Button size="small" onClick={() => window.open(pdfUrl, '_blank')}>
              Open PDF
            </Button>
          </Typography>
        </object>
      </Box>
    </Box>
  );
};
