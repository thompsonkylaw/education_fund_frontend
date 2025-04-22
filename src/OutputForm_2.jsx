import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Typography } from '@mui/material';

const OutputForm_2 = ({ age, numberOfYears, numberOfYearAccMP, finalNotionalAmount, currencyRate, numOfRowInOutputForm_1, fontSizeMultiplier = 1 }) => {
  const { t } = useTranslation();

  if (finalNotionalAmount === null) {
    return <Typography>{t('outputForm2.placeholder')}</Typography>;
  }

  // const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;
  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount.replace(/,/g, '')) : 0;
  const totalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;
  const averageMonthly = totalCost / numberOfYears / 12;

  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedTotalCost = formatter.format(Math.round(totalCost));
  const formattedAverageMonthly = formatter.format(Math.round(averageMonthly));
  console.log("finalNotionalAmountNum",finalNotionalAmountNum);
  console.log("finalNotionalAmount",finalNotionalAmount);
  console.log("numberOfYearAccMP",numberOfYearAccMP);
  console.log("totalCost",totalCost);
  console.log("averageMonthly",averageMonthly);
  console.log("numberOfYears",numberOfYears);
  console.log("formattedTotalCost",formattedTotalCost);
  console.log("formattedAverageMonthly",formattedAverageMonthly);

  const rows = [];
  const firstRowEndAge = age + numberOfYears - 1;
  const firstRowValue = t('outputForm2.firstRowValue', { numberOfYears, averageMonthly: formattedAverageMonthly });
  rows.push({
    ageRange: `${age} - ${firstRowEndAge} ${t('common.yearsOld')}`,
    value: firstRowValue,
  });

  let lastRowLastAge = firstRowEndAge;

  while (lastRowLastAge < 100) {
    if (lastRowLastAge + 1 <= 90) {
      const startAge = lastRowLastAge + 1;
      const endAge = Math.min(startAge + 9, 100);
      rows.push({
        ageRange: `${startAge} - ${endAge} ${t('common.yearsOld')}`,
        value: t('common.hkdZero'),
      });
      lastRowLastAge = endAge;
    } else {
      const startAge = lastRowLastAge + 1;
      rows.push({
        ageRange: `${startAge} - 100 ${t('common.yearsOld')}`,
        value: t('common.hkdZero'),
      });
      lastRowLastAge = 100;
    }
  }

  if (rows.length < numOfRowInOutputForm_1) {
    rows.push({
      ageRange: " - ",
      value: " - ",
    });
  }

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
                backgroundColor: 'rgb(244, 162, 97)', 
                fontWeight: 'bold', 
                fontSize: headerFooterFontSize 
              }}
            >
              {t('outputForm2.header')}
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
                {row.value}
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
              {t('outputForm2.footer', { total: formattedTotalCost })}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OutputForm_2;