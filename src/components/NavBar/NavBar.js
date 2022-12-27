import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  Navbar,
  Container,
  Form,
  Button,
  Nav,
  InputGroup,
  Popover,
  OverlayTrigger,
  ListGroup,
  Spinner,
  Offcanvas,
  FloatingLabel,
  Col,
  Row,
} from 'react-bootstrap';
import './NavBar.scss';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import { Icon } from '../Icon/Icon';
import { Avatar } from '../AvatarImage/Avatar';
import { useUserBack } from '../../context/UserContext';
import { URL } from '../../utils/DeployVariables';

const searchOptions = {
  componentRestrictions: { country: 'col' },
};

export const NavBar = () => {
  const navigate = useNavigate();
  /** User */
  const { userBack, logIn, logOut, makeDriver } = useUserBack();

  /** AutoComplete */

  /*
  const searchOptions = {
    key: tomtom_key,
    limit: 10,
    language: 'en-Gb',
  };

  const seachBoxOptions = {
    minNumberOfCharacters: 2,
    autocompleteOptions: {
      key: tomtom_key,
      language: 'en-GB',
    },
    labels: {
      noResultsMessage: 'No results found.',
    },
    searchOptions: searchOptions,
  };

  const addORef = useRef();
  const addO = document.getElementById('AddO');
  const ttSearchBox = new SearchBox(ttapi, seachBoxOptions);
  const searchBoxHTML = ttSearchBox.getSearchBoxHTML();

  ttSearchBox.on();
  useLayoutEffect(() => {
    if (addO !== null) {
      let x = document.createElement('li');
      x.innerHTML += 'content';
      addO.appendChild(searchBoxHTML);
    }
    console.log(addO);
  }, [addORef.current]);

  */

  /**Offcanvas - Menu*/
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  /**  Places */
  const originRef = useRef();
  const destinationRef = useRef();

  /** Address Origin */
  const [addressO, setAddressO] = useState('');
  const [coordinatesO, setCoordinatesO] = React.useState({
    lat: null,
    lng: null,
  });

  const handleChangeO = (value) => {
    setAddressO(value);
  };

  const handleSelectO = async (value) => {
    const results = await geocodeByAddress(value);

    const latLng = await getLatLng(results[0]);

    setCoordinatesO(latLng);
    setAddressO(value);
    document.getElementById('AddressD').focus();
  };

  /** Address Destination */
  const [addressD, setAddressD] = useState('');
  const [coordinatesD, setCoordinatesD] = React.useState({
    lat: null,
    lng: null,
  });

  const handleChangeD = (value) => {
    setAddressD(value);
  };

  const handleSelectD = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setCoordinatesD(latLng);
    setAddressD(value);
    document.getElementById('quota').focus();
  };

  /** Date */
  let date = new Date();
  const outputDate =
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0');

  /** Search */
  // eslint-disable-next-line no-unused-vars
  let [searchParams, setSearchParams] = useSearchParams();
  const [formValues, handleInputChange] = useForm({});

  const search = useCallback(() => {
    let params = { state: 'OPEN' };
    let { date, quota } = formValues;
    if (quota !== undefined) {
      params = { ...params, quota };
    }
    if (date !== undefined) {
      let newDate = new Date(date);
      params = { ...params, date: newDate.toISOString() };
    }
    if (coordinatesO.lat !== null && coordinatesO.lng !== null) {
      params = {
        ...params,
        originLat: coordinatesO.lat,
        originLng: coordinatesO.lng,
      };
    }
    if (coordinatesD.lat !== null && coordinatesD.lng !== null) {
      params = {
        ...params,
        destinationLat: coordinatesD.lat,
        destinationLng: coordinatesD.lng,
      };
    }
    setSearchParams(params);
  }, [
    coordinatesD.lat,
    coordinatesD.lng,
    coordinatesO.lat,
    coordinatesO.lng,
    formValues,
    setSearchParams,
  ]);

  /**User  */

  const getAbrebiatonName = () => {
    if (userBack !== null) {
      let palabras = userBack?.name?.split(' ');
      for (let i = 0; i < palabras?.length; i++) {
        palabras[i] = palabras[i][0]?.toUpperCase();
      }
      return palabras[0] + palabras[1];
    } else {
      return 'NN';
    }
  };

  const verifyImage = () => {
    let src = null;
    if (userBack !== null) {
      src = userBack?.photo;
      if (
        src.includes('.png') ||
        src.includes('.jpg') ||
        src.includes('.jpeg')
      ) {
        src = `${URL}users/${userIdBack}/image`;
      }
    }
    return src;
  };

  const [userIdBack, setUserIdBack] = useState();
  useLayoutEffect(() => {
    setUserIdBack(localStorage.getItem('idUserBack'));
    if (userBack !== null) {
      setUserIdBack(userBack.id);
    }
  }, [userBack]);

  return (
    <>
      <Navbar bg={'light'}>
        <Navbar.Brand className="Tittle" onClick={() => navigate('/')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="512"
            height="512"
            x="0"
            y="0"
            viewBox="0 0 512 512"
            className="Logo"
          >
            <g>
              <g xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M150.861,415.253H68.295c-9.161,0-16.588-7.427-16.588-16.588c0-9.161,7.427-16.588,16.588-16.588   h82.566c9.161,0,16.588,7.427,16.588,16.588C167.449,407.826,160.022,415.253,150.861,415.253z"
                  fill="#a5f6ff"
                  data-original="#a5f6ff"
                ></path>
                <path
                  d="M293.6,474.4H18.299c-9.161,0-16.588-7.427-16.588-16.588c0-9.161,7.427-16.588,16.588-16.588H293.6   c9.161,0,16.588,7.427,16.588,16.588C310.188,466.972,302.762,474.4,293.6,474.4z"
                  fill="#a5f6ff"
                  data-original="#a5f6ff"
                ></path>
                <path
                  d="M293.6,70.777H91.789c-9.161,0-16.588-7.427-16.588-16.588S82.628,37.6,91.789,37.6H293.6   c9.161,0,16.588,7.427,16.588,16.588S302.762,70.777,293.6,70.777z"
                  fill="#a5f6ff"
                  data-original="#a5f6ff"
                ></path>
                <path
                  d="M136.908,145.414H16.588C7.427,145.414,0,137.987,0,128.826s7.427-16.588,16.588-16.588h120.319   c9.161,0,16.588,7.427,16.588,16.588S146.069,145.414,136.908,145.414z"
                  fill="#a5f6ff"
                  data-original="#a5f6ff"
                ></path>
              </g>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M293.6,474.4c-120.425,0-218.399-97.974-218.399-218.4S173.174,37.6,293.6,37.6  s218.399,97.974,218.399,218.399S414.026,474.4,293.6,474.4z"
                fill="#444444"
                data-original="#444444"
              ></path>
              <circle
                xmlns="http://www.w3.org/2000/svg"
                cx="293.604"
                cy="256.004"
                r="118.906"
                fill="#ffffff"
                data-original="#ffffff"
              ></circle>
              <circle
                xmlns="http://www.w3.org/2000/svg"
                cx="293.604"
                cy="256.004"
                r="41.634"
                fill="#ff5e8d"
                data-original="#ff5e8d"
              ></circle>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M293.6,120.507c-74.711,0-135.493,60.782-135.493,135.493c0,44.553,21.619,84.15,54.915,108.86  c0.305,0.258,0.608,0.518,0.937,0.755c0.37,0.269,0.749,0.52,1.132,0.754c22.164,15.811,49.269,25.123,78.509,25.123  c29.24,0,56.344-9.312,78.509-25.123c0.384-0.234,0.762-0.485,1.132-0.754c0.328-0.239,0.632-0.499,0.937-0.755  c33.295-24.71,54.915-64.306,54.915-108.86C429.093,181.29,368.311,120.507,293.6,120.507z M384.478,209.03l-42.956,13.958  c-7.461-10.798-18.472-18.958-31.333-22.789v-45.163C342.56,160.336,369.869,180.877,384.478,209.03z M268.555,255.999  c0-13.81,11.235-25.045,25.045-25.045c13.81,0,25.045,11.235,25.045,25.045s-11.235,25.045-25.045,25.045  C279.789,281.045,268.555,269.811,268.555,255.999z M277.011,155.036v45.163c-12.863,3.831-23.872,11.99-31.334,22.789  l-42.955-13.958C217.332,180.877,244.641,160.336,277.011,155.036z M191.285,255.999c0-5.242,0.398-10.393,1.162-15.425  l42.968,13.962c-0.012,0.488-0.038,0.972-0.038,1.463c0,13.296,4.49,25.558,12.02,35.371l-26.53,36.516  C202.589,309.394,191.285,283.993,191.285,255.999z M293.6,358.316c-16.501,0-32.099-3.931-45.915-10.899l26.536-36.522  c6.066,2.148,12.586,3.329,19.379,3.329c6.792,0,13.313-1.181,19.379-3.329l26.536,36.522  C325.699,354.384,310.101,358.316,293.6,358.316z M366.332,327.886l-26.53-36.514c7.53-9.813,12.02-22.075,12.02-35.371  c0-0.491-0.024-0.975-0.038-1.463l42.968-13.962c0.764,5.032,1.162,10.183,1.162,15.425  C395.916,283.993,384.612,309.393,366.332,327.886z"
                fill="#ffa358"
                data-original="#ffa358"
              ></path>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M512,255.999C512,135.574,414.026,37.6,293.6,37.6V474.4C414.026,474.4,512,376.426,512,255.999z"
                fill="#282828"
                data-original="#282828"
              ></path>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M412.505,255.999c0-65.669-53.236-118.905-118.905-118.905v237.81  C359.269,374.904,412.505,321.669,412.505,255.999z"
                fill="#fff6a4"
                data-original="#fff6a4"
              ></path>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M335.235,255.999c0-22.994-18.64-41.634-41.634-41.634v83.268  C316.594,297.634,335.235,278.993,335.235,255.999z"
                fill="#ff3da8"
                data-original="#ff3da8"
              ></path>
              <path
                xmlns="http://www.w3.org/2000/svg"
                d="M318.646,255.999c0,13.81-11.235,25.045-25.045,25.045v33.177c6.792,0,13.313-1.181,19.379-3.329  l26.536,36.522c-13.816,6.967-29.413,10.899-45.915,10.899v33.177c29.24,0,56.344-9.312,78.509-25.123  c0.384-0.234,0.762-0.485,1.132-0.754c0.328-0.239,0.631-0.499,0.937-0.755c33.295-24.71,54.915-64.306,54.915-108.86  c0-74.711-60.782-135.493-135.493-135.493v110.447C307.411,230.954,318.646,242.189,318.646,255.999z M394.754,240.574  c0.764,5.032,1.162,10.183,1.162,15.425c0,27.994-11.304,53.394-29.583,71.885l-26.53-36.514c7.53-9.813,12.02-22.075,12.02-35.371  c0-0.491-0.024-0.975-0.038-1.463L394.754,240.574z M310.188,155.036c32.371,5.301,59.68,25.841,74.29,53.993l-42.956,13.958  c-7.461-10.798-18.472-18.958-31.333-22.789V155.036z"
                fill="#ff8273"
                data-original="#ff8273"
              ></path>
            </g>
          </svg>
          Wheels
        </Navbar.Brand>
        <Nav className="SearchBox">
          <Form className="d-flex">
            <InputGroup>
              {/*
                <div ref={addORef} id="AddO"></div>
                */}

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
                      trigger={['focus']}
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
                            {suggestions.map((suggestion, i) => {
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
                                  key={i}
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
                        <FloatingLabel label={<FormattedMessage id="origin" />}>
                          <Form.Control
                            type="text"
                            name="AddressO"
                            id="AddressO"
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
                      trigger={['focus']}
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
                            {suggestions.map((suggestion, i) => {
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
                                  key={i}
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
                          label={<FormattedMessage id="destination" />}
                        >
                          <Form.Control
                            type="text"
                            name="AddressD"
                            id="AddressD"
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

              <Col>
                <FloatingLabel label={<FormattedMessage id="date" />}>
                  <Form.Control
                    aria-label="Date"
                    type="date"
                    name="date"
                    id="date"
                    defaultValue={outputDate}
                    min={outputDate}
                    onChange={(e) => handleInputChange(e)}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel label={<FormattedMessage id="quota" />}>
                  <Form.Control
                    aria-label="quota"
                    type="number"
                    name="quota"
                    id="quota"
                    min={1}
                    onChange={(e) => handleInputChange(e)}
                  />
                </FloatingLabel>
              </Col>
              <Col className="d-flex ">
                <Button variant="outline-success" onClick={search}>
                  <FormattedMessage id="search" />
                </Button>
              </Col>
            </InputGroup>
          </Form>
        </Nav>
        {userIdBack !== null ? (
          <>
            <div
              className="landing-buttons-style"
              onClick={handleShowOffcanvas}
            >
              <span className="material-symbols-outlined">menu</span>
            </div>
            <Offcanvas
              show={showOffcanvas}
              onHide={handleCloseOffcanvas}
              placement={'end'}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="Menu-Body">
                <Container className="Menu-Body-Options">
                  <Row>
                    <Col
                      className="Profile"
                      onClick={() => navigate(`/Profile/${userBack.id}`)}
                    >
                      <Avatar
                        name={getAbrebiatonName()}
                        src={verifyImage()}
                        isVerified={userBack?.verifiedUser}
                      />
                      <h5>{userBack?.name}</h5>
                    </Col>
                  </Row>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Historial de Viajes</ListGroup.Item>

                    {userBack && userBack?.isDriver ? (
                      <>
                        <ListGroup.Item as={Link} to={'/CrearViaje'}>
                          Crear Viaje
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Historial de Viajes realizados
                        </ListGroup.Item>
                        <ListGroup.Item as={Link} to={'/CreateVehicle'}>
                          Mis vehiculos
                        </ListGroup.Item>
                      </>
                    ) : (
                      <>
                        <ListGroup.Item onClick={makeDriver}>
                          Hazte contuctor
                        </ListGroup.Item>
                      </>
                    )}
                  </ListGroup>
                </Container>
                <div className="Menu-Body-Logout mb-12" onClick={logOut}>
                  <Icon icon="logout" />
                  <div>
                    <FormattedMessage id="logout" />
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        ) : (
          <Nav className="Button">
            <div className="landing-buttons-style" onClick={logIn}>
              <FormattedMessage id="login" />
              <Icon icon="account_circle" />
            </div>
          </Nav>
        )}
      </Navbar>
    </>
  );
};
