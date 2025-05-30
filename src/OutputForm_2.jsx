import React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Typography } from '@mui/material';

const OutputForm_2 = ({ proposal, finalNotionalAmount, numOfRowInOutputForm_1, fontSizeMultiplier = 1,cashValueInfo }) => {
  const { t } = useTranslation();
  

  const currencyRate = proposal.target.currencyRate;
  // console.log("currencyRate=====================================================",currencyRate)

  const inputs = proposal.inputs.map(item => ({
        expenseType: item.expenseType,
        fromAge: item.fromAge,
        toAge: item.toAge,
        yearlyWithdrawalAmount: item.yearlyWithdrawalAmount,
  }));

  const age = proposal.target.age;
  const numberOfYears = proposal.target.numberOfYears;
  const processData = proposal.processData;
  let numberOfYearAccMP;
  console.log("processData======================================",processData);
  if (processData.length > 0) {
  
    numberOfYearAccMP = processData[numberOfYears -1 ].accExpenseInUSD;
    console.log("numberOfYearAccMP======================================",numberOfYearAccMP);
  }
  // console.log("numberOfYearAccMP======================================",numberOfYearAccMP);




  if (finalNotionalAmount === null) {
    return <Typography sx={{
          backgroundColor: 'rgb(231, 111, 81)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          padding: '10px',
          textAlign: 'center',
        }}>{t('outputForm2.placeholder')}</Typography>;
  }

  // const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount) : 0;
  const finalNotionalAmountNum = finalNotionalAmount ? parseFloat(finalNotionalAmount.replace(/,/g, '')) : 0;
  // const totalCost = numberOfYearAccMP + finalNotionalAmountNum * currencyRate;
  console.log("cashValueInfo.annual_premium======================================",cashValueInfo.annual_premium);
  const totalCost = numberOfYearAccMP +  cashValueInfo.annual_premium * numberOfYears;
  console.log("totalCost======================================",totalCost);
  const averageMonthly = totalCost / numberOfYears / 12;
  console.log("averageMonthly======================================",averageMonthly);
  const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formattedTotalCost = formatter.format(Math.round(totalCost));
  const formattedAverageMonthly = formatter.format(Math.round(averageMonthly));
  // console.log("finalNotionalAmountNum",finalNotionalAmountNum);
  // console.log("finalNotionalAmount",finalNotionalAmount);
  // console.log("numberOfYearAccMP",numberOfYearAccMP);
  // console.log("totalCost",totalCost);
  // console.log("averageMonthly",averageMonthly);
  // console.log("numberOfYears",numberOfYears);
  // console.log("formattedTotalCost",formattedTotalCost);
  console.log("formattedAverageMonthly",formattedAverageMonthly);

  const rows = [];
  const firstRowEndAge = parseInt(age) + parseInt(numberOfYears) - 1;
  // console.log("firstRowEndAge111",firstRowEndAge)
  const firstRowValue = t('outputForm2.firstRowValue', { premiumPaymentPeriod: numberOfYears, averageMonthly: formattedAverageMonthly });
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