import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const OutputTable = ({ processData, numberOfYears, selectedCurrency }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#956251' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{t('Year')}</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{t('Age')}</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{t('Expense in USD')}</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{t('Acc Expense in USD')}</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{t(`accExpense.${selectedCurrency}`)}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ p: 0, color: 'white'}}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {expanded && processData.length > 0 && (
          <TableBody>
            {processData.map((row) => {
              const isDecade = row.age % 10 === 0;
              const isFinalYear = row.year === numberOfYears + 1;

              return (
                <TableRow key={row.year}>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell sx={{
                    backgroundColor: isFinalYear ? '#E5A23EFF' : 'inherit',
                    fontWeight: isFinalYear ? 600 : 'normal',
                    color: isFinalYear ? '#ffffff' : '#111111'
                  }}>
                    {numberFormatter.format(row.expenseInUSD)}
                  </TableCell>
                  <TableCell sx={{
                    backgroundColor: isDecade ? '#8E8D8DFF' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal',
                    color: isDecade ? '#ffffff' : '#111111'
                  }}>
                    {numberFormatter.format(row.accExpenseInUSD)}
                  </TableCell>
                  <TableCell sx={{
                    backgroundColor: isDecade ? '#1E1414FF' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal',
                    color: isDecade ? '#ffffff' : '#111111'
                  }}>
                    {numberFormatter.format(row.accExpenseInCurrency)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default OutputTable;