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

const OutputForm_1 = ({ processedData, age, currencyRate, fontSizeMultiplier = 1 }) => {
  // Starting age from props
  const startAge = age;

  // Create a map of age to accumulatedMP for efficient lookup
  const ageToAccMP = {};
  processedData.forEach(row => {
    ageToAccMP[row.age] = row.accumulatedMP; // Assuming accumulatedMP is in HKD
  });

  // Generate decade end ages (e.g., 64, 74, 84, 94, 100 for startAge=55)
  const decadeEndAges = [];
  let currentAge = startAge + 9; // First decade ends at startAge + 9
  while (currentAge <= 100) {
    if (currentAge in ageToAccMP) {
      decadeEndAges.push(currentAge);
    }
    currentAge += 10;
  }
  // Ensure age 100 is included if not already
  if (decadeEndAges.length > 0 && decadeEndAges[decadeEndAges.length - 1] < 100 && 100 in ageToAccMP) {
    decadeEndAges.push(100);
  }

  // Generate table rows
  const rows = [];
  if (startAge + 9 in ageToAccMP) {
    // First row: e.g., "55-64 歲"
    const firstEndAge = startAge + 9;
    rows.push({
      ageRange: `${startAge} - ${firstEndAge} 歲`,
      value: ageToAccMP[firstEndAge],
    });

    // Track the last decade's accumulatedMP and end age
    let lastAccMP = ageToAccMP[firstEndAge];
    let lastEndAge = firstEndAge;

    // Subsequent rows
    for (let i = 0; i < decadeEndAges.length; i++) {
      const endAge = decadeEndAges[i];
      if (endAge > lastEndAge) {
        const rangeStart = lastEndAge + 1;
        const rangeEnd = endAge;
        const value = ageToAccMP[endAge] - lastAccMP;
        rows.push({
          ageRange: `${rangeStart} - ${rangeEnd} 歲`,
          value: value,
        });
        lastAccMP = ageToAccMP[endAge];
        lastEndAge = endAge;
      }
    }

    // If lastEndAge < 100, add a final row to 100
    if (lastEndAge < 100 && 100 in ageToAccMP) {
      const rangeStart = lastEndAge + 1;
      const rangeEnd = 100;
      const value = ageToAccMP[100] - lastAccMP;
      rows.push({
        ageRange: `${rangeStart} - ${rangeEnd} 歲`,
        value: value,
      });
    }
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
                backgroundColor: 'teal', 
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