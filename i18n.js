import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          greeting: 'Hello, {{name}}!',
          Yearth: 'Year {{year}}',
          "Medical Financial Calculator" : "xxx",

    
         
        }
      },
      "zh-HK": {
        translation: {
          welcome: '歡迎',
          greeting: '你好, {{name}}!',
          Yearth: '第{{year}}年',
          "Medical Financial Calculator" : "xxx",
  
          
          
        }
      },
      "zh-CN": {
        translation: {
          welcome: '欢迎',
          greeting: '你好, {{name}}!',
          Yearth: '第{{year}}年',
          "Medical Financial Calculator" : "xxx",
      
        }
      }
    }
  });

export default i18next;