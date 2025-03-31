import React, { useState } from 'react';
import axios from 'axios';

function Login({ processedData, inputs, numberOfYearAccMP }) {
  const [url, setUrl] = useState('https://api.hkprod.manulife.com.hk/ext/pos-qq-web-hkg-app/');
  const [username, setUsername] = useState('CHANTSZLUNG');
  const [password, setPassword] = useState('Ctsz_!376897');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9000/login', {
        url,
        username,
        password,
      });
      setSessionId(response.data.session_id);
      setStep('otp');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
    setLoading(false);
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:9000/verify-otp', {
        session_id: sessionId,
        otp,
        calculation_data: {
          processedData,
          inputs,
          totalAccumulatedMP: numberOfYearAccMP
        }
      });
      alert('Login and data submission successful!');
      setStep('login');
      // Reset form
      setUrl('');
      setUsername('');
      setPassword('');
      setOtp('');
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      {step === 'login' ? (
        <form onSubmit={handleLogin}>
          <input
            type="url"
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Go'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Submit OTP'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;