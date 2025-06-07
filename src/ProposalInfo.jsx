import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ProposalInfo = ({ open, onClose, cashValueInfo, selectedCurrency, proposal }) => {
  const { t } = useTranslation();
  console.log("cashValueTable=\n", cashValueInfo.cashValueTable);
  const currencyRate = proposal.target.currencyRate;
  const age = proposal.target.age;
  const numberOfPayments = proposal.target.numberOfYears;
  const annualPremiumClean = String(cashValueInfo.annual_premium).replace(/,/g, '');
  const annualPremium = parseFloat(annualPremiumClean);
  const cashValueTable = cashValueInfo.cashValueTable;

  const inputs = proposal.inputs.map(item => ({
    expenseType: item.expenseType,
    fromAge: Number(item.fromAge),
    toAge: Number(item.toAge),
    yearlyWithdrawalAmount: parseFloat(String(item.yearlyWithdrawalAmount).replace(/,/g, '')),
}));

  const firstTableData = cashValueInfo.firstTable_data || [];

  // Parse cashValueTable into an array of rows
  const cashValueRows = cashValueTable ? cashValueTable.split('\n') : [];

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'HKD':
        return 'HK$';
      case 'RMB':
        return '¥';
      default:
        return '';
    }
  };

  const currencySymbol = getCurrencySymbol(selectedCurrency);
  const startingAge = firstTableData.length > 0 ? firstTableData[0][0] : 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* <DialogTitle>{t('proposalInfo.title')}</DialogTitle> */}
      <DialogContent>
        {/* Summary Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#956251' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('common.age')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('proposalInfo.numberOfPayments')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.annualPremium')} ({'美元'})</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.totalPremiumsPaidUpToYear')} ({'美元'})</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#efeae9' }}>
                <TableCell sx={{ fontSize: '1.2rem' }}>{age}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }}>{numberOfPayments}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(annualPremium)}</TableCell>
                <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(annualPremium * numberOfPayments)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* First Table */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ddd3d0' }}>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>{t('proposalInfo.age')}</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.cashValue')} ({'美元'})</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.profitFactor')}</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }} align="right">{t('proposalInfo.irr')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {firstTableData.map((row, index) => {
                const year = row[0];
                let adjustedYear;
                let displayAge;

                if (typeof year === 'string' && year.startsWith('@ANB')) {
                  const extractedNumber = parseInt(year.replace('@ANB', '').trim(), 10);
                  if (isNaN(extractedNumber)) {
                    console.error('Invalid number in @ANB format');
                    adjustedYear = NaN;
                    displayAge = 'Invalid';
                  } else {
                    adjustedYear = extractedNumber - age;
                    displayAge = `${adjustedYear} @ANB ${extractedNumber} ${t('outputForm3.ageLabel')}`;
                  }
                } else {
                  adjustedYear = parseInt(year, 10);
                  if (isNaN(adjustedYear)) {
                    console.error('Invalid year: not a number');
                    displayAge = 'Invalid';
                  } else {
                    displayAge = String(adjustedYear);
                  }
                }
                const cashValue = row[1];
                const cleanedValue = cashValue.replace(/,/g, '');
                const numberCashValue = parseFloat(cleanedValue);

                const totalPremiumsPaidUpToYear = annualPremium * Math.min(adjustedYear, numberOfPayments);
                const profitFactor = totalPremiumsPaidUpToYear > 0 ? numberCashValue / totalPremiumsPaidUpToYear : 0;

                let annualizedReturnPercent;
                if (adjustedYear > 0 && totalPremiumsPaidUpToYear > 0 && !isNaN(numberCashValue)) {
                  const ratio = numberCashValue / totalPremiumsPaidUpToYear;
                  if (ratio >= 0) {
                    const annualizedReturn = Math.pow(ratio, 1 / adjustedYear) - 1;
                    annualizedReturnPercent = (annualizedReturn * 100).toFixed(2) + '%';
                  } else {
                    annualizedReturnPercent = '-100.00%';
                  }
                } else {
                  annualizedReturnPercent = 'N/A';
                }

                return (
                  <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#efeae9' : '#ddd3d0' }}>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{displayAge}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{numberFormatter.format(numberCashValue)}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{profitFactor < 100 ? (profitFactor < 10 ? profitFactor.toFixed(2) : profitFactor.toFixed(1)) : profitFactor.toFixed(0)}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{annualizedReturnPercent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Second Table - Modified to loop through inputs */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#9b2d1f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }}>{t('proposalInfo.expenseType')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }}>{t('proposalInfo.ageRange')}</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }} align="right">{t('proposalInfo.yearlyWithdrawalAmount')} ({'美元'})</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }} align="right">{t('proposalInfo.sumOfWithdrawal')} ({'美元'})</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.4rem' }} align="right">{t('proposalInfo.lastYearWithdrawalCashValue')} ({'美元'})</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inputs.map((input, index) => {
                const expenseType = input.expenseType ? t(`expenseTypes.${input.expenseType}`) : ' ';
                // console.log("input.expenseType============", input.expenseType);
                const ageRange = (Number.isFinite(input.fromAge) && Number.isFinite(input.toAge)) ? `${input.fromAge} - ${input.toAge}` : ' ';
                // console.log("input.fromAge============", input.fromAge);
                // console.log("input.toAge============", input.toAge);
                const yearlyWithdrawalAmount = Number.isFinite(input.yearlyWithdrawalAmount) ? numberFormatter.format(input.yearlyWithdrawalAmount) : ' ';
                // console.log("input.yearlyWithdrawalAmount============", input.yearlyWithdrawalAmount);
                const numberOfYears = (Number.isFinite(input.fromAge) && Number.isFinite(input.toAge)) ? (input.toAge - input.fromAge + 1) : 0;
                // console.log("numberOfYears============", numberOfYears);
                const sumOfWithdrawal = Number.isFinite(input.yearlyWithdrawalAmount) && numberOfYears > 0 ? numberFormatter.format(input.yearlyWithdrawalAmount * numberOfYears) : '0';
                // console.log("input.yearlyWithdrawalAmount============", input.yearlyWithdrawalAmount);

                // Calculate lastYearCashValue using input.toAge - age + 1 as index
                let rowIndex
                if (input.toAge == 100){
                  rowIndex = '@ANB 101';
                }
                else {
                  rowIndex = String(input.toAge - age + 1);
                }
                // console.log("input.toAge============", input.toAge);
                // console.log("age============", age);
                // console.log("rowIndex============", rowIndex);
                let lastYearCashValue = '0';
                for (const row of cashValueRows) {
                  const columns = row.split('~');
                  // console.log("columns====",columns)
                  if (columns.length >= 2) {
                    const firstColumn = columns[0].trim();
                    // console.log("firstColumn====",firstColumn)
                    const target = String(rowIndex);
                    // console.log("target====",target)
                    // console.log("rowIndex====",rowIndex)
                    if (firstColumn === target) {
                      const lastColumn = columns[columns.length - 1].trim();
                      
                      // console.log("lastColumn============", lastColumn);
                     
                      const cashValueStr = lastColumn.replace(/,/g, '');
                      //  console.log("cashValueStr============", cashValueStr);
                      const cashValue = parseFloat(cashValueStr);
                      if (!isNaN(cashValue)) {
                        lastYearCashValue = numberFormatter.format(cashValue);
                        // console.log("lastYearCashValue============", lastYearCashValue);
                        break;
                      }
                    }
                  }
                }

                return (
                  <TableRow key={index} sx={{ backgroundColor: '#efeae9' }}>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{expenseType}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }}>{ageRange}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{yearlyWithdrawalAmount}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{sumOfWithdrawal}</TableCell>
                    <TableCell sx={{ fontSize: '1.2rem' }} align="right">{lastYearCashValue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposalInfo;