import React, { useState } from 'react';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Box } from '@mui/material';
import ComparisonPopup from './ComparisonPopup';

const OutputForm_3 = ({ processedData, numberOfYears, numberOfYearAccMP, finalNotionalAmount, age, currencyRate,setFinalNotionalAmount }) => {
  // State for age selections and currency inputs
  const [age1, setAge1] = useState(65);
  const [age2, setAge2] = useState(85);
  const [currency1, setCurrency1] = useState('');
  const [currency2, setCurrency2] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  // Handlers for popup
  const handleOpenPopup = () => setOpenPopup(true);
  const handleClosePopup = () => setOpenPopup(false);
  const reset = () => {
    if (window.confirm('確定要重設表單嗎？所有輸入將被清除。')) {
      setFinalNotionalAmount(null);
      setAge1(65);
      setAge2(85);
      setCurrency1('');
      setCurrency2('');
    }
  };

  // Generate age options from 18 to 100
  const ageOptions = Array.from({ length: 100 - 18 + 1 }, (_, i) => 18 + i);

  return (
    <Box>
      {/* First Line: Age1 Dropdown and Currency1 Input */}
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel>歲</InputLabel>
        <Select value={age1} onChange={(e) => setAge1(e.target.value)}>
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="戶口價值: HKD $"
        type="number"
        value={currency1}
        onChange={(e) => setCurrency1(e.target.value)}
        sx={{ m: 1, width:180 }}
      />

      {/* Second Line: Age2 Dropdown and Currency2 Input */}
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel>歲</InputLabel>
        <Select value={age2} onChange={(e) => setAge2(e.target.value)}>
          {ageOptions.map((age) => (
            <MenuItem key={age} value={age}>
              {age}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="戶口價值: HKD $"
        type="number"
        value={currency2}
        onChange={(e) => setCurrency2(e.target.value)}
        sx={{ m: 1, width:180 }}
      />

      {/* Compare Button */}
      <Button variant="contained" onClick={handleOpenPopup} sx={{ m: 1 }}>
        馬上比較
      </Button>
      
      <Button 
          variant="contained" 
          onClick={reset} 
          sx={{ 
            m: 1, 
            backgroundColor: 'error.main',
            '&:hover': {
              backgroundColor: 'error.dark',
            }
          }}
        >
          重設表單
        </Button>
      
      {/* Popup Component */}
      <ComparisonPopup
        open={openPopup}
        onClose={handleClosePopup}
        age1={age1}
        age2={age2}
        currency1={currency1}
        currency2={currency2}
        processedData={processedData}
        numberOfYears={numberOfYears}
        numberOfYearAccMP={numberOfYearAccMP}
        finalNotionalAmount={finalNotionalAmount}
        age={age}
        currencyRate={currencyRate}
      />
    </Box>
  );
};

export default OutputForm_3;