import React from 'react';
import './LandingPage.scss';
import { useAuth0 } from '@auth0/auth0-react';
import loading from './../../data/loading.svg';
import { NavBar } from '../../components/NavBar/NavBar';

export const LandingPage = () => {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return (
      <>
        <div className="landing-2">
          <img src={loading} alt="Loading" className="Loading" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="landing">
          <NavBar></NavBar>
        </div>
      </>
    );
  }
};
