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
  const [formValues, handleInputChange] = useForm({});
  let [searchParams, setSearchParams] = useSearchParams();

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
  }, [coordinatesD, coordinatesO, formValues]);

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
      <Navbar collapseOnSelect key={'sm'} expand={'sm'} bg={'light'}>
        <Container>
          <Navbar.Brand
            className="sm-auto tittle"
            onClick={() => navigate('/')}
          >
            Wheels
          </Navbar.Brand>
          <Nav className="sm-6">
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
                          <FloatingLabel
                            label={<FormattedMessage id="origin" />}
                          >
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
            <Nav className="sm-auto">
              <div className="landing-buttons-style" onClick={logIn}>
                <FormattedMessage id="login" />
                <Icon icon="account_circle" />
              </div>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
};
