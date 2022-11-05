import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { IntlProvider } from 'react-intl';
import { LOCALES } from './i18n/locales';
import messages from './i18n/messages';
import { UserContext } from './context/UserContext';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { Home } from './pages/Home/Home';
import { CrearViaje } from './pages/CrearViaje(driver)/CrearViaje';
import { AplicarAViaje } from './pages/AplicarAViaje(passenger)/AplicarAViaje';

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(LOCALES.SPANISH);
  return (
    <>
      <IntlProvider locale={language} messages={messages[language]}>
        <UserContext.Provider value={{ user, setUser }}>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/CrearViaje" element={<CrearViaje />} />
              <Route path="/AplicarAViaje" element={<AplicarAViaje />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </IntlProvider>
    </>
  );
}

export default App;
