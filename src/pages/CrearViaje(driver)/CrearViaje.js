import React, { useEffect, useState, useRef } from 'react';
import { useForm } from '../../hooks/useForm';
import {
  Form,
  Col,
  FloatingLabel,
  ListGroup,
  OverlayTrigger,
  Popover,
  Spinner,
} from 'react-bootstrap';
import { Autocomplete } from '@react-google-maps/api';
import './CrearViaje.scss';
import PlacesAutocomplete from 'react-places-autocomplete';
import { FormattedMessage } from 'react-intl';

export const CrearViaje = (props) => {
  var urlDriverTravel = process.env.REACT_APP_DEV_BACK_URL + 'drivertravels/';
  var urlAddress = process.env.REACT_APP_DEV_BACK_URL + 'addresses';
  const isProd =
    process.env.REACT_APP_IS_PRODUCTION.toLocaleUpperCase === 'TRUE';
  if (isProd) {
    urlDriverTravel = process.env.REACT_APP_PROD_BACK_URL + 'drivertravels/';
    urlAddress = process.env.REACT_APP_PROD_BACK_URL + 'addresses';
  }

  const [formValues, handleInputChange] = useForm({});
  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const { direccionO, direccionD, spaceAvailable, fecha, hora } = formValues;

  let date = new Date();
  const outputDate =
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0');

  const outputHour =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
    ':' +
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

  // Toast Alert
  const onTriggerToast = (data) => {
    let toast = { header: data.header, body: data.body, timeStamp: Date.now() };
    props.parentCallback(toast);
  };

  // Places
  const originRef = useRef();
  const destinationRef = useRef();

  //validate form
  const validateUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    console.log(name + '---' + value);
    switch (name) {
      case spaceAvailable:
        if (value > 1) handleInputChange(e);
        console.log(value);
        break;

      case fecha:
        let value_date = new Date(value);
        if (value_date.getTime() >= Date.now()) handleInputChange(e);
        break;

      case hora:
        let value_hour = new Date(Date.now()).setDate(fecha);
        value_hour.setHours(value);
        if (value_hour.getTime() >= Date.now()) handleInputChange(e);
        break;

      default:
        handleInputChange(e);
        break;
    }
  };

  //Search Direcctions
  const searchOptions = {};

  const [showD, setShowD] = useState(false);
  const [addressD, setAddressD] = useState('');

  const handleChangeD = (value) => {
    setShowD(true);
    setAddressD(value);
  };

  const handleSelectD = (value) => {
    setShowD(false);
    setAddressD(value);
  };

  const [showO, setShowO] = useState(false);
  const [addressO, setAddressO] = useState('');

  const handleChangeO = (value) => {
    setShowO(true);
    setAddressO(value);
  };

  const handleSelectO = (value) => {
    setShowO(false);
    setAddressO(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid === false) {
      onTriggerToast({
        header: 'Formulario incompleto',
        body: 'Por favor, dilegencie correctamente el formulario.',
      });
      setIsValid(true);
      return;
    } else {
      let driverTravel = {
        origin: originRef.current.value,
        destinity: destinationRef.current.value,
        spaceAvailable: parseInt(formValues.spaceAvailable),
        date: formValues.fecha + 'T' + formValues.hora + ':00.000Z',
      };
      driverTravel = JSON.stringify(driverTravel);
      console.log(driverTravel);
      try {
        let res = await fetch(urlDriverTravel, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: driverTravel,
        });
        let resJson = await res.json();
        //console.log(resJson);
        //window.location.reload();

        fetch(
          'http://localhost:3010/api/v1/users/6c7f3b2c-84b5-4c58-b350-f36b10864560/driverTravels/' +
            resJson.id,
          {
            method: 'POST',
          },
        );

        onTriggerToast({
          header: 'Viaje creado',
          body: 'Se creo el viaje exitosamente.',
        });
      } catch (err) {
        console.log(err);
        onTriggerToast({
          header: 'Error',
          body: `${err}`,
        });
      }
      return; //<Navigate to="/" />;
    }
  };

  useEffect(() => {
    fetch(urlAddress)
      .then((response) => response.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setAddresses(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        },
      );
    //console.log('data: ' + driverTravels);
  });

  return (
    <>
      <div className="crearViaje-container">
        <h2>
          <FormattedMessage id="createTravel_tittle" />
        </h2>
        <Form className="crearViaje-form" noValidate validated={validated}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="direccionO" className="form-label">
              <FormattedMessage id="addressO" />
            </Form.Label>
            <div className="col">
              <PlacesAutocomplete
                value={addressO}
                onChange={handleChangeO}
                onSelect={handleSelectO}
                searchOptions={searchOptions}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <>
                    <OverlayTrigger
                      placement="bottom-start"
                      show={showO}
                      overlay={
                        <Popover id="popover-contained">
                          <ListGroup as="ul">
                            {loading && (
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            )}
                            {suggestions.map((suggestion) => {
                              const style = suggestion.active
                                ? {
                                    backgroundColor: '#121a2b',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                  }
                                : {
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                  };

                              return (
                                <ListGroup.Item
                                  as="li"
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                >
                                  {suggestion.description}
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        </Popover>
                      }
                    >
                      <Col>
                        <FloatingLabel
                          controlId="AddressO"
                          label={<FormattedMessage id="addressO" />}
                        >
                          <Form.Control
                            type="text"
                            name="AddressO"
                            className="form-control"
                            required
                            ref={originRef}
                            {...getInputProps({
                              placeholder: 'Dirección origen',
                            })}
                          />
                        </FloatingLabel>
                      </Col>
                    </OverlayTrigger>
                  </>
                )}
              </PlacesAutocomplete>
              <Form.Control.Feedback type="invalid">
                <small>Debe seleccionar una direción de origen.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="direccionD" className="form-label">
              <FormattedMessage id="addressD" />
            </Form.Label>
            <div className="col">
              <PlacesAutocomplete
                value={addressD}
                onChange={handleChangeD}
                onSelect={handleSelectD}
                searchOptions={searchOptions}
              >
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <>
                    <OverlayTrigger
                      placement="bottom-start"
                      show={showD}
                      overlay={
                        <Popover id="popover-contained">
                          <ListGroup as="ul">
                            {loading && (
                              <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </Spinner>
                            )}
                            {suggestions.map((suggestion) => {
                              const style = suggestion.active
                                ? {
                                    backgroundColor: '#121a2b',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                  }
                                : {
                                    backgroundColor: '#ffffff',
                                    cursor: 'pointer',
                                  };

                              return (
                                <ListGroup.Item
                                  as="li"
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                >
                                  {suggestion.description}
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        </Popover>
                      }
                    >
                      <Col>
                        <FloatingLabel
                          controlId="AddressD"
                          label={<FormattedMessage id="addressD" />}
                        >
                          <Form.Control
                            type="text"
                            name="AddressD"
                            className="form-control"
                            required
                            ref={destinationRef}
                            {...getInputProps({
                              placeholder: 'Dirección origen',
                            })}
                          />
                        </FloatingLabel>
                      </Col>
                    </OverlayTrigger>
                  </>
                )}
              </PlacesAutocomplete>
              <Form.Control.Feedback type="invalid">
                <small>Debe seleccionar una direción de origen.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group as={Col} className="form-group">
            <Form.Label htmlFor="spaceAvailable" className="form-label">
              <FormattedMessage id="quota" />:
            </Form.Label>
            <div className="col">
              <FloatingLabel
                controlId="Quota"
                label={<FormattedMessage id="quota" />}
              >
                <Form.Control
                  type="number"
                  name="spaceAvailable"
                  className="form-control"
                  autoComplete="off"
                  min={1}
                  required
                  value={spaceAvailable}
                  onChange={(e) => validateUserInput(e)}
                />
              </FloatingLabel>
              <Form.Control.Feedback type="invalid">
                <small>Debe ingresar el número de cupos disponibles.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="fecha" className="form-label">
              <FormattedMessage id="date" />:
            </Form.Label>
            <div className="col">
              <Form.Control
                type="date"
                name="fecha"
                className="form-control"
                min={outputDate}
                required
                defaultValue={outputDate}
                value={fecha}
                onChange={(e) => validateUserInput(e)}
              />
              <Form.Control.Feedback type="invalid">
                <small>Debe ingresar la fecha del viaje.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="hora" className="form-label">
              <FormattedMessage id="hour" />:
            </Form.Label>
            <div className="col">
              <Form.Control
                type="time"
                name="hora"
                className="form-control"
                min={outputHour}
                required
                defaultValue={outputHour}
                value={hora}
                onChange={(e) => validateUserInput(e)}
              />
              <Form.Control.Feedback type="invalid">
                <small>Debe ingresar la hora del viaje.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={(e) => {
              setValidated(true);
              handleSubmit(e);
            }}
          >
            <FormattedMessage id="createTravel_button" />
          </button>
        </Form>
        {/* <Map></Map> */}
      </div>
    </>
  );
};
