//import { useAuth0 } from '@auth0/auth0-react';
import { useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserBack } from '../../context/UserContext';
import LoadingScreen from 'react-loading-screen';
import {
  COLOR_PEWTER_BLUE,
  COLOR_PRIMARY,
  COLOR_SECUNDARY,
} from '../../data/constants';

export const CreateUser = () => {
  const { userBack, register } = useUserBack();
  const { state } = useLocation();
  const { formatMessage: f } = useIntl();
  const text = f({ id: 'loading' });

  /*
  let { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userAllAuth, setUserAllAuth] = useState();

  const getUserAuth0 = async () => {
    const domain = 'wheelsdev.us.auth0.com';

    try {
      const accessToken = await getAccessTokenSilently();
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const userResponse = await fetch(userDetailsByIdUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          console.log(response);
          response.json();
        })
        .then((result) => {
          console.log(result);
          setUserAllAuth(result);
        })
        .catch((error) => console.log('error', error));
    } catch (e) {
      console.log(e.message + 'holaaa');
    }
  };

  const updateMetaAuth0User = async (userIdBack) => {
    const domain = 'wheelsdev.us.auth0.com';

    try {
      const accessToken = await getAccessTokenSilently();
      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const metadataResponse = await fetch(userDetailsByIdUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          user_metadata: { userIdBack: userIdBack },
        },
      })
        .then((response) => {
          console.log(response);
          response.json();
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.log('error', error));
    } catch (e) {
      console.log(e.message + 'holaaa');
    }
  };

  */
  useLayoutEffect(() => {
    if (userBack == null) {
      register();
    }
  }, [userBack, register]);

  return (
    <>
      <LoadingScreen
        loading={userBack === null}
        bgColor={COLOR_PRIMARY}
        spinnerColor={COLOR_PEWTER_BLUE}
        textColor={COLOR_SECUNDARY}
        logoSrc="../logo.png"
        text={text}
      >
        <Navigate to={state ?? '/'} />
      </LoadingScreen>
    </>
  );
};
