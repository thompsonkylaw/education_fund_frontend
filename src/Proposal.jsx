import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import Target from './Target';
import Input from './Input';
import OutputTable from './OutputTable';
import { useTranslation } from 'react-i18next';

const Proposal = ({ proposalIndex, 
                    target, 
                    inputs, 
                    processData, 
                    updateTarget, 
                    addInput, 
                    removeInput, 
                    updateInput, 
                    inflationRate, 
                    currencyRate, 
                    useInflation, 
                    setProcessData,
                    disabled
  }) => {
  const { t } = useTranslation();

  const numberOfYears = target.numberOfYears;

  // Function to parse the yearlyWithdrawalAmount string (e.g., "1,000,000") into a number
  const parseAmount = (str) => {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, '')) || 0;
  };

  // Compute processData whenever dependencies change
  useEffect(() => {
    const rows = [];
    let accExpenseInUSD = 0;

    for (let age = target.age; age <= 100; age++) {
      const year = age - target.age + 1;
      let baseExpenseInUSD = 0;

      inputs.forEach(input => {
        const fromAge = parseInt(input.fromAge, 10);
        const toAge = parseInt(input.toAge, 10);
        const amount = parseAmount(input.yearlyWithdrawalAmount);
        if (age >= fromAge && age <= toAge) {
          baseExpenseInUSD += amount;
        }
      });

      let expenseInUSD = baseExpenseInUSD;
      if (useInflation && inflationRate > 0) {
        const yearsFromStart = age - target.age;
        expenseInUSD = baseExpenseInUSD * Math.pow(1 + inflationRate / 100, yearsFromStart);
      }

      accExpenseInUSD += expenseInUSD;
      const accExpenseInHKD = accExpenseInUSD * currencyRate;

      rows.push({
        year,
        age,
        expenseInUSD,
        accExpenseInUSD,
        accExpenseInHKD
      });
    }

    setProcessData(proposalIndex, rows);
  }, [target, inputs, inflationRate, currencyRate, useInflation, proposalIndex, setProcessData]);

  return (
    <Card elevation={1} sx={{ position: 'relative', minHeight: 180, mt: proposalIndex > 0 ? 2 : 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('Proposal')} {proposalIndex + 1}
        </Typography>
        <Target 
          target={target} 
          updateTarget={updateTarget}
          disabled={disabled}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <IconButton onClick={addInput} disabled={inputs.length >= 4}>
            <AddIcon />
          </IconButton>
          <IconButton onClick={removeInput} disabled={inputs.length <= 1}>
            <RemoveIcon />
          </IconButton>
        </Box>
        {inputs.map((input, inputIndex) => (
          <Input
            key={inputIndex}
            input={input}
            updateInput={(newInput) => updateInput(inputIndex, newInput)}
            disabled={disabled}
          />
        ))}
        <OutputTable
          processData={processData}
          numberOfYears={numberOfYears}
        />
      </CardContent>
    </Card>
  );
};

export default Proposal;