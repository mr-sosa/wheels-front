import React, { useEffect, useState, useRef } from 'react';
import { useForm } from '../../hooks/useForm';
import { Form, Col } from 'react-bootstrap';
import { Autocomplete } from '@react-google-maps/api';
import './CrearViaje.scss';

export const CrearViaje = (props) => {
  const urlDriverTravel = process.env.REACT_APP_BACK_URL + 'drivertravels/';
  const urlAddress = process.env.REACT_APP_BACK_URL + 'addresses';

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
        <h2>Crear Viaje</h2>
        <Form className="crearViaje-form" noValidate validated={validated}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="direccionO" className="form-label">
              Dirección origen:
            </Form.Label>
            <div className="col">
              <Autocomplete>
                <Form.Control
                  type="text"
                  name="direccionO"
                  id="direccionO"
                  className="form-control"
                  placeholder="Dirección origen"
                  required
                  value={direccionO}
                  ref={originRef}
                >
                  {/*addresses.map(() => (
                  <option>addresses.name</option>
                ))*/}
                </Form.Control>
              </Autocomplete>
              <Form.Control.Feedback type="invalid">
                <small>Debe seleccionar una direción de origen.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="direccionD" className="form-label">
              Dirección destino:
            </Form.Label>
            <div className="col">
              <Autocomplete>
                <Form.Control
                  type="text"
                  name="direccionD"
                  className="form-control"
                  placeholder="Dirección destino"
                  required
                  value={direccionD}
                  ref={destinationRef}
                ></Form.Control>
              </Autocomplete>
              <Form.Control.Feedback type="invalid">
                <small>Debe seleccionar una direción de origen.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group as={Col} className="form-group">
            <Form.Label htmlFor="spaceAvailable" className="form-label">
              Cupos:
            </Form.Label>
            <div className="col">
              <Form.Control
                type="number"
                name="spaceAvailable"
                className="form-control"
                autoComplete="off"
                required
                value={spaceAvailable}
                onChange={(e) => validateUserInput(e)}
              />
              <Form.Control.Feedback type="invalid">
                <small>Debe ingresar el número de cupos disponibles.</small>
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="fecha" className="form-label">
              Fecha:
            </Form.Label>
            <div className="col">
              <Form.Control
                type="date"
                name="fecha"
                className="form-control"
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
              Hora:
            </Form.Label>
            <div className="col">
              <Form.Control
                type="time"
                name="hora"
                className="form-control"
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
            Crear
          </button>
        </Form>
        {/* <Map></Map> */}
      </div>
    </>
  );
};
