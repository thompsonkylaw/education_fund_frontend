import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';

const PdfViewer = ({ pdfBase64, filename }) => {
  const pdfViewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Zoom constants
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 2.0;
  const ZOOM_STEP = 0.1;
  const ZOOM_OUT_TIMES = 4;

  // Calculate initial scale: standard scale minus four zoom-outs, clamped to minimum
  const standardScale = window.innerWidth < 768 ? 1.0 : 1.5;
  const initialScale = Math.max(standardScale - ZOOM_OUT_TIMES * ZOOM_STEP, MIN_SCALE);
  const [scale, setScale] = useState(initialScale);

  // Zoom control functions
  const zoomIn = (event) => {
    setScale(prevScale => Math.min(prevScale + ZOOM_STEP, MAX_SCALE));
    event.currentTarget.blur();
  };

  const zoomOut = (event) => {
    setScale(prevScale => Math.max(prevScale - ZOOM_STEP, MIN_SCALE));
    event.currentTarget.blur();
  };

  const resetZoom = (event) => {
    setScale(window.innerWidth < 768 ? 1.0 : 1.5); // Reset to standard scale based on window width
    event.currentTarget.blur();
  };

  // Download function
  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = filename || 'document.pdf';
    link.click();
  };

  useEffect(() => {
    const renderPdf = async () => {
      if (!window.pdfjsLib) {
        console.error('PDF.js library is not loaded');
        return;
      }

      if (!pdfBase64 || typeof pdfBase64 !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(pdfBase64)) {
        console.error('Invalid base64 string provided');
        return;
      }

      setIsLoading(true);
      try {
        const binaryString = atob(pdfBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const pdfViewer = pdfViewerRef.current;
        if (!pdfViewer) return;

        pdfViewer.innerHTML = ''; // Clear previous content

        const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
        console.log(`Rendering PDF with ${pdf.numPages} pages`);

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            console.log(`Page ${pageNum}: height=${viewport.height}, width=${viewport.width}`);
            pdfViewer.appendChild(canvas);
            await page.render({ canvasContext: context, viewport }).promise;
          } catch (pageError) {
            console.error(`Error rendering page ${pageNum}:`, pageError);
          }
        }
      } catch (error) {
        console.error('Error rendering PDF:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pdfBase64) {
      renderPdf();
    }
  }, [pdfBase64, scale]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Tooltip title="Zoom In">
          <IconButton onClick={(e) => zoomIn(e)} disabled={scale >= MAX_SCALE}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton onClick={(e) => zoomOut(e)} disabled={scale <= MIN_SCALE}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Zoom">
          <IconButton onClick={(e) => resetZoom(e)}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>
      {isLoading && <p>Loading PDF...</p>}
      <div ref={pdfViewerRef} style={{ height: '600px', overflow: 'auto' }} />
    </div>
  );
};

export default PdfViewer;