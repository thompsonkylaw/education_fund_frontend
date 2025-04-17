import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const OutputTable = ({ outputData, currencyRate, numberOfYears }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Medical Premium USD</TableCell>
            <TableCell>Acc MP USD</TableCell>
            <TableCell>Acc MP</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{ p: 0 }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        {expanded && (
          <TableBody>
            {outputData.map((row) => {
              const isDecade = row.yearNumber % 10 === 0;
              const isFinalYear = row.yearNumber === numberOfYears;

              return (
                <TableRow key={row.yearNumber}>
                  <TableCell>{row.yearNumber}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell sx={{
                    backgroundColor: isFinalYear ? '#E5A23EFF' : 'inherit',
                    fontWeight: isFinalYear ? 600 : 'normal',
                    color: isFinalYear ? '#ffffff' : '#111111'
                  }}>
                    {row.medicalPremium2 !== undefined
                      ? `${numberFormatter.format(row.medicalPremium / currencyRate)} = ${numberFormatter.format(row.medicalPremium1 / currencyRate)} + ${numberFormatter.format(row.medicalPremium2 / currencyRate)}`
                      : numberFormatter.format(row.medicalPremium / currencyRate)}
                  </TableCell>
                  <TableCell sx={{
                    backgroundColor: isDecade ? '#8E8D8DFF' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal',
                    color: isDecade ? '#ffffff' : '#111111'
                  }}>
                    {numberFormatter.format(row.accumulatedMP / currencyRate)}
                  </TableCell>
                  <TableCell sx={{
                    backgroundColor: isDecade ? '#1E1414FF' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal',
                    color: isDecade ? '#ffffff' : '#111111'
                  }}>
                    {numberFormatter.format(row.accumulatedMP)}
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