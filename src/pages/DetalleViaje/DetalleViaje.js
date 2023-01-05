import { useMemo, useState } from 'react';
import {
  Button,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingScreen from 'react-loading-screen';
import { Avatar } from '../../components/AvatarImage/Avatar';
import './DetalleViaje.scss';
import { FormattedMessage } from 'react-intl';
import { Preferences } from '../../components/Preferences/Preferences';
import { Icon } from '../../components/Icon/Icon';
import { StarsScore } from '../../components/StarsScore/StarsScore';
import { MapV2 } from '../../components/Map-v2/Map-v2';
import { URL } from '../../utils/DeployVariables';
import { useUserBack } from '../../context/UserContext';
import useFetch from '../../hooks/useFetch';
import {
  COLOR_PEWTER_BLUE,
  COLOR_PRIMARY,
  COLOR_SECUNDARY,
} from '../../data/constants';

export const DetalleViaje = (props) => {
  const navigate = useNavigate();

  const { userBack } = useUserBack();
  const { viajeId } = useParams();

  const { data, status, loading } = useFetch(`${URL}drivertravels/${viajeId}`);

  const viaje = useMemo(() => {
    return data;
  }, [data]);

  const getHour = () => {
    if (viaje !== null) {
      let date = new Date(viaje.date).toISOString();
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
    } else {
      return '';
    }
  };

  const verifyImage = (user, isUser) => {
    let src = null;
    if (user !== null) {
      src = user?.photo;
      if (
        src.includes('.png') ||
        src.includes('.jpg') ||
        src.includes('.jpeg')
      ) {
        if (isUser) {
          src = `${URL}users/${user.id}/image`;
        } else {
          src = `${URL}vehicles/${user.id}/image`;
        }
      }
    }
    return src;
  };

  /*Modal*/
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  /*Modal Delete*/
  const [showModalDelete, setShowModalDelete] = useState(false);
  const handleCloseModalDelete = () => setShowModalDelete(false);
  const handleShowModalDelete = () => setShowModalDelete(true);

  /*Button*/

  const onReserve = () => {
    fetch(`${URL}drivertravels/${viajeId}/reserved`, {
      method: 'POST',
    });

    fetch(`${URL}drivertravels/${viajeId}/passengers/${userBack.id}`, {
      method: 'POST',
    });
    setShowModal(false);
    /** 
     * onTriggerToast({
      header: 'Viaje Reservado',
      body: 'Se ha reservado existosamente tu viaje',
    });
     */
  };

  const getDate = () => {
    let date = new Date(viaje?.date);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    date = date.toLocaleDateString(props.locale, options);
    return date[0].toUpperCase() + date.substring(1);
  };

  const getAbrebiatonName = () => {
    if (viaje !== null) {
      let palabras = viaje.driver?.name.split(' ');
      for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i][0].toUpperCase();
      }
      return palabras[0] + palabras[1];
    } else {
      return '';
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <FormattedMessage id="detailTravel_tooltipMessage" />
    </Tooltip>
  );

  const getDestinations = useMemo(() => {
    let res = [];
    if (viaje !== null) {
      res.push(viaje?.origin);
      res.push(viaje?.destination);
    }
    return res;
  }, [viaje]);

  const getPreferences = useMemo(() => {
    return viaje !== null ? (
      <>
        {viaje.preferences?.map((p) => (
          <Row className="p-1" key={p.type}>
            <Preferences preference={p.type} />
          </Row>
        ))}
      </>
    ) : (
      <></>
    );
  }, [viaje]);

  const getPassengers = useMemo(() => {
    return viaje !== null ? (
      <>
        {viaje.passengers?.map((passenger) => (
          <Row
            className="Driver p-2"
            onClick={() => navigate(`/Profile/${passenger?.id}`)}
          >
            <Col md={4}>
              <Row>
                <p>{passenger?.name}</p>
              </Row>
            </Col>
            <Col md={2}>
              <Col>
                <Avatar
                  name={getAbrebiatonName()}
                  src={verifyImage(passenger, true)}
                  isVerified={passenger?.verifiedUser}
                />
              </Col>
              <Col>
                <Icon icon="chevron_right" />
              </Col>
            </Col>
          </Row>
        ))}
      </>
    ) : (
      <></>
    );
  }, [viaje]);

  const getButton = useMemo(() => {
    let res = <></>;

    if (userBack !== null) {
      if (userBack.id !== viaje?.driver?.id) {
        res = (
          <Button onClick={handleShowModal} disabled={userBack === null}>
            <FormattedMessage id="detailTravel_button" />
          </Button>
        );
      } else {
        res = (
          <Row className="justify-content-evenly">
            <Col xs={6} className="d-flex justify-content-center">
              <Button
                onClick={() => navigate(`/Viaje/${viajeId}/Edit`)}
                disabled={true}
                className="Button"
              >
                <FormattedMessage id="detailTravel_buttonEdit" />
                <Icon icon="edit" className="Icon" />
              </Button>
            </Col>
            <Col xs={6} className="d-flex justify-content-center">
              <Button
                onClick={handleShowModalDelete}
                disabled={userBack === null}
                className="Button"
              >
                <FormattedMessage id="detailTravel_buttonDelete" />
                <Icon icon="delete" className="Icon" />
              </Button>
            </Col>
          </Row>
        );
      }
    } else {
      res = (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <span>
            <Button onClick={handleShowModal} disabled={userBack === null}>
              <FormattedMessage id="detailTravel_button" />
            </Button>
          </span>
        </OverlayTrigger>
      );
    }

    return res;
  }, [userBack, viaje]);

  const getMap = useMemo(() => {
    return viaje !== null ? (
      <MapV2
        locale={props.locale}
        destinations={getDestinations}
        className="map"
        sm={{ order: 'last', span: 6 }}
        xs={{ order: 'fisrt', span: 12 }}
      />
    ) : (
      <></>
    );
  }, [viaje, props, getDestinations]);

  return (
    <>
      <LoadingScreen
        loading={loading}
        bgColor={COLOR_PRIMARY}
        spinnerColor={COLOR_PEWTER_BLUE}
        textColor={COLOR_SECUNDARY}
        logoSrc="../logo.png"
        text={<FormattedMessage id="loading" />}
      >
        <div className="container-fluid d-flex justify-content-center">
          {viaje !== null && status === 200 ? (
            <Row className="RowContent">
              <Col
                className="Detalle p-4"
                sm={{ order: 'fisrt', span: 6 }}
                xs={{ order: 'last', span: 12 }}
              >
                <div className="row">
                  <h2>{getDate()}</h2>
                  <h6>{getHour()}</h6>
                </div>
                <hr className="Divider" />
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <p>
                        <strong>Dirección de Origen: </strong>
                        {viaje.origin?.name} ({viaje.origin?.address})
                      </p>
                    </div>
                    <div className="row">
                      <p>
                        <strong>Dirección de Destino: </strong>
                        {viaje.destination?.name} ({viaje.destination?.address})
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="Divider" />
                <div className="row">
                  <div className="col">
                    <Row
                      className="Driver p-2"
                      onClick={() => navigate(`/Profile/${viaje.driver?.id}`)}
                    >
                      <Col xs={7}>
                        <Row>
                          <p>{viaje.driver?.name}</p>
                        </Row>
                        <Row className="Score">
                          <StarsScore score={parseFloat(viaje.driver?.score)} />
                        </Row>
                      </Col>
                      <Col xs={5}>
                        <Row className="align-items-center">
                          <Col xs={6}>
                            <Avatar
                              name={getAbrebiatonName()}
                              src={verifyImage(viaje.driver, true)}
                              isVerified={viaje.driver?.verifiedUser}
                            />
                          </Col>
                          <Col xs={6}>
                            <Icon icon="chevron_right" />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <hr />
                    <Row className="Preferences">
                      <Col>
                        <h5>
                          <FormattedMessage id="detailTravel_preferences" />
                        </h5>
                        {getPreferences}
                      </Col>
                    </Row>
                    <hr />
                    <Row className="Vehicle p-3">
                      <Col xs={3}>
                        <Avatar src={verifyImage(viaje.vehicle, false)} />
                      </Col>
                      <Col xs={{ span: 8, offset: 1 }}>
                        <Row>
                          <p>
                            <strong>
                              {viaje.vehicle?.brand} {viaje.vehicle?.serie}:
                            </strong>
                            {' ' + viaje.vehicle?.licensePlate}
                          </p>
                        </Row>
                        <Row className="Color">
                          <p>{viaje.vehicle?.color}</p>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </div>
                {viaje?.passengers.length !== 0 ? (
                  <>
                    <hr className="Divider" />
                    <h5>
                      <FormattedMessage id="detailTravel_passengers" />
                    </h5>
                    {getPassengers}
                    <hr />
                  </>
                ) : (
                  <></>
                )}
                {getButton}
              </Col>
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <FormattedMessage id="detailTravel_ModalTittle" />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FormattedMessage id="detailTravel_ModalBody" />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    <FormattedMessage id="detailTravel_ModalButtonCancel" />
                  </Button>
                  <Button variant="primary" onClick={() => onReserve()}>
                    <FormattedMessage id="detailTravel_ModalButtonAcept" />
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showModalDelete} onHide={handleCloseModalDelete}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <FormattedMessage id="detailTravel_ModalTittleDelete" />
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <FormattedMessage id="detailTravel_ModalBodyDelete" />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModalDelete}>
                    <FormattedMessage id="detailTravel_ModalButtonCancel" />
                  </Button>
                  <Button variant="primary" onClick={() => alert('eliminado')}>
                    <FormattedMessage id="detailTravel_ModalButtonAcept" />
                  </Button>
                </Modal.Footer>
              </Modal>
              {getMap}
            </Row>
          ) : (
            <>
              <div className="NoPage">
                <div className="NoPage-2">
                  <h1>
                    <FormattedMessage id="notfoundPage_tittle" />
                  </h1>
                  <h3>
                    <FormattedMessage id="notfoundPage_body" />
                  </h3>
                  <Link to="/">
                    <button className="NoPage-2-button">
                      <FormattedMessage id="notfoundPage_button" />
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </LoadingScreen>
    </>
  );
};
