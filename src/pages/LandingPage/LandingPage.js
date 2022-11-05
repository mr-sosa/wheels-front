import React from 'react';
import './LandingPage.scss';
//import { Footer } from '../../components/Footer/Footer';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FormattedMessage } from 'react-intl';
import loading from './../../data/loading.svg';

export const LandingPage = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <>
        <div className="landing-2">
          <img src={loading} alt="Loading" className="Loading" />
        </div>
      </>
    );
  }
  console.log(isAuthenticated);
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/home" />
      ) : (
        <div className="landing">
          <h1 className="landing-title">Wheels</h1>
          <div className="landing-buttons">
            <button
              className="landing-buttons-style"
              onClick={async () =>
                await loginWithRedirect({ appState: { targetUrl: '/home' } })
              }
            >
              <FormattedMessage id="login" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
