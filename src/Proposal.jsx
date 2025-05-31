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

    // Log target.age to verify its value
    // console.log(`Proposal ${proposalIndex + 1} - target.age =`, target.age);

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

    // Log the computed rows to inspect the first row
    // console.log(`Proposal ${proposalIndex + 1} - computed rows =`, rows);

    // Validate that the first row's age matches target.age
    if (rows.length > 0 && rows[0].age !== target.age) {
      console.error(
        `Proposal ${proposalIndex + 1} - Error: First row age (${rows[0].age}) does not match target.age (${target.age})`
      );
    }

    setProcessData(proposalIndex, rows);
  }, [target, inputs, inflationRate, currencyRate, useInflation, proposalIndex, setProcessData]);

  // Fix typo in console.log from "prcessData" to "processData"
  // console.log(`Proposal ${proposalIndex + 1} - processData =`, processData);

  return (
    <Card elevation={1} sx={{ position: 'relative', minHeight: 180, mt: proposalIndex > 0 ? 2 : 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('Proposal')} {proposalIndex + 1}
        </Typography>
        <Target 
          target={target} 
          updateTarget={updateTarget}
          disabled ={disabled}
         />
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <IconButton onClick={addInput} disabled={inputs.length >= 5}>
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
            disabled ={disabled}
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