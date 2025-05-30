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

const OutputForm_1 = ({ proposal, fontSizeMultiplier = 1 }) => {
  const { t } = useTranslation();
  const currencyRate = proposal.target.currencyRate;

  const inputs = proposal.inputs.map(item => ({
    expenseType: item.expenseType,
    fromAge: item.fromAge,
    toAge: item.toAge,
    yearlyWithdrawalAmount: item.yearlyWithdrawalAmount,
  }));

  const rows = inputs.map(input => {
    const fromAge = parseInt(input.fromAge, 10);
    const toAge = parseInt(input.toAge, 10);
    const yearlyWithdrawalAmount = parseFloat(input.yearlyWithdrawalAmount.replace(/,/g, ''));
    const numberOfYears = toAge - fromAge + 1;
    const sumInUSD = yearlyWithdrawalAmount * numberOfYears;
    const sumInHKD = sumInUSD * currencyRate;
    const formattedSum = numberFormatter.format(Math.round(sumInHKD));
    const ageRange = `${fromAge} - ${toAge}`;
    return {
      expenseType: input.expenseType,
      ageRange,
      formattedSum: `HKD $ ${formattedSum}`,
      sumInHKD,
    };
  });

  const totalSumInHKD = rows.reduce((acc, row) => acc + row.sumInHKD, 0);
  const formattedTotal = numberFormatter.format(Math.round(totalSumInHKD));

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
              colSpan={3} 
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
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: cellFontSize }}>
              {t('outputForm1.expenseType')}
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: cellFontSize }}>
              {t('outputForm1.ageRange')}
            </TableCell>
            <TableCell 
              align="right" 
              sx={{ fontWeight: 'bold', fontSize: cellFontSize }}
            >
              {t('outputForm1.sumOfWithdrawal')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: cellFontSize }}>
                {t(`expenseTypes.${row.expenseType}`)}
              </TableCell>
              <TableCell sx={{ fontSize: cellFontSize }}>
                {row.ageRange}
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ fontSize: cellFontSize }}
              >
                {row.formattedSum}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell 
              colSpan={3} 
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