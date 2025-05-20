import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import manulifeSavingPlans from './dropdown/manulife/manulife_saving_plan.json';
import premiumPaymentPeriodOptions from './dropdown/manulife/premium_payment_period_options.json';

import { 
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  RadioGroup,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto'
};

function Login({ 
  open,
  onClose,
  processedData, 
  inputs, 
  numberOfYearAccMP,
  useInflation,
  setFinalNotionalAmount,
  disabled,
  cashValueInfo,
  setCashValueInfo,
  clientInfo,
  setClientInfo,
  company
}) {
  const IsProduction = true;
  
  const { t } = useTranslation();
  const [url, setUrl] = useState('https://api.hkprod.manulife.com.hk/ext/pos-qq-web-hkg-app/');
  const [username, setUsername] = IsProduction ? useState(() => localStorage.getItem('username') || '') : useState('CHANTSZLUNG');
  const [password, setPassword] = IsProduction ? useState(() => localStorage.getItem('password') || '') : useState('Ctsz_!376897');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [systemMessage, setSystemMessage] = useState('');
  const [newNotionalAmount, setNewNotionalAmount] = useState('');
  const [isCorporateCustomer, setIsCorporateCustomer] = useState(false);
  const [isPolicyHolder, setIsPolicyHolder] = useState(true);
  const [dob, setDob] = useState('');
  const [insuranceAge, setInsuranceAge] = useState('40');
  const [gender, setGender] = useState('Male');
  const [isSmoker, setIsSmoker] = useState(false);
  const [planCategory, setPlanCategory] = useState('全部');
  const [worryFreeOption, setWorryFreeOption] = useState('否');
  const [notionalAmount, setNotionalAmount] = useState('20000');
  const [premiumPaymentMethod, setPremiumPaymentMethod] = useState('每年');
  const [getPromotionalDiscount, setGetPromotionalDiscount] = useState(true);
  const [fromYear, setFromYear] = useState(inputs.numberOfYears + 1);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState('');
  const [annualWithdrawalAmount, setAnnualWithdrawalAmount] = useState(1000);
  const [proposalLanguage, setProposalLanguage] = useState("zh-HK");
  const [availablePaymentPeriods, setAvailablePaymentPeriods] = useState([]);
  const [logs, setLogs] = useState(() => {
    const storedLogs = localStorage.getItem('loginLogs');
    return storedLogs ? JSON.parse(storedLogs) : [];
  });
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [systemLoginName, setSystemLoginName] = useState('');
  const [confirmSystemLoginName, setConfirmSystemLoginName] = useState('');
  const [error, setError] = useState('');
  const logRef = useRef(null);
  const shouldShowField = false;
  const [remainingTime, setRemainingTime] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const otpInputRef = useRef(null);
  const [remainingTimeNewNotional, setRemainingTimeNewNotional] = useState(180);
  const [isTimerRunningNewNotional, setIsTimerRunningNewNotional] = useState(false);
  const newNotionalInputRef = useRef(null);
  const eventSourceRef = useRef(null);
  const reconnectIntervalRef = useRef(null);

  const ageOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const [selectedAge1, setSelectedAge1] = useState(cashValueInfo?.age_1 || 1);
  const [selectedAge2, setSelectedAge2] = useState(cashValueInfo?.age_2 || 1);

  // Function to handle PDF download
  const handlePdfDownload = (pdfBase64, filename) => {
    const binaryString = atob(pdfBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (inputs.age && inputs.numberOfYears) {
      const calculatedWithdrawalPeriod = 100 - inputs.age - inputs.numberOfYears + 2;
      setWithdrawalPeriod(calculatedWithdrawalPeriod);
    }
  }, [inputs.age, inputs.numberOfYears]);

  const serverURL = IsProduction ? 'https://fastapi-production-a20ab.up.railway.app' : 'http://localhost:7001';

  // Initialize session when modal opens
  useEffect(() => {
    if (open) {
      const initSession = async () => {
        try {
          const response = await axios.post(serverURL + '/init-session');
          const { session_id } = response.data;
          setSessionId(session_id);
        } catch (error) {
          console.error('Failed to initialize session', error);
          setError(t('Failed_to_initialize_session'));
        }
      };
      initSession();
    }
  }, [open, serverURL, t]);

  useEffect(() => {
    if (open) {
      if (!IsProduction) {
        const storedUsername = localStorage.getItem('username') || '';
        setUsername(storedUsername);
      } else {
        fetchSystemLoginName();
      }
    }
  }, [open, IsProduction]);

  const fetchSystemLoginName = () => {
    const apiUrl = window.wpApiSettings.root + 'myplugin/v1/system-login-name';
    fetch(apiUrl, { 
      credentials: 'include',
      headers: {
        'X-WP-Nonce': window.wpApiSettings.nonce
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.system_login_name) {
          setUsername(data.system_login_name);
        } else {
          setShowUsernamePopup(true);
        }
      })
      .catch(() => {
        console.log("IsProduction=",IsProduction);
        setError(t('Failed_to_fetch_system_login_name'));
      });
  };

  const connectSSE = () => {
    if (sessionId) {
      const eventSource = new EventSource(`${serverURL}/logs/${sessionId}`);
      eventSourceRef.current = eventSource;
      eventSource.onopen = () => {
        console.log("SSE connection opened");
        clearInterval(reconnectIntervalRef.current);
      };
      eventSource.onmessage = (event) => {
        setLogs(prevLogs => {
          const updatedLogs = [...prevLogs, event.data];
          localStorage.setItem('loginLogs', JSON.stringify(updatedLogs));
          return updatedLogs;
        });
      };
      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
        console.log("SSE connection closed due to error");
        startReconnectTimer();
      };
    }
  };

  const startReconnectTimer = () => {
    reconnectIntervalRef.current = setInterval(() => {
      if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.CLOSED) {
        console.log("Attempting to reconnect SSE...");
        connectSSE();
      }
    }, 5000);
  };

  useEffect(() => {
    connectSSE();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("SSE connection closed on cleanup");
      }
      clearInterval(reconnectIntervalRef.current);
    };
  }, [sessionId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.CLOSED) {
          console.log("Reconnecting SSE on visibility change");
          connectSSE();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.CLOSED) {
        console.log("Reconnecting SSE on focus");
        connectSSE();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logDialogOpen, logs]);

  useEffect(() => {
    if (step === 'otp') {
      otpInputRef.current?.focus();
    } else if (step === 'retry') {
      newNotionalInputRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      alert('輸入OTP超時');
      handleClose();
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, remainingTime]);

  useEffect(() => {
    let timer;
    if (isTimerRunningNewNotional && remainingTimeNewNotional > 0) {
      timer = setInterval(() => {
        setRemainingTimeNewNotional(prev => prev - 1);
      }, 1000);
    } else if (remainingTimeNewNotional === 0) {
      alert('輸入新的名義金額超時');
      handleClose();
    }
    return () => clearInterval(timer);
  }, [isTimerRunningNewNotional, remainingTimeNewNotional]);

  const handleSetSystemLoginName = () => {
    setError('');
    if (!systemLoginName || !confirmSystemLoginName) {
      setError(t('Both_login_name_fields_are_required'));
      return;
    }
    if (systemLoginName !== confirmSystemLoginName) {
      setError(t('Login_names_do_not_match'));
      return;
    }
    setLoading(true);
    const apiUrl = window.wpApiSettings.root + 'myplugin/v1/system-login-name';
    fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce
      },
      body: JSON.stringify({ system_login_name: systemLoginName }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsername(systemLoginName);
          setShowUsernamePopup(false);
          setError('');
        } else {
          setError(t('Failed_to_set_system_login_name'));
        }
      })
      .catch(() => {
        setError(t('Failed_to_connect_to_the_server'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClosePopup = () => {
    setShowUsernamePopup(false);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setStep('login');
    setSystemMessage('');
    setNewNotionalAmount('');
    setOtp('');
    setOtpError('');
    setSessionId('');
    setIsTimerRunning(false);
    setRemainingTime(180);
    setIsTimerRunningNewNotional(false);
    setRemainingTimeNewNotional(180);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!IsProduction) {
      localStorage.setItem('username', username);
    }
    setLogs([]);
    localStorage.setItem('loginLogs', JSON.stringify([]));
    try {
      await axios.post(serverURL + '/login', {
        session_id: sessionId,
        url,
        username,
        password,
      });
      setStep('otp');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsTimerRunning(false);
    setLoading(true);
    setOtpError('');
    try {
      const response = await axios.post(serverURL + '/verify-otp', {
        session_id: sessionId,
        otp,
        calculation_data: {
          processedData,
          inputs,
          totalAccumulatedMP: numberOfYearAccMP,
        },
        cashValueInfo: {
          age_1: selectedAge1,
          age_2: selectedAge2,
          age_1_cash_value: 0,
          age_2_cash_value: 0,
          annual_premium: 0
        },
        formData: {
          isCorporateCustomer,
          isPolicyHolder,
          surname: clientInfo.surname,
          givenName: clientInfo.givenName,
          chineseName: clientInfo.chineseName,
          insuranceAge,
          gender,
          isSmoker,
          basicPlan: clientInfo.basicPlan,
          currency: clientInfo.basicPlanCurrency, 
          notionalAmount,
          premiumPaymentPeriod: clientInfo.premiumPaymentPeriod,
          premiumPaymentMethod,
          useInflation,
          proposalLanguage,
          selectedAge1,
          selectedAge2,
        },
      });
      if (response.data.status === 'otp_failed') {
        setOtpError(response.data.message);
      } else if (response.data.status === 'retry') {
        setSystemMessage(response.data.system_message);
        setStep('retry');
        setRemainingTimeNewNotional(180);
        setIsTimerRunningNewNotional(true);
      } else if (response.data.status === 'success') {
        setCashValueInfo({
          age_1: selectedAge1,
          age_2: selectedAge2,
          age_1_cash_value: response.data.age_1_cash_value,
          age_2_cash_value: response.data.age_2_cash_value,
          annual_premium: response.data.annual_premium
        });
        setStep('success');
        setFinalNotionalAmount(notionalAmount);
        handlePdfDownload(response.data.pdf_base64, response.data.filename);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleRetrySubmit = async (e) => {
    e.preventDefault();
    setIsTimerRunningNewNotional(false);
    setLoading(true);
    try {
      const response = await axios.post(serverURL + '/retry-notional', {
        session_id: sessionId,
        new_notional_amount: newNotionalAmount,
      });
      if (response.data.status === 'retry') {
        setSystemMessage(response.data.system_message);
        setNewNotionalAmount('');
        setRemainingTimeNewNotional(180);
        setIsTimerRunningNewNotional(true);
      } else if (response.data.status === 'success') {
        setCashValueInfo(prev => ({
          ...prev,
          age_1_cash_value: response.data.age_1_cash_value,
          age_2_cash_value: response.data.age_2_cash_value,
          annual_premium: response.data.annual_premium
        }));
        setStep('success');
        setFinalNotionalAmount(newNotionalAmount);
        handlePdfDownload(response.data.pdf_base64, response.data.filename);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    if (step === 'login') {
      handleLogin(e);
    } else if (step === 'otp') {
      handleOtpSubmit(e);
    }
  };

  useEffect(() => {
    if (clientInfo.basicPlan && clientInfo.basicPlanCurrency && premiumPaymentPeriodOptions[clientInfo.basicPlan]) {
      setAvailablePaymentPeriods(premiumPaymentPeriodOptions[clientInfo.basicPlan]);
    } else {
      setAvailablePaymentPeriods([]);
    }
    setClientInfo(prev => ({ ...prev, premiumPaymentPeriod: '' }));
  }, [clientInfo.basicPlan, clientInfo.basicPlanCurrency, premiumPaymentPeriodOptions, setClientInfo]);

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    if (input === '') {
      setNotionalAmount('');
      setDisplayValue('');
      return;
    }

    const numericValue = parseInt(input, 10);
    if (!isNaN(numericValue)) {
      setNotionalAmount(numericValue.toString());
      setDisplayValue(numberFormatter.format(numericValue));
    }
  };

  const handleBlur = () => {
    if (notionalAmount !== '') {
      const numericValue = parseInt(notionalAmount, 10);
      if (!isNaN(numericValue)) {
        setDisplayValue(numberFormatter.format(numericValue));
      } else {
        setNotionalAmount('');
        setDisplayValue('');
      }
    }
  };

  const handleFocus = () => {
    if (notionalAmount !== '') {
      setDisplayValue(notionalAmount);
    }
  };

  const languageLabels = {
    'zh-HK': t('login.languageZh'),
    'zh-CN': t('login.languageSc'),
    'en': t('login.languageEn'),
  };

  const premiumPeriodError = clientInfo.premiumPaymentPeriod && parseInt(clientInfo.premiumPaymentPeriod, 10) !== inputs.numberOfYears;

  return (
    <Modal
      open={open}
      onClose={() => {}}
      aria-labelledby="login-modal"
      aria-describedby="insurance-plan-login"
    >
      <Paper sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {t('login.title')}
        </Typography>
        
        {step === 'login' || step === 'otp' ? (
          <div onSubmit={handleSubmit}>
            <div className="margin-top-20 info-section">
              <div className="customer-card-container" style={{ display: 'grid', gap: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      id="input_text_field_7"
                      label={<>{t('login.surname')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={clientInfo.surname}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, surname: e.target.value }))}
                      required
                      fullWidth
                      disabled={loading || step === 'otp' || disabled}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      id="input_text_field_1"
                      label={<>{t('login.givenName')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={clientInfo.givenName}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, givenName: e.target.value }))}
                      required
                      fullWidth
                      disabled={loading || step === 'otp' || disabled}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      id="input_text_field_2"
                      label={t('login.chineseName')}
                      value={clientInfo.chineseName}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, chineseName: e.target.value }))}
                      fullWidth
                      disabled={loading || step === 'otp' || disabled}
                      inputProps={{ maxLength: 10 }}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    {shouldShowField && (
                      <TextField
                        label={t('login.insuranceAge')}
                        value={insuranceAge}
                        onChange={(e) => setInsuranceAge(e.target.value)}
                        fullWidth
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ style: { fontWeight: '500' } }}
                        select
                      >
                        {Array.from({ length: 100 }, (_, i) => 0 + i).map((num) => (
                          <MenuItem key={num} value={String(num)}>
                            {num}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.gender')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp' || disabled}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {gender === 'Male' && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.genderMale')}
                          </>
                        }
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp' || disabled}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {gender === 'Female' && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.genderFemale')}
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.smokingHabit')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={isSmoker.toString()}
                      onChange={(e) => setIsSmoker(e.target.value === 'true')}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp' || disabled}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {isSmoker && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.yes')}
                          </>
                        }
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio sx={{ display: 'none' }} />}
                        disabled={loading || step === 'otp' || disabled}
                        label={
                          <>
                            <span style={{
                              display: 'inline-block',
                              width: '20px',
                              height: '20px',
                              border: '2px solid #ccc',
                              borderRadius: '50%',
                              marginRight: '8px',
                              backgroundColor: '#fff',
                              position: 'relative',
                            }}>
                              {!isSmoker && (
                                <svg
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="#10740AFF"
                                >
                                  <circle cx="12" cy="12" r="6" />
                                </svg>
                              )}
                            </span>
                            {t('login.no')}
                          </>
                        }
                      />
                    </RadioGroup>
                  </div>
                </Box>
              </div>

              <div className="customer-card-container" style={{ marginTop: '20px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.basicPlan')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={clientInfo.basicPlan}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, basicPlan: e.target.value }))}
                        label={<>{t('login.basicPlan')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        {manulifeSavingPlans.map((plan) => (
                          <MenuItem key={plan} value={plan}>
                            {plan}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth error={premiumPeriodError}>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.premiumPaymentPeriod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={clientInfo.premiumPaymentPeriod}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, premiumPaymentPeriod: e.target.value }))}
                        label={<>{t('login.premiumPaymentPeriod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                        required
                      >
                        {availablePaymentPeriods.map((period) => (
                          <MenuItem key={period} value={period}>
                            {period}年
                          </MenuItem>
                        ))}
                      </Select>
                      {premiumPeriodError && (
                        <FormHelperText error>
                          {t('login.premiumPeriodError')}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.currency')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={clientInfo.basicPlanCurrency}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, basicPlanCurrency: e.target.value }))}
                        label={<>{t('login.currency')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="美元">美元</MenuItem>
                        <MenuItem value="港元">港元</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      id="input_text_field_3"
                      label={t('login.notionalAmount')}
                      value={displayValue}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                      fullWidth
                      disabled={loading || step === 'otp' || disabled}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {clientInfo.basicPlanCurrency === '美元' ? 'USD' : 'HKD'}
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 2, 
                        '& .MuiInputLabel-asterisk': { color: 'red' },
                        '& .Mui-error': { color: 'red' }
                      }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                      placeholder={t("login.notioalAmountPlaceHolder")}
                      error={Number(displayValue?.replace(/[^0-9.-]+/g,"")) < 1500}
                      helperText={Number(displayValue?.replace(/[^0-9.-]+/g,"")) < 1500 ? t('login.notionalAmountError') : ""}
                    />
                  </div>
                </Box>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.premiumPaymentMethod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={premiumPaymentMethod}
                        onChange={(e) => setPremiumPaymentMethod(e.target.value)}
                        label={<>{t('login.premiumPaymentMethod')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                      >
                        <MenuItem value="每年">每年</MenuItem>
                        <MenuItem value="每半年">每半年</MenuItem>
                        <MenuItem value="每季">每季</MenuItem>
                        <MenuItem value="每月">每月</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>
                      {t('login.proposalLanguage')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                    </Typography>
                    <RadioGroup
                      value={proposalLanguage}
                      onChange={(e) => setProposalLanguage(e.target.value)}
                      row
                      sx={{ display: 'flex', gap: '20px', position: 'relative', right: '-12px' }}
                    >
                      {['zh-HK', 'zh-CN', 'en'].map((lang) => (
                        <FormControlLabel
                          key={lang}
                          value={lang}
                          control={<Radio sx={{ display: 'none' }} />}
                          disabled={loading || step === 'otp' || disabled}
                          label={
                            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                              <span style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                border: `2px solid ${proposalLanguage === lang ? '#10740AFF' : '#ccc'}`,
                                borderRadius: '50%',
                                marginRight: '8px',
                                backgroundColor: '#fff',
                                position: 'relative',
                              }}>
                                {proposalLanguage === lang && (
                                  <svg
                                    style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="#10740AFF"
                                  >
                                    <circle cx="12" cy="12" r="6" />
                                  </svg>
                                )}
                              </span>
                              {languageLabels[lang]}
                            </div>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="login-fields margin-top-20" style={{ marginTop: '30px' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      id="input_text_field_4"
                      label={<>{t('login.websiteUrl')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      fullWidth
                      disabled={true}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.age1')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={selectedAge1}
                        onChange={(e) => setSelectedAge1(e.target.value)}
                        label={<>{t('login.age1')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                        inputProps={{ id: 'input_text_field_15' }}
                      >
                        {ageOptions.map((age) => (
                          <MenuItem key={age} value={age}>
                            {age}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel sx={{ fontWeight: '500' }}>
                        {t('login.age2')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        value={selectedAge2}
                        onChange={(e) => setSelectedAge2(e.target.value)}
                        label={<>{t('login.age2')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                        disabled={loading || step === 'otp' || disabled}
                        sx={{ backgroundColor: 'white', color: 'black' }}
                        inputProps={{ id: 'input_text_field_16' }}
                      >
                        {ageOptions.map((age) => (
                          <MenuItem key={age} value={age}>
                            {age}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <div>
                    <TextField
                      id="input_text_field_6"
                      label={<>{t('login.username')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      value={username}
                      onChange={(e) => !IsProduction && setUsername(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp' || IsProduction}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      id="input_text_field_5"
                      label={<>{t('login.password')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      disabled={loading || step === 'otp' || disabled}
                      sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                      InputLabelProps={{ style: { fontWeight: '500' } }}
                    />
                  </div>
                </Box>
                {step === 'otp' && (
                  <TextField
                    id="input_text_field_12"
                    label={<>{t('login.otpVerification')} <span className="mandatory-tick" style={{ color: 'red' }}>*</span></>}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                        if (value.length !== 6) {
                          setOtpError('OTP must be exactly 6 digits');
                        } else {
                          setOtpError('');
                        }
                      }
                    }}
                    onFocus={() => {
                      if (!isTimerRunning) {
                        setIsTimerRunning(true);
                        setRemainingTime(180);
                      }
                    }}
                    onBlur={() => {
                      if (otp.length !== 6) {
                        setOtpError('OTP must be exactly 6 digits');
                      } else {
                        setOtpError('');
                      }
                    }}
                    required
                    fullWidth
                    disabled={loading}
                    error={!!otpError}
                    helperText={otpError}
                    sx={{ mb: 2, '& .MuiInputLabel-asterisk': { display: 'none' } }}
                    InputLabelProps={{ style: { fontWeight: '500' } }}
                    inputProps={{
                      maxLength: 6,
                      inputMode: 'numeric',
                    }}
                    placeholder={isTimerRunning ? `剩餘時間: ${remainingTime} 秒` : '請輸入 OTP'}
                    inputRef={otpInputRef}
                  />
                )}

                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  fullWidth
                  disabled={loading || (IsProduction && !username) || disabled || premiumPeriodError}
                  sx={{ 
                    padding: '12px 24px', 
                    backgroundColor: (loading || (IsProduction && !username) || disabled || premiumPeriodError) ? '#ccc' : '#10740AFF', 
                    '&:hover': { backgroundColor: '#0d5f08' } 
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : step === 'login' ? (
                    t('login.loginButton')
                  ) : (
                    t('login.submitOtpButton')
                  )}
                </Button>

                <Box sx={{ mt: 2 }}>
                  <Button 
                    onClick={() => setLogDialogOpen(true)} 
                    variant="outlined"
                    fullWidth
                    sx={{ padding: '12px 24px' }}
                  >
                    {t('login.viewLogs', { count: logs.length })}
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        ) : step === 'retry' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('login.systemMessage')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {systemMessage}
            </Typography>
            <TextField
              label={t('login.newNotionalAmount')}
              value={newNotionalAmount}
              onChange={(e) => {
                const value = e.target.value;
                const rawValue = value.replace(/[^\d.]/g, '');
                const parts = rawValue.split('.');
                let whole = parts[0] || '';
                const decimal = parts.length > 1 ? `.${parts[1]}` : '';
                if (whole) {
                  whole = parseInt(whole, 10).toLocaleString('en-US');
                }
                const formattedValue = whole + decimal;
                if (value === '' || /^[0-9,]*\.?[0-9]*$/.test(value)) {
                  setNewNotionalAmount(formattedValue);
                }
              }}
              onFocus={() => {
                if (!isTimerRunningNewNotional) {
                  setIsTimerRunningNewNotional(true);
                  setRemainingTimeNewNotional(180);
                }
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {clientInfo.basicPlanCurrency === '美元' ? 'USD' : 'HKD'}
                  </InputAdornment>
                ),
                inputMode: 'decimal',
              }}
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontWeight: '500' } }}
              placeholder={isTimerRunningNewNotional ? `剩餘時間: ${remainingTimeNewNotional} 秒` : 'Enter new amount'}
              inputRef={newNotionalInputRef}
            />
            <Button
              onClick={handleRetrySubmit}
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                backgroundColor: loading ? '#ccc' : '#10740AFF', 
                '&:hover': { backgroundColor: '#0d5f08' } 
              }}
            >
              {loading ? <CircularProgress size={24} /> : t('login.submitButton')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => setLogDialogOpen(true)} variant="outlined" fullWidth>
                {t('login.viewLogs', { count: logs.length })}
              </Button>
            </Box>
          </Box>
        ) : step === 'success' ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t('login.successMessage')}
            </Typography>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{ 
                backgroundColor: '#10740AFF', 
                '&:hover': { backgroundColor: '#0d5f08' } 
              }}
            >
              {t('login.completeButton')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => setLogDialogOpen(true)} variant="outlined" fullWidth>
                {t('login.viewLogs', { count: logs.length })}
              </Button>
            </Box>
          </Box>
        ) : null}

        <Dialog open={showUsernamePopup} onClose={handleClosePopup}>
          <DialogTitle>{t('setSystemLoginName')}</DialogTitle>
          <DialogContent>
            <TextField
              id="input_text_field_13"
              label={t('systemLoginName')}
              value={systemLoginName}
              onChange={(e) => setSystemLoginName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontWeight: '500' } }}
            />
            <TextField
              id="input_text_field_14"
              label={t('confirmSystemLoginName')}
              value={confirmSystemLoginName}
              onChange={(e) => setConfirmSystemLoginName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ style: { fontWeight: '500' } }}
            />
            {error && <Typography color="error">{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePopup}>{t('cancel')}</Button>
            <Button onClick={handleSetSystemLoginName} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : t('setLoginNameButton')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('login.systemMessage')}</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: '#f9f9f9',
              }}
              ref={logRef}
            >
              {logs.map((log, index) => (
                <Typography key={index} sx={{ marginBottom: '8px' }}>
                  {log}
                </Typography>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogDialogOpen(false)}>{t('login.completeButton')}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Modal>
  );
}

export default Login;