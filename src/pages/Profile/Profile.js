import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from '../../components/AvatarImage/Avatar';
import { Icon } from '../../components/Icon/Icon';
import { Preferences } from '../../components/Preferences/Preferences';
import { StarsScore } from '../../components/StarsScore/StarsScore';
import { URL } from '../../utils/DeployVariables';
import './Profile.scss';

export const Profile = (props) => {
  let { userId } = useParams();
  const [userBack, setUserBack] = useState();
  const [resStatus, setResStatus] = useState(0);

  const getAbrebiatonName = () => {
    if (userBack != null) {
      let palabras = userBack?.name.split(' ');
      for (let i = 0; i < palabras.length; i++) {
        palabras[i] = palabras[i][0].toUpperCase();
      }
      return palabras[0] + palabras[1];
    } else {
      return 'NN';
    }
  };

  const getAge = () => {
    let res = '';
    if (userBack != null) {
      let birthDate = new Date(userBack.birthDate);
      if (birthDate.getFullYear() === 1000) {
        res = <></>;
      } else {
        let today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var month = today.getMonth() - birthDate.getMonth();

        if (
          month < 0 ||
          (month === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        res = (
          <>
            {age} <FormattedMessage id="profile_years" />
          </>
        );
      }
    }
    return res;
  };

  const getOpinion = () => {
    let res = userBack.score + '/5';
    if (userBack.opinionsReceived.length !== 0) {
      res =
        userBack.score +
        '/5 - ' +
        userBack.opinionsReceived.length +
        ' ' +
        <FormattedMessage id="profile_opinion" />;
    }
    return res;
  };

  const getCreatedDate = () => {
    let date = new Date(userBack?.createdDate);
    const options = {
      year: 'numeric',
      month: 'long',
    };
    date = date.toLocaleDateString(props.locale, options);
    return date[0].toUpperCase() + date.substring(1);
  };

  useEffect(() => {
    fetch(`${URL}users/${userId}`)
      .then((res) => {
        setResStatus(res.status);
        return res.json();
      })
      .then((data) => {
        setUserBack(data);
      });
  }, [userId]);

  return (
    <>
      {userBack && resStatus === 200 ? (
        <>
          <div className="container-fluid Profile p-4">
            <Row className="mb-3 Part1">
              <Col sm={8} className="Col1">
                <Row>
                  <h3>{userBack.name}</h3>
                </Row>
                <Row>
                  <small>{getAge()}</small>
                </Row>
              </Col>
              <Col sm={3} className="Col2">
                <Avatar
                  name={getAbrebiatonName()}
                  src={userBack?.photo}
                  isVerified={userBack?.verifiedUser}
                />
              </Col>
            </Row>
            <Row className="Part1-2">
              <Col className="Col1" sm={2}>
                <StarsScore score={parseFloat(userBack.score)} />
              </Col>
              <Col className="d-flex">{getOpinion()}</Col>
              <Col sm={2}>
                <Icon icon="chevron_right" />
              </Col>
            </Row>
            <hr />
            <Row className="Part2">
              <Col>
                {userBack.verifiedMail ? (
                  <Row className="p-2">
                    <Col sm={2} className="Col1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path
                            d="m12 1c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11zm5.72 8.57-6 6.25c-.19.2-.46.3-.72.3-.22 0-.45-.07-.63-.22l-4-3.25c-.43-.35-.49-.98-.15-1.41.35-.42.98-.49 1.41-.14l3.29 2.67 5.36-5.59c.38-.39 1.02-.4 1.41-.03.4.38.41 1.02.03 1.42z"
                            fill="#1e3048"
                            data-original="#2c96ff"
                          ></path>
                        </g>
                      </svg>
                    </Col>
                    <Col className="Col2">
                      <FormattedMessage id="profile_verifiedMail" />
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {userBack.verifiedPhone ? (
                  <Row className="p-2">
                    <Col sm={2} className="Col1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path
                            d="m12 1c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11zm5.72 8.57-6 6.25c-.19.2-.46.3-.72.3-.22 0-.45-.07-.63-.22l-4-3.25c-.43-.35-.49-.98-.15-1.41.35-.42.98-.49 1.41-.14l3.29 2.67 5.36-5.59c.38-.39 1.02-.4 1.41-.03.4.38.41 1.02.03 1.42z"
                            fill="#1e3048"
                            data-original="#2c96ff"
                          ></path>
                        </g>
                      </svg>
                    </Col>
                    <Col className="Col2">
                      <FormattedMessage id="profile_verifiedPhone" />
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {userBack.verifiedIC ? (
                  <Row className="p-2">
                    <Col sm={2} className="Col1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path
                            d="m12 1c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11zm5.72 8.57-6 6.25c-.19.2-.46.3-.72.3-.22 0-.45-.07-.63-.22l-4-3.25c-.43-.35-.49-.98-.15-1.41.35-.42.98-.49 1.41-.14l3.29 2.67 5.36-5.59c.38-.39 1.02-.4 1.41-.03.4.38.41 1.02.03 1.42z"
                            fill="#1e3048"
                            data-original="#2c96ff"
                          ></path>
                        </g>
                      </svg>
                    </Col>
                    <Col className="Col2">
                      <FormattedMessage id="profile_verifiedIC" />
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {userBack.verifiedDrivingPass ? (
                  <Row className="p-2">
                    <Col sm={2} className="Col1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <path
                            d="m12 1c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11zm5.72 8.57-6 6.25c-.19.2-.46.3-.72.3-.22 0-.45-.07-.63-.22l-4-3.25c-.43-.35-.49-.98-.15-1.41.35-.42.98-.49 1.41-.14l3.29 2.67 5.36-5.59c.38-.39 1.02-.4 1.41-.03.4.38.41 1.02.03 1.42z"
                            fill="#1e3048"
                            data-original="#2c96ff"
                          ></path>
                        </g>
                      </svg>
                    </Col>
                    <Col className="Col2">
                      <FormattedMessage id="profile_verifiedDrivingPass" />
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
                {userBack.verifiedUser ? (
                  <Row className="p-2">
                    <Col sm={2} className="Col1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="512"
                        height="512"
                        x="0"
                        y="0"
                        viewBox="0 0 24 24"
                      >
                        <g>
                          <g id="Layer_2" data-name="Layer 2">
                            <path
                              d="m21.187 10.007a3.457 3.457 0 0 1 -.864-.712 3.378 3.378 0 0 1 .277-1.141c.291-.821.62-1.751.092-2.474s-1.525-.7-2.4-.68a3.422 3.422 0 0 1 -1.155-.078 3.369 3.369 0 0 1 -.425-1.063c-.248-.845-.531-1.8-1.4-2.086-.838-.27-1.614.324-2.3.846a3.285 3.285 0 0 1 -1.012.631 3.285 3.285 0 0 1 -1.023-.631c-.684-.519-1.457-1.119-2.299-.845-.867.282-1.15 1.24-1.4 2.085a3.418 3.418 0 0 1 -.421 1.061 3.482 3.482 0 0 1 -1.157.08c-.878-.024-1.867-.05-2.4.68s-.2 1.653.092 2.473a3.336 3.336 0 0 1 .281 1.141 3.449 3.449 0 0 1 -.863.713c-.732.5-1.563 1.069-1.563 1.993s.831 1.491 1.563 1.993a3.449 3.449 0 0 1 .863.712 3.335 3.335 0 0 1 -.273 1.142c-.29.82-.618 1.75-.091 2.473s1.521.7 2.4.68a3.426 3.426 0 0 1 1.156.078 3.4 3.4 0 0 1 .424 1.063c.248.845.531 1.8 1.4 2.086a1.424 1.424 0 0 0 .431.068 3.382 3.382 0 0 0 1.868-.914 3.285 3.285 0 0 1 1.012-.631 3.285 3.285 0 0 1 1.023.631c.685.523 1.461 1.12 2.3.845.867-.282 1.15-1.24 1.4-2.084a3.388 3.388 0 0 1 .424-1.062 3.425 3.425 0 0 1 1.153-.08c.878.021 1.867.05 2.4-.68s.2-1.653-.092-2.474a3.38 3.38 0 0 1 -.281-1.139 3.436 3.436 0 0 1 .864-.713c.732-.5 1.563-1.07 1.563-1.994s-.834-1.492-1.567-1.993z"
                              fill="#1e3048"
                              data-original="#49adf4"
                              class=""
                            ></path>
                            <path
                              d="m11 14.75a.745.745 0 0 1 -.53-.22l-2-2a.75.75 0 0 1 1.06-1.06l1.54 1.54 3.48-2.61a.75.75 0 0 1 .9 1.2l-4 3a.751.751 0 0 1 -.45.15z"
                              fill="#ffffff"
                              data-original="#ffffff"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    </Col>
                    <Col className="Col2">
                      <FormattedMessage id="profile_verifiedUser" />
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
            <hr className="Divider" />
            <Row className="Part3">
              <Col>
                <h5>
                  <FormattedMessage id="profile_about" />{' '}
                  {userBack?.name.split(' ')[0]}
                </h5>
                <Row>{userBack?.about}</Row>
                <hr />
                {userBack?.preferences.map((p) => (
                  <Row className="p-1" key={p.type}>
                    <Preferences preference={p.type} />
                  </Row>
                ))}
              </Col>
            </Row>
            <hr className="Divider" />
            <Row className="Part4">
              <Col>
                <Row className="p-1">
                  {userBack?.driverTravelsByDriver.length}{' '}
                  <FormattedMessage id="profile_travels" />
                </Row>
                <Row className="p-1">
                  <FormattedMessage id="profile_UserSince" />
                  {getCreatedDate()}
                </Row>
              </Col>
            </Row>
          </div>
        </>
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
    </>
  );
};
