import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Main from './pages/Main';
import { defaultApi, formFileApi } from "./utils/api";

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppSelector(){
  return <Main />
}

root.render(
  <React.StrictMode>
    <AppSelector />
  </React.StrictMode>
);


defaultApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const prevRequest = error?.config;
    if (error.response.status === 400) {
      var errorModel = {
        status: 400,
      };
      return errorModel;
    }
    if (error.response.status === 404) {
      var errorModel = {
        status: 404,
      };
      return errorModel;
    }
    if (error.response.status === 406) {
      var errorModel = {
        status: 406,
      };
      return errorModel;
    }
    return error;
  }
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
