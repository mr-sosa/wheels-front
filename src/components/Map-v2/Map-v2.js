import React, { useEffect, useRef, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import * as ttapi from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import './Map-v2.scss';
import { tomtom_key } from '../../utils/DeployVariables';
import { Col } from 'react-bootstrap';

const bogota = { lat: 4.60971, lng: -74.08175 };
export const MapV2 = ({ destinations, locale, ...rest }) => {
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [locations, setLocations] = useState({ str: '', count: 0 });
  var markers = [];

  const waypointMarker = (index, total) => {
    var container = document.createElement('div');
    container.className = 'waypoint-marker';
    if (index === 0) {
      container.className += ' tt-icon -start -white';
    } else if (index === total) {
      container.className += ' tt-icon -finish -white';
    } else {
      var number = document.createElement('div');
      number.innerText = index;
      container.appendChild(number);
    }
    return container;
  };

  useEffect(() => {
    tt.setProductInfo('Wheels', '1.0.0');
    let map = tt.map({
      key: tomtom_key,
      container: mapElement.current,
      zoom: 13,
      center: [bogota.lng, bogota.lat],
      language: locale,
      stylesVisibility: {
        trafficIncidents: true,
        poi: false,
      },
      // Disable interactions.
      doubleClickZoom: false,
      scrollZoom: false,
      dragPan: true,
      boxZoom: false,
      dragRotate: false,
      touchZoomRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
    });
    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    map.addControl(new tt.GeolocateControl());

    var attributions = [
      '<a target="_blank" href="https://www.tomtom.com/mapshare/tools/">Report map issue</a>',
      '<a target="_blank" href="//www.tomtom.com/en_gb/legal/privacy/" id="privacy_link">Privacy</a>',
    ];
    map.getAttributionControl().addAttribution(attributions);

    setMap(map);

    const getLocations = () => {
      let resultStr = '';
      let count = 0;

      if (destinations !== undefined) {
        destinations?.forEach((dest) => {
          if (dest.lng !== undefined && dest.lat !== undefined) {
            count += 1;
            resultStr += dest.lng + ',' + dest.lat + ':';
          }
        });
        resultStr = resultStr.substring(0, resultStr.length - 1);
      }

      setLocations({ str: resultStr, count: count });
      return { str: resultStr, count: count };
    };

    const drawMarkers = () => {
      let bounds = new tt.LngLatBounds();
      if (locations.length === 0) {
        return;
      }

      if (destinations !== undefined) {
        let maxIndex = destinations?.length - 1;
        destinations?.forEach((dest, index) => {
          let position = { lng: dest.lng, lat: dest.lat };

          let marker = new tt.Marker({
            element: waypointMarker(index, maxIndex),
          })
            .setLngLat(position)
            .addTo(map);
          markers.push(marker);
          bounds.extend(tt.LngLat.convert(position));
        });
      }
      map.fitBounds(bounds, { duration: 0, padding: 100 });
    };

    const updateRoutesBounds = (coordinates) => {
      var bounds = new tt.LngLatBounds();

      coordinates.forEach(function (point) {
        bounds.extend(tt.LngLat.convert(point));
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { duration: 0, padding: 100 });
      }
    };

    const calculateRoute = () => {
      let locations = getLocations();
      drawMarkers(locations.arr);
      if (locations.count < 2) {
        return;
      }
      ttapi.services
        .calculateRoute({
          key: tomtom_key,
          traffic: true,
          locations: locations.str,
        })
        .then((response) => {
          let geojson = response.toGeoJson();
          let route = map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: geojson,
            },
            paint: {
              'line-color': '#134074',
              'line-width': 6,
            },
          });

          var coordinates = geojson.features[0].geometry.coordinates;
          if (geojson.features[0].properties.segmentSummary.length > 1) {
            coordinates = [].concat.apply([], coordinates);
          }

          updateRoutesBounds(coordinates);
          drawMarkers();
        });
    };

    map.on('load', function () {
      calculateRoute();
    });

    return () => {
      map.remove();
    };
  }, [destinations, locale]);

  return <Col ref={mapElement} {...rest}></Col>;
};
