import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Typography } from '@mui/material';

const OutputForm = ({ age, numberOfYears, numberOfYearAccMP, finalNotionalAmount, currencyRate }) => {
  // Check if finalNotionalAmount is null; if so, show a placeholder message
  if (finalNotionalAmount === null) {
    return <Typography>請先完成登錄以獲取名義金額</Typography>;
  }

  // Convert finalNotionalAmount to a number, default to 0 if invalid
  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;

  // Calculate total cost and average monthly cost
  const totalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;
  const averageMonthly = totalCost / numberOfYears / 12;

  // Format numbers with commas and no decimal places
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedTotalCost = formatter.format(Math.round(totalCost));
  const formattedAverageMonthly = formatter.format(Math.round(averageMonthly));

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
              sx={{ backgroundColor: 'orange', fontWeight: 'bold' }}
            >
              醫療融資保費
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          <TableRow>
            {/* Age range column */}
            <TableCell>
              {`${age} - ${age + numberOfYears - 1} 歲`}
            </TableCell>
            {/* Average monthly cost column */}
            <TableCell align="right">
              {`首${numberOfYears}年平均每月 HKD $ ${formattedAverageMonthly}`}
            </TableCell>
          </TableRow>
        </TableBody>

        {/* Footer */}
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={2}
              align="right"
              sx={{ backgroundColor: 'yellow', fontWeight: 'bold' }}
            >
              {`總成本: HKD $ ${formattedTotalCost}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm;