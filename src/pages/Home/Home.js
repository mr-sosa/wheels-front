import { useState } from 'react';
import { ListGroup, Offcanvas, Toast, ToastContainer } from 'react-bootstrap';
import driverNoActive from '../../data/driverNoActive.png';
import passengerActive from './../../data/passengerActive.png';
import driverActive from '../../data/driverActive.png';
import passengerNoActive from '../../data/passengerNoActive.png';
import menuIcon from '../../data/menu_icon.svg';
import logoutIcon from '../../data/logout_icon.svg';

import { Map } from '../../components/Map/Map';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AplicarAViaje } from '../AplicarAViaje(passenger)/AplicarAViaje';
import { CrearViaje } from '../CrearViaje(driver)/CrearViaje';
import './Home.scss';

export const Home = () => {
  /* User Auth0*/
  const { user, isAuthenticated, logout } = useAuth0();

  /** Toast Alert*/
  const [showToast, setShowToast] = useState(false);
  const handleCloseToast = () => setShowToast(false);
  const handleShowToast = () => setShowToast(true);
  const [toast, setToast] = useState({ header: '', body: '', timeStamp: '' });

  function handleToast(childData) {
    let date = new Date(childData.timeStamp);
    let time = date.getHours() + ':' + date.getMinutes();
    setToast({
      header: childData.header,
      body: childData.body,
      timeStamp: time,
    });
    handleShowToast();
  }

  /**Offcanvas - Menu*/
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  /**Mode Driver-Passenger*/
  const [modeDriver, changeMode] = useState(false);

  return (
    <>
      <div className="Home">
        {user && isAuthenticated && (
          <>
            <div className="Back" id="Back" />
            <div className="Home-Content shadow">
              {modeDriver ? (
                <>
                  <CrearViaje
                    parentCallback={(data) => {
                      handleToast(data);
                    }}
                  />
                  <div className="Home-Buttons">
                    <div className="Home-Buttons-Style">
                      <img
                        alt="PasajeroIcon"
                        src={passengerNoActive}
                        className="Menu-Buttons-Style-Img"
                      />
                      <p
                        onClick={() => changeMode(false)}
                        className="Home-Buttons-Style-Text"
                      >
                        Pasajero
                      </p>
                    </div>
                    <div className="Home-Buttons-Style">
                      <img
                        alt="ConductorIcon"
                        src={driverActive}
                        className="Home-Buttons-Style-Img"
                      />
                      <p className="Home-Buttons-Style-Text Active">
                        Conductor
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <AplicarAViaje
                    parentCallback={(data) => {
                      handleToast(data);
                    }}
                  />
                  <div className="Home-Buttons">
                    <div className="Home-Buttons-Style">
                      <img
                        alt="PasajeroIcon"
                        src={passengerActive}
                        className="Home-Buttons-Style-Img"
                      />
                      <p className="Home-Buttons-Style-Text Active">Pasajero</p>
                    </div>
                    <div className="Home-Buttons-Style">
                      <img
                        alt="ConductorIcon"
                        src={driverNoActive}
                        className="Home-Buttons-Style-Img"
                      />
                      <p
                        onClick={() => {
                          changeMode(true);
                        }}
                        className="Home-Buttons-Style-Text"
                      >
                        Conductor
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {<Map />}
          </>
        )}
        {!user && !isAuthenticated && <Navigate to="/" />}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => handleCloseToast()}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">{toast.header}</strong>
              <small>{toast.timeStamp}</small>
            </Toast.Header>
            <Toast.Body>{toast.body}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="MenuButton shadow" onClick={handleShowOffcanvas}>
          <img alt="menu" src={menuIcon} className="MenuButton-Img" />
        </div>
        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="Menu-Body">
            <div className="Menu-Body-Options">
              <ListGroup variant="flush">
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
              </ListGroup>
            </div>
            <div className="Menu-Body-Logout mb-12" onClick={logout}>
              <img
                alt="logout"
                src={logoutIcon}
                className="Menu-Body-Logout-Img"
              />
              <div>Logout</div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};
