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
  Button,
  Row,
  FormSelect,
} from 'react-bootstrap';
import './CrearViaje.scss';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FormattedMessage } from 'react-intl';
import PlacesAutocomplete from 'react-places-autocomplete';
import { URL } from '../../utils/DeployVariables';
import { useLayoutEffect } from 'react';
import { useUserBack } from '../../context/UserContext';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  addressO: yup.string().required(<FormattedMessage id="requiredField" />),
  addressD: yup.string().required(<FormattedMessage id="requiredField" />),
  quota: yup
    .number()
    .max(7, <FormattedMessage id="quotaTooBig" />)
    .min(1, <FormattedMessage id="quotaTooSmall" />)
    .required(<FormattedMessage id="requiredField" />),
  date: yup.mixed().required(<FormattedMessage id="requiredField" />),
  hour: yup.string().required(<FormattedMessage id="requiredField" />),
  vehicle: yup.string().required(<FormattedMessage id="requiredField" />),
});

export const CrearViaje = (props) => {
  const { userBack } = useUserBack();
  var urlDriverTravel = URL + 'drivertravels';
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);

  const getVehicles = useMemo(
    () =>
      userBack?.vehicles?.map((vehicle) => (
        <option
          value={vehicle.id}
          key={vehicle.id}
        >{`${vehicle.brand} ${vehicle.serie}: ${vehicle.licensePlate}`}</option>
      )),
    [userBack],
  );

  const onSubmit = async (values) => {
    let {
      addressO: addressO_Id,
      addressD: addressD_Id,
      date: partDate,
      hour,
      quota,
      vehicle: vehicle_Id,
    } = values;
    let date = new Date(partDate + 'T' + hour);
    let travel = {
      spaceAvailable: quota,
      date: date.toISOString(),
      origin: addressO_Id,
      destination: addressD_Id,
      driver: userBack.id,
      vehicle: vehicle_Id,
    };
    travel = JSON.stringify(travel);

    fetch(urlDriverTravel, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: travel,
    })
      .then((response) => {
        if (response.status === 201) {
          toast.success(<FormattedMessage id="toast_success_createdTravel" />);
        } else {
          toast.success(<FormattedMessage id="toast_error_createdTravel" />);
        }
        return response.json();
      })
      .then((data) => {
        navigate(`/Viaje/${data.id}`);
      })
      .catch((error) => console.log('error', error));
  };

  useLayoutEffect(() => {
    fetch(`${URL}addresses`)
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
      });

    //console.log('data: ' + driverTravels);
  }, []);

  return (
    <>
      <div className="crearViaje-container">
        <h2>
          <FormattedMessage id="createTravel_tittle" />
        </h2>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => onSubmit(values)}
          initialValues={{
            addressO: '',
            addressD: '',
            quota: '',
            date: '',
            hour: '',
            vehicle: '',
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form
              className="createVehicle-form"
              noValidate
              onSubmit={handleSubmit}
            >
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="6"
                  sm="6"
                  controlId="validationFormikAddressO"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_addressO" />
                  </Form.Label>
                  <Form.Control
                    name="addressO"
                    value={values.addressO}
                    onChange={handleChange}
                    isInvalid={!!errors.addressO}
                    as={FormSelect}
                  >
                    <option value="">Escoje uno</option>
                    {addresses.map((a) => (
                      <option value={a.id} key={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.addressO}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6"
                  sm="6"
                  controlId="validationFormikAddressD"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_addressD" />
                  </Form.Label>
                  <Form.Control
                    name="addressD"
                    value={values.addressD}
                    onChange={handleChange}
                    isInvalid={!!errors.addressD}
                    as={FormSelect}
                  >
                    <option value="">Escoje uno</option>
                    {addresses.map((a) => (
                      <option value={a.id} key={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.addressD}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikQuota"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_quota" />
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="quota"
                    min={1}
                    max={7}
                    value={values.quota}
                    onChange={handleChange}
                    isInvalid={!!errors.quota}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quota}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikDate"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_date" />
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={values.date}
                    onChange={handleChange}
                    isInvalid={!!errors.date}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikHour"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_hour" />
                  </Form.Label>
                  <Form.Control
                    type="time"
                    name="hour"
                    value={values.hour}
                    onChange={handleChange}
                    isInvalid={!!errors.hour}
                  ></Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.hour}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikVehicle"
                >
                  <Form.Label>
                    <FormattedMessage id="createTravel_vehicle" />
                  </Form.Label>
                  <Form.Control
                    name="vehicle"
                    onChange={handleChange}
                    isInvalid={!!errors.vehicle}
                    as={FormSelect}
                  >
                    <option value="">Escoje uno</option>
                    {getVehicles}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.vehicle}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button type="submit">
                <FormattedMessage id="createTravel_tittle" />
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
