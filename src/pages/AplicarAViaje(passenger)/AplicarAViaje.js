import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Badge,
  Button,
  ListGroup,
  Modal,
  Spinner,
} from 'react-bootstrap';
import './AplicarAViaje.scss';

const URL = 'http://localhost:3010/api/v1/drivertravels/';

export const AplicarAViaje = (props) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [driverTravels, setDriverTravels] = useState([]);
  const [idDriverTravel, setIdDriverTravel] = useState();

  /*Modal*/
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (e) => {
    setShowModal(true);
    setIdDriverTravel(e);
  };

  // Toast Alert
  const onTriggerToast = (data) => {
    let toast = { header: data.header, body: data.body, timeStamp: Date.now() };
    props.parentCallback(toast);
  };

  /*Button*/

  const onReserve = (e) => {
    fetch(URL + e + '/reserved', {
      method: 'POST',
    });
    fetch(URL + e + '/passengers/6c7f3b2c-84b5-4c58-b350-f36b10864560', {
      method: 'POST',
    });
    setShowModal(false);
    onTriggerToast({
      header: 'Viaje Creado',
      body: 'Se ha creado existosamente tu viaje',
    });
  };

  const getHour = (date) => {
    let fullHour = date.split('T')[1];
    let hour = fullHour.split(':')[0];
    let minute = fullHour.split(':')[1];
    if (hour < 12) {
      hour = hour + ':' + minute + ' am';
    } else {
      hour = hour - 12;
      hour = hour + ':' + minute + ' pm';
    }
    return hour;
  };

  useEffect(() => {
    fetch(URL)
      .then((response) => response.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setDriverTravels(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        },
      );
  });

  if (error) {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>Viajes disponibles</h2>
          <div className="sm-4 center">Error fetching data</div>
        </div>
      </>
    );
  } else if (!isLoaded) {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>Viajes disponibles</h2>
          <div className="sm-4 center">Loading...</div>

          <Spinner animation="border" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>Viajes disponibles</h2>
          <div className="sm-4 center">
            <ListGroup as="ol" variant="flush" className="DriverTravelList">
              {driverTravels.map((elm, index) => (
                <ListGroup.Item
                  as={Row}
                  className="DriverTravel d-flex align-items-center"
                >
                  <Col sm={8}>
                    <Col>
                      <div className="fw-bold">
                        Fecha: {elm.date.split('T')[0]}
                      </div>
                      <div className="fw-bold">Hora: {getHour(elm.date)}</div>
                    </Col>
                    <Badge as={Col} bg="primary" pill>
                      Cupos: {elm.spaceAvailable}
                    </Badge>
                  </Col>
                  <Col sm={4}>
                    <Button onClick={() => handleShowModal(elm.id)}>
                      Reservar
                    </Button>
                  </Col>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Crear Viaje</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Estas seguro de que deseas crear el viaje?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => onReserve(idDriverTravel)}
              >
                Aceptar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </>
    );
  }
};
