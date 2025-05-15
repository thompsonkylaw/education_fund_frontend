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
import Input from './Input';
import Input_2 from './Input_2';
import UseInflation from './UseInflation';
import OutputTable from './OutputTable';
import OutputForm_1 from './OutputForm_1';
import OutputForm_2 from './OutputForm_2';
import OutputForm_3 from './OutputForm_3';
import LanguageSwitch from './LanguageSwitch';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const App = () => {
  const IsProduction = true;
  const { t } = useTranslation();

  // State declarations
  const [company, setCompany] = useState(localStorage.getItem('company'));
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');
  const [useInflation, setUseInflation] = useState(false);
  const [plan1Inputs, setPlan1Inputs] = useState(() => {
    const savedInputs = localStorage.getItem('plan1Inputs');
    const defaultInputs = {
      company: company,
      plan: "晉悅自願醫保靈活計劃",
      planCategory: "智選",
      effectiveDate: "2024-12-29",
      currency: "HKD",
      sexuality: "na",
      ward: "na",
      planOption: "22,800港元",
      age: 40,
      numberOfYears: 15,
      inflationRate: 6,
      currencyRate: 7.85,
      planFileName: "晉悅自願醫保靈活計劃_智選_2024-12-29_HKD_na_na"
    };
    return savedInputs ? { ...defaultInputs, ...JSON.parse(savedInputs) } : defaultInputs;
  });
  
  const [plan2Inputs, setPlan2Inputs] = useState(null);
  const [showSecondPlan, setShowSecondPlan] = useState(false);
  const [outputData1, setOutputData1] = useState([]);
  const [outputData2, setOutputData2] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [numberOfYearAccMP, setNumberOfYearAccMP] = useState(0);
  const [numOfRowInOutputForm_1, setNumOfRowInOutputForm_1] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finalNotionalAmount, setFinalNotionalAmount] = useState(null);
  const [cashValueInfo, setCashValueInfo] = useState({
    age_1: 65,
    age_2: 85,
    age_1_cash_value: 0,
    age_2_cash_value: 0,
    annual_premium: 0
  });
  const [clientInfo, setClientInfo] = useState({
    surname: "VIP",
    givenName: "VIP",
    chineseName: "",
    basicPlan: '宏摯傳承保障計劃(GS)',
    // basicPlan: '赤霞珠終身壽險計劃2 基本(LV2)',
    premiumPaymentPeriod: '15',
    basicPlanCurrency: '美元'
  });

  // Save appBarColor to localStorage
  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  // Save company to localStorage
  useEffect(() => {
    localStorage.setItem('company', company);
  }, [company]);

  // Initialize or sync plan2Inputs
  useEffect(() => {
    if (showSecondPlan) {
      if (!plan2Inputs) {
        setPlan2Inputs({
          company: company,
          plan: "晉悅自願醫保靈活計劃",
          planCategory: "智選",
          effectiveDate: "2024-12-29",
          currency: "HKD",
          sexuality: "na",
          ward: "na",
          planOption: "22,800港元",
          age: plan1Inputs.age,
          numberOfYears: plan1Inputs.numberOfYears,
          inflationRate: plan1Inputs.inflationRate,
          currencyRate: plan1Inputs.currencyRate,
          planFileName: "晉悅自願醫保靈活計劃_智選_2024-12-29_HKD_na_na"
        });
      } else {
        setPlan2Inputs(prev => ({ ...prev, age: plan1Inputs.age, numberOfYears: plan1Inputs.numberOfYears }));
      }
    } else {
      setPlan2Inputs(null);
      setOutputData2([]);
    }
  }, [showSecondPlan, plan1Inputs.age, plan1Inputs.numberOfYears]);

  // Fetch data for Plan 1
  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const serverURL = IsProduction
            ? 'https://fastapi-production-a20ab.up.railway.app'
            : 'http://localhost:9005';
          const response = await axios.post(serverURL + '/getData', {
            company: company,
            planFileName: plan1Inputs.planFileName,
            age: plan1Inputs.age,
            planOption: plan1Inputs.planOption,
            numberOfYears: plan1Inputs.numberOfYears
          });
          setOutputData1(response.data);
        } catch (err) {
          setError(err.response?.data?.detail || 'Failed to fetch data for Plan 1');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [plan1Inputs.company, plan1Inputs.planFileName, plan1Inputs.age, plan1Inputs.planOption, plan1Inputs.numberOfYears]);

  // Fetch data for Plan 2
  useEffect(() => {
    if (showSecondPlan && plan2Inputs) {
      const timer = setTimeout(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            setError(null);
            const serverURL = IsProduction
              ? 'https://fastapi-production-a20ab.up.railway.app'
              : 'http://localhost:9005';
            const response = await axios.post(serverURL + '/getData', {
              company: plan2Inputs.company,
              planFileName: plan2Inputs.planFileName,
              age: plan2Inputs.age,
              planOption: plan2Inputs.planOption,
              numberOfYears: plan2Inputs.numberOfYears
            });
            setOutputData2(response.data);
          } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch data for Plan 2');
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [showSecondPlan, plan2Inputs]);

  // Process data for both plans and calculate cashValueInfo
  useEffect(() => {
    if (outputData1.length === 0) {
      setProcessedData([]);
      setNumberOfYearAccMP(0);
      setNumOfRowInOutputForm_1(0);
      setCashValueInfo({
        age_1: 65,
        age_2: 85,
        age_1_cash_value: 0,
        age_2_cash_value: 0
      });
      return;
    }

    const processData = (data, inflationRate) => {
      let accumulatedMP = 0;
      const processed = [];
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let medicalPremium = item.medicalPremium;
        if (i > 0 && useInflation) {
          medicalPremium = processed[i - 1].medicalPremium * (1 + inflationRate / 100);
        }
        accumulatedMP += medicalPremium;
        processed.push({
          ...item,
          medicalPremium,
          accumulatedMP
        });
      }
      return processed;
    };

    const processed1 = processData(outputData1, plan1Inputs.inflationRate);
    let combinedData;

    if (showSecondPlan && outputData2.length > 0 && outputData2.length === outputData1.length) {
      const processed2 = processData(outputData2, plan1Inputs.inflationRate);
      combinedData = processed1.map((row1, index) => {
        const row2 = processed2[index];
        return {
          yearNumber: row1.yearNumber,
          age: row1.age,
          medicalPremium1: row1.medicalPremium,
          medicalPremium2: row2.medicalPremium,
          medicalPremium: row1.medicalPremium + row2.medicalPremium,
          accumulatedMP: row1.accumulatedMP + row2.accumulatedMP
        };
      });
    } else {
      combinedData = processed1;
    }

    // Calculate number of rows for OutputForm_1
    let lastEndAge = plan1Inputs.age - 1;
    let rowCount = 0;
    while (lastEndAge < 100) {
      const rowStart = lastEndAge + 1;
      if (rowStart > 100) break;
      const rowEnd = Math.min(rowStart + 9, 100);
      if (!combinedData.some(item => item.age === rowEnd)) break;
      rowCount++;
      lastEndAge = rowEnd;
    }
    setNumOfRowInOutputForm_1(rowCount);

    setProcessedData(combinedData);
    const finalYearData = combinedData.find(item => item.yearNumber === plan1Inputs.numberOfYears);
    setNumberOfYearAccMP(finalYearData?.accumulatedMP || 0);

    // Update cashValueInfo based on processed data
    const age1Data = combinedData.find(item => item.age === 65);
    const age2Data = combinedData.find(item => item.age === 85);
    setCashValueInfo({
      age_1: 65,
      age_2: 85,
      age_1_cash_value: age1Data ? age1Data.accumulatedMP : 0,
      age_2_cash_value: age2Data ? age2Data.accumulatedMP : 0
    });
  }, [outputData1, outputData2, useInflation, plan1Inputs.inflationRate, showSecondPlan, plan1Inputs.numberOfYears, plan1Inputs.age]);

  // Save plan1Inputs to localStorage
  useEffect(() => {
    localStorage.setItem('plan1Inputs', JSON.stringify(plan1Inputs));
  }, [plan1Inputs]);

  // Handlers
  const handleInflationRateChange = (value) => {
    setPlan1Inputs(prev => ({ ...prev, inflationRate: value }));
  };

  const handleCurrencyRateChange = (value) => {
    setPlan1Inputs(prev => ({ ...prev, currencyRate: value }));
  };

  const onToggleSecondPlan = () => {
    setShowSecondPlan(prev => !prev);
  };
  
  console.log('company',company)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: '100%', backgroundColor: appBarColor }}
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
          <Grid item xs={12} md={8}>
            <Input
              inputs={plan1Inputs}
              setInputs={setPlan1Inputs}
              appBarColor={appBarColor}
              disabled={finalNotionalAmount !== null}
              showSecondPlan={showSecondPlan}
              onToggleSecondPlan={onToggleSecondPlan}
            />
            {showSecondPlan && plan2Inputs && (
              <Box sx={{ mt: 2 }}>
                <Input_2
                  inputs={plan2Inputs}
                  setInputs={setPlan2Inputs}
                  appBarColor={appBarColor}
                  disabled={finalNotionalAmount !== null}
                />
              </Box>
            )}
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
                currencyRate={plan1Inputs.currencyRate}
                numberOfYears={plan1Inputs.numberOfYears}
              />
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ p: 2 }}>
              <UseInflation
                inflationRate={plan1Inputs.inflationRate}
                currencyRate={plan1Inputs.currencyRate}
                useInflation={useInflation}
                setUseInflation={setUseInflation}
                onInflationRateChange={handleInflationRateChange}
                onCurrencyRateChange={handleCurrencyRateChange}
                processedData={processedData}
                inputs={plan1Inputs}
                numberOfYearAccMP={numberOfYearAccMP}
                setFinalNotionalAmount={setFinalNotionalAmount}
                disabled={finalNotionalAmount !== null}
                cashValueInfo={cashValueInfo}
                setCashValueInfo={setCashValueInfo}
                clientInfo={clientInfo}
                setClientInfo={setClientInfo}
                company={company}
              />
            </Card>
            <Card elevation={3} sx={{ mt: 2, p: 2 }}>
              <OutputForm_1
                processedData={processedData}
                age={plan1Inputs.age}
                currencyRate={plan1Inputs.currencyRate}
                numOfRowInOutputForm_1={numOfRowInOutputForm_1}
              />
            </Card>
            <Card elevation={3} sx={{ mt: 2, p: 2 }}>
              <OutputForm_2
                numberOfYears={clientInfo.premiumPaymentPeriod}
                numberOfYearAccMP={numberOfYearAccMP}
                finalNotionalAmount={finalNotionalAmount}
                age={plan1Inputs.age}
                currencyRate={plan1Inputs.currencyRate}
                numOfRowInOutputForm_1={numOfRowInOutputForm_1}
                cashValueInfo={cashValueInfo}
              />
            </Card>
            {finalNotionalAmount && (
                <Card elevation={3} sx={{ mt: 2, p: 2 }}>
                <OutputForm_3
                  processedData={processedData}
                  numberOfYears={plan1Inputs.numberOfYears}
                  numberOfYearAccMP={numberOfYearAccMP}
                  finalNotionalAmount={finalNotionalAmount}
                  age={plan1Inputs.age}
                  currencyRate={plan1Inputs.currencyRate}
                  setFinalNotionalAmount={setFinalNotionalAmount}
                  numOfRowInOutputForm_1={numOfRowInOutputForm_1}
                  cashValueInfo={cashValueInfo}
                  plan1Inputs={plan1Inputs}
                  plan2Inputs={plan2Inputs}
                  clientInfo={clientInfo}
                />
              </Card>
            )}
            <Box sx={{ mt: 2 }}>
              <LanguageSwitch 
                setAppBarColor={setAppBarColor}
                appBarColor={appBarColor}
                setCompany={setCompany}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;