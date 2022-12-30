import Form from 'react-bootstrap/Form';
import { Button, Col, FormSelect, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import './CreateVehicle.scss';
import { FormattedMessage } from 'react-intl';
import { useUserBack } from '../../context/UserContext';
import { URL } from '../../utils/DeployVariables';
import { toast } from 'react-toastify';

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
  soatExpedition: yup.mixed().required(<FormattedMessage id="requiredField" />),
  photo: yup.mixed().required(<FormattedMessage id="requiredField" />),
});

export const CreateVehicle = () => {
  const { userBack } = useUserBack();

  const onSubmit = (values) => {
    let { photo, ...data } = values;
    let date = new Date(data.soatExpedition);
    data = {
      ...data,
      user: userBack.id,
      photo: 'http://placeimg.com/640/480/transport',
      model: data.model + '',
      soatExpedition: date.toISOString(),
    };
    date.setFullYear(date.getFullYear() + 1);
    data = { ...data, soatExpiration: date.toISOString() };
    data = JSON.stringify(data);

    fetch(`${URL}vehicles/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        const formData = new FormData();
        formData.append('file', photo);

        fetch(`${URL}vehicles/${result.id}/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            toast.success(
              <FormattedMessage id="toast_success_createdVehicle" />,
            );
          })
          .catch((error) => console.log('error', error));
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <>
      <div className="createVehicle-container">
        <h2>
          <FormattedMessage id="createVehicle_tittle" />
        </h2>
        <Formik
          validationSchema={schema}
          onSubmit={(values) => onSubmit(values)}
          initialValues={{
            licensePlate: '',
            brand: '',
            serie: '',
            model: '',
            type: '',
            color: '',
            soatExpedition: '',
            photo: {},
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
                  sm="6"
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
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikBrand"
                >
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
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikSerie"
                >
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
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikModel"
                >
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
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikType"
                >
                  <Form.Label>
                    <FormattedMessage id="createVehicle_type" />
                  </Form.Label>
                  <Form.Control
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    isInvalid={!!errors.type}
                    as={FormSelect}
                  >
                    <option value="">Escoje uno</option>
                    <option value="CAR">Carro</option>
                    <option value="ELECTRICCAR">Carro eléctrico</option>
                    <option value="MOTORCYCLE">Motocicleta</option>
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="3"
                  sm="6"
                  controlId="validationFormikColor"
                >
                  <Form.Label>
                    <FormattedMessage id="createVehicle_color" />
                  </Form.Label>
                  <Form.Control
                    name="color"
                    value={values.color}
                    onChange={handleChange}
                    isInvalid={!!errors.color}
                    as={FormSelect}
                  >
                    <option value="">Escoje uno</option>
                    <option value="BLANCO">Blanco</option>
                    <option value="NEGRO">Negro</option>
                    <option value="AZUL">Azul</option>
                    <option value="ROJO">Rojo</option>
                    <option value="VERDE">Verde</option>
                    <option value="PLATEADO">Plateado</option>
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    {errors.color}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  as={Col}
                  md="6"
                  sm="12"
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
              <Row>
                <Form.Group
                  as={Col}
                  md="6"
                  sm="12"
                  controlId="validationFormikPhoto"
                >
                  <Form.Label>
                    <FormattedMessage id="createVehicle_photo" />
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".jpg, .png, .jpeg"
                    name="photo"
                    onChange={(e) => {
                      e.target.files[0] !== null
                        ? (values.photo = e.target.files[0])
                        : (values.photo = {});
                    }}
                    isInvalid={!!errors.photo}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.photo}
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
