import Form from 'react-bootstrap/Form';
import { Button, Col, FormSelect, Row } from 'react-bootstrap';
import { useForm } from '../../hooks/useForm';
import { Formik } from 'formik';
import * as yup from 'yup';
import './CreateVehicle.scss';
import { FormattedMessage } from 'react-intl';

const schema = yup.object().shape({
  licensePlate: yup
    .string()
    .required(<FormattedMessage id="requiredField" />)
    .matches(
      /(^[A-Z]{3})-(([0-9]{2})([A-Z]{1})|([0-9]{3}))$/,
      <FormattedMessage id="createVehicle_licencePlate_invalid" />,
    ),
  brand: yup
    .string()
    .required(<FormattedMessage id="requiredField" />)
    .max(20, <FormattedMessage id="textTooLong" />),
  serie: yup
    .string()
    .required(<FormattedMessage id="requiredField" />)
    .max(20, <FormattedMessage id="textTooLong" />),
  model: yup
    .number()
    .required(<FormattedMessage id="requiredField" />)
    .min(2000, <FormattedMessage id="createVehicle_model_invalid" />),
  type: yup.string().required(<FormattedMessage id="requiredField" />),
  color: yup.string().required(<FormattedMessage id="requiredField" />),
  photo: yup.mixed().required(<FormattedMessage id="requiredField" />),
  soatExpedition: yup.mixed().required(<FormattedMessage id="requiredField" />),
});

export const CreateVehicle = () => {
  var URL = process.env.REACT_APP_DEV_BACK_URL;
  const isProd =
    process.env.REACT_APP_IS_PRODUCTION.toLocaleUpperCase === 'TRUE';
  if (isProd) {
    URL = process.env.REACT_APP_PROD_BACK_URL;
  }

  const [formValues, handleInputChange] = useForm({});

  const onSubmit = () => {};
  return (
    <>
      <div className="createVehicle-container">
        <h2>
          <FormattedMessage id="createVehicle_tittle" />
        </h2>
        <Formik
          validationSchema={schema}
          onSubmit={console.log}
          initialValues={{
            licensePlate: '',
            brand: '',
            serie: '',
            model: '',
            type: '',
            color: '',
            soatExpedition: '',
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
                  md="3"
                  controlId="validationFormikLicensePlate"
                >
                  <Form.Label>
                    <FormattedMessage id="createVehicle_licencePlate" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="licensePlate"
                    value={values.licensePlate}
                    onChange={handleChange}
                    maxLength={7}
                    isInvalid={!!errors.licensePlate}
                    isValid={touched.licensePlate && !errors.licensePlate}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.licensePlate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormikBrand">
                  <Form.Label>
                    <FormattedMessage id="createVehicle_brand" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    maxLength={25}
                    value={values.brand}
                    onChange={handleChange}
                    isInvalid={!!errors.brand}
                    isValid={touched.brand && !errors.brand}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormikSerie">
                  <Form.Label>
                    <FormattedMessage id="createVehicle_serie" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="serie"
                    maxLength={25}
                    value={values.serie}
                    onChange={handleChange}
                    isInvalid={!!errors.serie}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.serie}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormikModel">
                  <Form.Label>
                    <FormattedMessage id="createVehicle_model" />
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="model"
                    placeholder="2015"
                    min={2000}
                    max={new Date().getFullYear()}
                    value={values.model}
                    onChange={handleChange}
                    isInvalid={!!errors.model}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.model}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="3" controlId="validationFormikType">
                  <Form.Label>
                    <FormattedMessage id="createVehicle_type" />
                  </Form.Label>
                  <Form.Control
                    name="type"
                    onChange={handleChange}
                    isInvalid={!!errors.type}
                    as={FormSelect}
                  >
                    <option value="">Choose One</option>
                    <option value="CAR">Car</option>
                    <option value="ELECTRICCAR">Electric car</option>
                    <option value="MOTORCYCLE">Mototrcycle</option>
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="validationFormikColor">
                  <Form.Label>
                    <FormattedMessage id="createVehicle_color" />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    maxLength={15}
                    value={values.color}
                    onChange={handleChange}
                    isInvalid={!!errors.color}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.color}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  md="6"
                  controlId="validationFormikSoatExpedition"
                >
                  <Form.Label>
                    <FormattedMessage id="createVehicle_soatExpedition" />
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="soatExpedition"
                    value={values.soatExpedition}
                    onChange={handleChange}
                    isInvalid={!!errors.soatExpedition}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.soatExpedition}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Button type="submit">
                <FormattedMessage id="createVehicle_tittle" />
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};
