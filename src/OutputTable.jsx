import React, { useState, useMemo } from 'react';
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

const OutputTable = ({ 
  outputData, 
  currencyRate, 
  numberOfYears, 
  useInflation,
  inflationRate 
}) => {
  const [expanded, setExpanded] = useState(true);

  const processedData = useMemo(() => {
    if (!outputData.length) return [];
    
    // Use reduce to properly handle sequential inflation calculations
    return outputData.reduce((acc, current, index) => {
      if (index === 0 || !useInflation) {
        // First year or inflation disabled
        return [...acc, current];
      }
      
      // Get previous year's premium from processed data
      const previousPremium = acc[index - 1].medicalPremium;
      const inflatedPremium = previousPremium * (1 + inflationRate / 100);
      
      return [
        ...acc,
        {
          ...current,
          medicalPremium: inflatedPremium
        }
      ];
    }, []);
  }, [outputData, useInflation, inflationRate]);

  const calculateAccMP = (data, index) => {
    return data.slice(0, index + 1).reduce((sum, item) => sum + item.medicalPremium, 0);
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Year</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Medical Premium</TableCell>
            <TableCell>Acc MP</TableCell>
            <TableCell>Acc MP USD</TableCell>
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
            {processedData.map((row, index) => {
              const isDecade = row.yearNumber % 10 === 0;
              const isFinalYear = row.yearNumber === numberOfYears + 1;
              const accumulatedMP = calculateAccMP(processedData, index);
              
              return (
                <TableRow key={row.yearNumber}>
                  <TableCell>{row.yearNumber}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: isFinalYear ? '#ffebee' : 'inherit',
                    fontWeight: isFinalYear ? 600 : 'normal'
                  }}>
                    {row.medicalPremium.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: isDecade ? '#f5f5f5' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal'
                  }}>
                    {accumulatedMP.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: isDecade ? '#f5f5f5' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal'
                  }}>
                    {(accumulatedMP / currencyRate).toFixed(2)}
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