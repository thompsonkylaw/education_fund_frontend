import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose }) => {
  const colors = ['#009739', '#E4002B', '#FFCD00', '#00008F', '#004A9F', '#ed1b2e'];

  const handleColorSelect = (color) => {
    setAppBarColor(color);
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