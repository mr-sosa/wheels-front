import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserBack } from '../context/UserContext';
import LoadingScreen from 'react-loading-screen';

import {
  COLOR_PEWTER_BLUE,
  COLOR_PRIMARY,
  COLOR_SECUNDARY,
} from '../data/constants';
import { useIntl } from 'react-intl';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useUserBack();
  const { formatMessage: f } = useIntl();
  const text = f({ id: 'loading' });
  return (
    <LoadingScreen
      loading={isLoading}
      bgColor={COLOR_PRIMARY}
      spinnerColor={COLOR_PEWTER_BLUE}
      textColor={COLOR_SECUNDARY}
      logoSrc="../logo.png"
      text={text}
    >
      {!isLoading && !isAuthenticated ? <Navigate to={'/'} /> : <Outlet />}
    </LoadingScreen>
  );
};
