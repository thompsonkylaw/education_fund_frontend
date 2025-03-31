import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next';
import i18next from './i18n';
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root4')).render(
  <I18nextProvider i18n={i18next}>
    <App />
   </I18nextProvider>,
)
