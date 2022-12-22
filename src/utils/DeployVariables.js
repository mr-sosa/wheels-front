/** Auth0 variables */
let clientId = process.env.REACT_APP_AUTH0_DEV_CLIENTID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
const domain = process.env.REACT_APP_AUTH0_DOMAIN;

/** TomTom APIKEY */
const tomtom_key = process.env.REACT_APP_TOMTOM_API_KEY;

/** BackEnd variables */
let URL = process.env.REACT_APP_DEV_BACK_URL;
let redirectURL = 'http://localhost:3000/CreateUser';

if (process.env.REACT_APP_PROD_BACK_URL) {
  clientId = process.env.REACT_APP_AUTH0_PROD_CLIENTID;
  URL = process.env.REACT_APP_PROD_BACK_URL;
  redirectURL = 'https://wheels.onrender.com/CreateUser';
}

export { clientId, audience, domain, URL, redirectURL, tomtom_key };
