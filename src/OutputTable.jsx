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

const OutputTable = ({ 
  outputData, 
  currencyRate, 
  numberOfYears
}) => {
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
              const isFinalYear = row.yearNumber === numberOfYears + 1;
              
              return (
                <TableRow key={row.yearNumber}>
                  <TableCell>{row.yearNumber}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: isFinalYear ? '#ffebee' : 'inherit',
                    fontWeight: isFinalYear ? 600 : 'normal'
                  }}>
                    {/* {row.medicalPremium.toFixed(2)} */}
                    {(row.medicalPremium / currencyRate).toFixed(0)}
                  </TableCell>
                  
                  <TableCell sx={{ 
                    backgroundColor: isDecade ? '#f5f5f5' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal'
                  }}>
                    {(row.accumulatedMP / currencyRate).toFixed(0)}
                  </TableCell>
                  <TableCell sx={{ 
                    backgroundColor: isDecade ? '#f5f5f5' : 'inherit',
                    fontWeight: isDecade ? 600 : 'normal'
                  }}>
                    {row.accumulatedMP.toFixed(0)}
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