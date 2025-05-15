import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose,setCompany }) => {
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e','#e67e22'];
  let companyName;

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    if (color === '#009739'){
      setCompany('Manulife')
      companyName = 'Manulife'
    }
    else if (color ===  '#E4002B'){
      setCompany('AIA')
    }
    else if (color ===  '#FFCD00'){
      setCompany('Sunlife')
    }
    else if (color ===  '#00008F'){
      setCompany('AXA')
    }
    else if (color ===  '#004A9F'){
      setCompany('Chubb')
    }
    else if (color ===  '#ed1b2e'){
      setCompany('Prudential')
    }
    else if (color ===  '#e67e22'){
      setCompany('FWD')
    }
    onClose(); // Close the dialog after selection
  };

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box>
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                color: color === '#FFCD00' ? 'black' : 'white', // Improve readability on yellow
                margin: '5px',
                minWidth: '80px',
              }}
            >
              {color}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </>
  );
};

export default Setting;