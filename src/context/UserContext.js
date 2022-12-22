import { useAuth0 } from '@auth0/auth0-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { URL, redirectURL } from '../utils/DeployVariables';

const UserContext = createContext();

export function useUserBack() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();
  const location = useLocation();
  const [userBack, setUserBack] = useState(null);

  function logIn() {
    loginWithRedirect({
      appState: {
        returnTo: 'CreateUser',
        location: location.pathname,
      },
    });
  }

  function logOut() {
    localStorage.removeItem('idUserBack');
    logout();
  }

  async function checkUserExist() {
    let res = null;
    await fetch(`${URL}users/?p=1&email=${user.email}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.numItems >= 1) {
          setUserBack(result.data[0]);
          localStorage.setItem('idUserBack', result.data[0].id);
          res = true;

          toast.success(<FormattedMessage id="toast_success_login" />);
        } else {
          res = false;
        }
      })
      .catch((error) => console.log('error', error));

    return res;
  }

  const register = useCallback(async () => {
    if (isAuthenticated) {
      let existUser = await checkUserExist();
      if (!existUser) {
        let new_user = {
          email: user.email,
          verifiedMail: user.email_verified ?? false,
          name: user.name,
          phone: user.phone_number ?? '',
          verifiedPhone: user.phone_number_verified ?? false,
          password: 'wheels',
          genre: 'MALE',
          birthDate: '1000-01-01T01:01',
          photo: user.picture,
          idenficiationCard: '',
          about: '',
          score: 3,
          drivingPass: '',
        };

        new_user = JSON.stringify(new_user);

        fetch(`${URL}users/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: new_user,
        })
          .then((response) => response.json())
          .then((result) => {
            setUserBack(result);

            localStorage.setItem('idUserBack', result.id);
            toast.success(<FormattedMessage id="toast_success_signIn" />);
            //updateMetaAuth0User(result.id);
            //getUserAuth0();
          })
          .catch((error) => console.log('error', error));
      }
    }
  }, [isAuthenticated, isLoading, checkUserExist]);

  const makeDriver = () => {
    fetch(`${URL}users/${userBack.id}/convertToDriver`, { method: 'PUT' })
      .then((response) => response.json())
      .then((result) => {
        setUserBack(result);
        toast.success(<FormattedMessage id="toast_success_makedriver" />);
      })
      .catch((error) => console.log('error', error));
  };

  useLayoutEffect(() => {
    if (!isLoading && isAuthenticated) {
      let userIdBack = localStorage.getItem('idUserBack');
      if (userIdBack != null) {
        localStorage.setItem('copy', userIdBack);
        fetch(`${URL}users/${userIdBack}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            console.log({ resContex: response });
            localStorage.setItem('statusCode', response.status);
            if (response.status === 200) {
              return response.json();
            } else {
              toast.error(<FormattedMessage id="toast_error_reLogin" />);
              logOut();
            }
          })
          .then((result) => {
            if (result !== undefined) {
              //fetch(result.photo, { mode: 'no-cors' });
              setUserBack(result);
              toast(<FormattedMessage id="toast_welcomeAgain" />);
            }
          })
          .catch((error) => console.log('error', error));
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        userBack,
        isAuthenticated,
        isLoading,
        logIn,
        logOut,
        register,
        makeDriver,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
