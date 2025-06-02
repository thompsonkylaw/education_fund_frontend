import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper } from '@mui/material';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const OutputForm_1 = ({ proposal, fontSizeMultiplier = 1, selectedCurrency }) => {
  const { t } = useTranslation();
  const currencyRate = proposal.target.currencyRate;
  const processData = proposal.processData || [];

  const inputs = proposal.inputs.map(item => ({
    expenseType: item.expenseType,
    fromAge: item.fromAge,
    toAge: item.toAge,
  }));

  const rows = inputs.map(input => {
    const fromAge = parseInt(input.fromAge, 10);
    const toAge = parseInt(input.toAge, 10);
    const sumInUSD = processData
      .filter(row => row.age >= fromAge && row.age <= toAge)
      .reduce((acc, row) => acc + row.expenseInUSD, 0);
    const sumInCurrency = sumInUSD * currencyRate;

    const displayExpenseType = input.expenseType ? t(`expenseTypes.${input.expenseType}`) : ' ';
    const displayAgeRange = (Number.isFinite(fromAge) && Number.isFinite(toAge)) ? `${fromAge} - ${toAge}` : ' ';
    const displaySum = Number.isFinite(sumInCurrency) ? `${t(`currency.${selectedCurrency}`)} ${numberFormatter.format(Math.round(sumInCurrency))}` : ' ';

    return {
      displayExpenseType,
      displayAgeRange,
      displaySum,
      sumInCurrency,
    };
  });

  const totalSumInCurrency = rows.reduce((acc, row) => acc + (Number.isFinite(row.sumInCurrency) ? row.sumInCurrency : 0), 0);
  const formattedTotal = numberFormatter.format(Math.round(totalSumInCurrency));

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
              {t('outputForm1.sumOfWithdrawal')} ({t(`currency.${selectedCurrency}`)})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{ fontSize: cellFontSize }}>
                {row.displayExpenseType}
              </TableCell>
              <TableCell sx={{ fontSize: cellFontSize }}>
                {row.displayAgeRange}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontSize: cellFontSize }}
              >
                {row.displaySum}
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
              {t('outputForm1.footer', { currency: t(`currency.${selectedCurrency}`), total: formattedTotal })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm_1;