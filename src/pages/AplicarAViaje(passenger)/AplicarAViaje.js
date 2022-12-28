import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Badge, Button, ListGroup, Spinner } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { URL } from '../../utils/DeployVariables';
import './AplicarAViaje.scss';

export const AplicarAViaje = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [driverTravels, setDriverTravels] = useState([]);

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

  // eslint-disable-next-line no-unused-vars
  let [searchParams, setSearchParams] = useSearchParams();

  let query = useMemo(() => {
    let query = '';
    searchParams.forEach((value, key) => {
      query = query + '&' + key + '=' + value;
    });
    if (!searchParams.get('date')) {
      let today = new Date();
      query = query + `&date=${today.toISOString()}`;
    }

    return query;
  }, [searchParams]);

  useEffect(() => {
    fetch(`${URL}drivertravels/?${query}`)
      .then((response) => response.json())
      .then(
        (data) => {
          if (data.numItems === 0 && query.includes('state')) {
            toast.error(<FormattedMessage id="toast_error_searchTravels" />);
          } else if (query.includes('state')) {
            toast.success(
              <FormattedMessage id="toast_success_searchTravels" />,
            );
          }
          setIsLoaded(true);
          setDriverTravels(data.data);
        },
        (error) => {
          toast.error(<FormattedMessage id="toast_error_searchTravels" />);
          setIsLoaded(true);
          setError(error);
        },
      );
  }, [query]);

  if (error) {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>
            <FormattedMessage id="list_driverTravel_tittle" />
          </h2>
          <div className="sm-4 center">
            <FormattedMessage id="error_fetchingdata" />
          </div>
        </div>
      </>
    );
  } else if (!isLoaded) {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>
            <FormattedMessage id="list_driverTravel_tittle" />
          </h2>
          <div className="sm-4 center">
            <FormattedMessage id="loading" />
          </div>

          <Spinner animation="border" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="aplicarAViaje-container">
          <h2>
            <FormattedMessage id="list_driverTravel_tittle" />
          </h2>
          <div className="sm-4 center">
            {driverTravels.length === 0 ? (
              <FormattedMessage id="list_driverTravel_NoTravels" />
            ) : (
              <ListGroup as="ol" variant="flush" className="DriverTravelList">
                {driverTravels.map((elm, index) => (
                  <ListGroup.Item as="li" key={index}>
                    <Row
                      className="DriverTravel d-flex align-items-center"
                      key={index}
                    >
                      <Col sm={4} xs={6}>
                        <div className="fw-bold">
                          <FormattedMessage id="addressO" />{' '}
                          {elm.origin.address}
                        </div>
                        <div className="fw-bold">
                          <FormattedMessage id="addressD" />{' '}
                          {elm.destination.address}
                        </div>
                      </Col>
                      <Col sm={4} xs={6} className="datos">
                        <Col>
                          <div className="fw-bold">
                            <FormattedMessage id="list_driverTravel_date" />
                            {elm.date.split('T')[0]}
                          </div>
                          <div className="fw-bold text-end">
                            <FormattedMessage id="list_driverTravel_hour" />
                            {getHour(elm.date)}
                          </div>
                        </Col>
                        <Badge as={Col} pill>
                          <FormattedMessage id="list_driverTravel_quota" />
                          {elm.spaceAvailable}
                        </Badge>
                      </Col>
                      <Col sm={3} xs={12}>
                        <Button onClick={() => navigate(`/Viaje/${elm.id}`)}>
                          <FormattedMessage id="list_driverTravel_button" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </>
    );
  }
};
