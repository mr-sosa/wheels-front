import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import { UserProvider } from './context/UserContext';
import 'react-toastify/ReactToastify.min.css';
import '../src/assets/global.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Router>
    <Auth0ProviderWithHistory>
      <UserProvider>
        <App />
      </UserProvider>
    </Auth0ProviderWithHistory>
  </Router>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
