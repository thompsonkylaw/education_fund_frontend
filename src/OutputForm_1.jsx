import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableFooter, 
  Paper 
} from '@mui/material';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const OutputForm_1 = ({ processedData, age, currencyRate, numOfRowInOutputForm_1, fontSizeMultiplier = 1 }) => {
  const { t } = useTranslation();
  const startAge = age;
  const ageToAccMP = {};
  processedData.forEach(row => {
    ageToAccMP[row.age] = row.accumulatedMP;
  });

  const rows = [];
  let lastEndAge = startAge - 1;
  let lastAccMP = 0;

  while (lastEndAge < 100) {
    const rowStart = lastEndAge + 1;
    if (rowStart > 100) break;
    const rowEnd = Math.min(rowStart + 9, 100);
    if (!(rowEnd in ageToAccMP)) break;
    const ageRange = rowStart === rowEnd 
      ? `${rowStart} ${t('common.yearsOld')}` 
      : `${rowStart} - ${rowEnd} ${t('common.yearsOld')}`;
    const value = ageToAccMP[rowEnd] - lastAccMP;
    rows.push({
      ageRange,
      value,
    });
    lastAccMP = ageToAccMP[rowEnd];
    lastEndAge = rowEnd;
  }

  const total = ageToAccMP[100];
  const formattedTotal = numberFormatter.format(Math.round(total));

  const baseFontSize = 1;
  const headerFontSize = 1.5;
  const cellFontSize = `${baseFontSize * fontSizeMultiplier}rem`;
  const headerFooterFontSize = `${headerFontSize * fontSizeMultiplier}rem`;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell 
              colSpan={2} 
              align="center" 
              sx={{ 
                backgroundColor: 'rgb(42, 157, 143)', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: headerFooterFontSize 
              }}
            >
              {t('outputForm1.header')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: cellFontSize }}>{row.ageRange}</TableCell>
              <TableCell 
                align="right" 
                sx={{ fontSize: cellFontSize }}
              >
                {`HKD $ ${numberFormatter.format(Math.round(row.value))}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell 
              colSpan={2} 
              align="right" 
              sx={{ 
                backgroundColor: 'yellow', 
                fontWeight: 'bold', 
                fontSize: headerFooterFontSize 
              }}
            >
              {t('outputForm1.footer', { total: formattedTotal })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm_1;