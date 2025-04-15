import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Typography } from '@mui/material';

const OutputForm_2 = ({ age, numberOfYears, numberOfYearAccMP, finalNotionalAmount, currencyRate, fontSizeMultiplier = 1 }) => {
  // Check if finalNotionalAmount is null; if so, show a placeholder message
  if (finalNotionalAmount === null) {
    return <Typography>請先完成登錄以獲取名義金額</Typography>;
  }

  // Convert finalNotionalAmount to a number, default to 0 if invalid
  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;

  // Calculate total cost and average monthly cost for the first row
  const totalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;
  const averageMonthly = totalCost / numberOfYears / 12;

  // Format numbers with commas and no decimal places
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedTotalCost = formatter.format(Math.round(totalCost));
  const formattedAverageMonthly = formatter.format(Math.round(averageMonthly));

  // Initialize rows for the table body
  const rows = [];

  // First row: From age to (age + numberOfYears - 1)
  const firstRowEndAge = age + numberOfYears - 1;
  rows.push({
    ageRange: `${age} - ${firstRowEndAge} 歲`,
    value: `首${numberOfYears}年平均每月 HKD $ ${formattedAverageMonthly}`,
  });

  // Start generating subsequent rows
  let lastRowLastAge = firstRowEndAge;

  // Add rows until we reach or exceed age 100
  while (lastRowLastAge < 100) {
    if (lastRowLastAge + 1 < 90) {
      // Add a 10-year range row
      const startAge = lastRowLastAge + 1;
      const endAge = lastRowLastAge + 10;
      rows.push({
        ageRange: `${startAge} - ${endAge} 歲`,
        value: "HKD $ -",
      });
      lastRowLastAge = endAge;
    } else {
      // Add the final row from (lastRowLastAge + 1) to 100
      const startAge = lastRowLastAge + 1;
      rows.push({
        ageRange: `${startAge} - 100 歲`,
        value: "HKD $ -",
      });
      lastRowLastAge = 100; // Exit the loop
    }
  }

  // Define font sizes with multiplier
  const baseFontSize = 1;    // Default body font size in rem
  const headerFontSize = 1.5; // Default header/footer font size in rem
  const cellFontSize = `${baseFontSize * fontSizeMultiplier}rem`;
  const headerFooterFontSize = `${headerFontSize * fontSizeMultiplier}rem`;

  // Render the table
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
                backgroundColor: 'orange', 
                fontWeight: 'bold', 
                fontSize: headerFooterFontSize 
              }}
            >
              醫療融資保費
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
                {row.value}
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
              {`總成本: HKD $ ${formattedTotalCost}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm_2;