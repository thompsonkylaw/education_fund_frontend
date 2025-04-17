import React from 'react';
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

// Number formatter for HKD values without decimal places
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const OutputForm_1 = ({ processedData, age, currencyRate, numOfRowInOutputForm_1, fontSizeMultiplier = 1 }) => {
  // Starting age from props
  const startAge = age;

  // Create a map of age to accumulatedMP for efficient lookup
  const ageToAccMP = {};
  processedData.forEach(row => {
    ageToAccMP[row.age] = row.accumulatedMP; // Assuming accumulatedMP is in HKD
  });

  // Generate table rows
  const rows = [];
  let lastEndAge = startAge - 1;
  let lastAccMP = 0;

  while (lastEndAge < 100) {
    const rowStart = lastEndAge + 1;
    if (rowStart > 100) break;
    const rowEnd = Math.min(rowStart + 9, 100);
    if (!(rowEnd in ageToAccMP)) break; // Safety check
    const ageRange = rowStart === rowEnd ? `${rowStart} 歲` : `${rowStart} - ${rowEnd} 歲`;
    const value = ageToAccMP[rowEnd] - lastAccMP;
    rows.push({
      ageRange,
      value,
    });
    lastAccMP = ageToAccMP[rowEnd];
    lastEndAge = rowEnd;
  }

  // Define font sizes with multiplier
  const baseFontSize = 1;    // Default body font size in rem
  const headerFontSize = 1.5; // Default header/footer font size in rem
  const cellFontSize = `${baseFontSize * fontSizeMultiplier}rem`;
  const headerFooterFontSize = `${headerFontSize * fontSizeMultiplier}rem`;

  return (
    <TableContainer component={Paper}>
      <Table>
        {/* Header */}
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
              傳統醫療保費
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
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

        {/* Footer */}
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
              {`總成本: HKD $ ${numberFormatter.format(Math.round(ageToAccMP[100]))}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm_1;