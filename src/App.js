import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { IntlProvider } from 'react-intl';
import { LOCALES } from './i18n/locales';
import messages from './i18n/messages';
import { Home } from './pages/Home/Home';
import { CrearViaje } from './pages/CrearViaje(driver)/CrearViaje';
import { AplicarAViaje } from './pages/AplicarAViaje(passenger)/AplicarAViaje';
import { DetalleViaje } from './pages/DetalleViaje/DetalleViaje';
import { CreateUser } from './pages/CreateUser/CreateUser';
import { CreateVehicle } from './pages/CreateVehicle/CreateVehicle';
import { Profile } from './pages/Profile/Profile';
import { NavBar } from './components/NavBar/NavBar';
import { ProtectedRoute } from './auth/protected-route';

function App() {
  const [language, setLanguage] = useState(LOCALES.SPANISH);

  return (
    <>
      <IntlProvider locale={language} messages={messages[language]}>
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/Viaje/:viajeId"
              element={<DetalleViaje locale={language} />}
            />
            <Route path="/AplicarAViaje" element={<AplicarAViaje />} />
            <Route path="/CreateVehicle" element={<ProtectedRoute />}>
              <Route path="/CreateVehicle" element={<CreateVehicle />} />
            </Route>
            <Route path="/CrearViaje" element={<ProtectedRoute />}>
              <Route path="/CrearViaje" element={<CrearViaje />} />
            </Route>
            <Route path="/CreateUser" element={<CreateUser />} />
            <Route
              path="/Profile/:userId"
              element={<Profile locale={language} />}
            />
          </Routes>

          <ToastContainer position="bottom-right" theme="colored" />
        </>
      </IntlProvider>
    </>
  );
}

export default App;
