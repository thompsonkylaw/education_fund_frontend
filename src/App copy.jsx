import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';
import Login from './Login';
import Input from './Input';
import UseInflation from './UseInflation';
import OutputTable from './OutputTable';
import OutputForm from './OutputForm';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const App = () => {
  const IsProduction = true;
  const { t } = useTranslation();

  // State declarations
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  const [useInflation, setUseInflation] = useState(false);
  
  // Initialize inputs state with a function that checks localStorage
  const [inputs, setInputs] = useState(() => {
    const savedInputs = localStorage.getItem('inputs');
    return savedInputs
      ? JSON.parse(savedInputs)
      : {
          year: '2025',
          plan: 'Smart',
          age: 40,
          deductible: 22800,
          numberOfYears: 15,
          inflationRate: 6,
          currencyRate: 7.85
        };
  });

  const [outputData, setOutputData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [numberOfYearAccMP, setNumberOfYearAccMP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save appBarColor to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  // Fetch data based on input values
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let serverURL;
        IsProduction
          ? (serverURL = 'https://fastapi-production-a20ab.up.railway.app')
          : (serverURL = 'http://localhost:9002');
        const response = await axios.post(serverURL + '/getData', {
          year: inputs.year,
          plan: inputs.plan,
          age: inputs.age,
          deductible: inputs.deductible,
          numberOfYears: inputs.numberOfYears
        });
        setOutputData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inputs.year, inputs.plan, inputs.age, inputs.deductible, inputs.numberOfYears]);

  // Process data with inflation if applicable
  useEffect(() => {
    if (outputData.length === 0) return;

    let accumulatedMP = 0;
    const processed = [];

    for (let i = 0; i < outputData.length; i++) {
      const item = outputData[i];
      let medicalPremium = item.medicalPremium;

      if (i > 0 && useInflation) {
        medicalPremium = processed[i - 1].medicalPremium * (1 + inputs.inflationRate / 100);
      }

      accumulatedMP += medicalPremium;
      processed.push({
        ...item,
        medicalPremium: medicalPremium,
        accumulatedMP: accumulatedMP
      });
    }

    setProcessedData(processed);
    const finalYearData = processed.find(item => item.yearNumber === inputs.numberOfYears);
    setNumberOfYearAccMP(finalYearData?.accumulatedMP || 0);
  }, [outputData, useInflation, inputs.inflationRate, inputs.numberOfYears]);

  // Save inputs to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem('inputs', JSON.stringify(inputs));
  }, [inputs]);

  // Handler functions for updating specific input fields
  const handleInflationRateChange = (value) => {
    setInputs(prev => ({ ...prev, inflationRate: value }));
  };

  const handleCurrencyRateChange = (value) => {
    setInputs(prev => ({ ...prev, currencyRate: value }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          backgroundColor: appBarColor,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {
              window.location.href = "https://portal.aimarketings.io/tool-list/";
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            {t('Medical Financial Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 10, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Column - Input Form and Results */}
          <Grid item xs={12} md={8}>
            <Input
              inputs={inputs}
              setInputs={setInputs}
              appBarColor={appBarColor}
            />

            {/* Loading and Results Section */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {!loading && !error && processedData.length > 0 && (
              <OutputTable
                outputData={processedData}
                currencyRate={inputs.currencyRate}
                numberOfYears={inputs.numberOfYears}
              />
            )}
          </Grid>

          {/* Right Column - Financial Adjustments and Total */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <UseInflation
                inflationRate={inputs.inflationRate}
                currencyRate={inputs.currencyRate}
                useInflation={useInflation}
                setUseInflation={setUseInflation}
                onInflationRateChange={handleInflationRateChange}
                onCurrencyRateChange={handleCurrencyRateChange}
                processedData={processedData}
                inputs={inputs}
                numberOfYearAccMP={numberOfYearAccMP}
              />
            </Card>

            <Card elevation={3} sx={{ mt: 2, p: 2 }}>
              <OutputForm
                numberOfYears={inputs.numberOfYears}
                numberOfYearAccMP={numberOfYearAccMP}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Uncomment if Login component is needed */}
        <Login 
          processedData={processedData} 
          inputs={inputs} 
          numberOfYearAccMP={numberOfYearAccMP}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;