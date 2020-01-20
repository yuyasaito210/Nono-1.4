import React from 'react';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Dimensions, View, Image, Platform } from 'react-native';
import MapViewDirections from 'react-native-maps-directions';
import googleMapConfig from '~/common/config/googleMap';
import { W, H } from '~/common/constants';
import { generateColor } from '~/common/utils/gradientColor';
import defaultCurrentLocation from '~/common/config/locations';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const PIN_OPEN_IMAGE = require('~/common/assets/images/png/pin-open.png');
const PIN_CLOSE_IMAGE = require('~/common/assets/images/png/pin-close.png');
const PIN_SELECT_IMAGE = require('~/common/assets/images/png/pin-select.png');
const CURRENT_LOCATION_IMAGE = require('~/common/assets/images/png/currentLocation.png');

export default class CustomMapView extends React.Component {
  state = {
    mapView: null,
    directionCoordinates: []
  }

  handleUserLocationChange = (coordinate) => {
    console.log('===== handleUserLocationChange: ', coordinate);
  }

  render() {
    const { children } = this.props;
    const { selectedPlace, onDetectDirection } = this.props;
    const currentLocation = this.props.currentLocation || defaultCurrentLocation;
    const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios' 
      ? googleMapConfig.IOS_GOOGLE_MAPS_APIKEY
      : googleMapConfig.ANDROID_GOOGLE_MAPS_APIKEY;
    const region = {
      latitude: currentLocation.coordinate.latitude,
      longitude: currentLocation.coordinate.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    console.log('==== currentLocation: ', currentLocation);
    console.log('==== selectedPlace: ', selectedPlace);

    return (
      <View 
        style={{
          position: 'absolute', left: 0, top: 0,
          width: W, height: H, zIndex: 10
        }}
      >
        <React.Fragment>
          <MapView 
            style={{width: '100%', height: '100%'}}
            initialRegion={region}
            provider={PROVIDER_GOOGLE}
            mapType={Platform.OS == "android" ? "terrain" : "standard"}
            // showsUserLocation={true}
            // showsMyLocationButton={true}
            // followsUserLocation={true}

            showsCompass={true}
            showsTraffic={true}
            rotateEnabled={true}
            loadingEnabled={true}
            showsBuildings={true}
            pitchEnabled={true}
            ref={c => this.mapView = c}
            onUserLocationChange={this.handleUserLocationChange}
          >
            { this.renderMarkers() }
            {(selectedPlace && selectedPlace.coordinate && currentLocation.coordinate) && 
              <MapViewDirections
                origin={currentLocation.coordinate}
                destination={selectedPlace.coordinate}
                apikey={GOOGLE_MAPS_APIKEY}
                mode={'WALKING'}
                strokeWidth={0}
                strokeColor="hotpink"
                optimizeWaypoints={true}
                precision={'high'}
                onStart={(params) => {
                  console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
                onReady={result => {
                  console.log(`==== Distance: ${result.distance} km`)
                  console.log(`==== Duration: ${result.duration} min.`)
                  console.log('====== result: ', result);
                  onDetectDirection && onDetectDirection({
                    distance: Math.round(result.distance * 100),
                    duration: Math.round(result.duration)
                  })
                  var directionCoordinates = [];
                  directionCoordinates.push(currentLocation.coordinate);
                  for(var i = 0; i < result.coordinates.length - 1; i++) {
                    var coord = result.coordinates[i];
                    directionCoordinates.push(coord);
                  }
                  directionCoordinates.push(selectedPlace.coordinate);
                  this.mapView && this.mapView.fitToCoordinates(directionCoordinates, {
                    edgePadding: {
                      right: (width / 20),
                      bottom: (height / 20),
                      left: (width / 20),
                      top: (height / 20),
                    }
                  });
                  this.setState({directionCoordinates});
                }}
                onError={(errorMessage) => {
                  console.log('==== GOT AN ERROR');
                }}
              />
            }
            { selectedPlace && this.renderCustomDirection() }
          </MapView>
          { children && children }
        </React.Fragment>
      </View>      
    )
  }

  renderMarkers() {
    const { places, selectedPlace } = this.props
    const currentLocation = this.props.currentLocation || defaultCurrentLocation;
    const selectedIndex = places.findIndex(p => {return selectedPlace && p.name === selectedPlace.name});
    var placeImage = PIN_OPEN_IMAGE;
   
    return (
      <React.Fragment>
        {places && Object.keys(places).map((key, index) => {
          const place = places[key];
          console.log('===== key: index: ', key, index, (selectedPlace && (key === `${selectedIndex}`)))
          if (place){
            if (selectedPlace && (key === `${selectedIndex}`)) placeImage = PIN_SELECT_IMAGE;
            else placeImage = place.isOpened ? PIN_OPEN_IMAGE : PIN_CLOSE_IMAGE;
            console.log('===== placeImage: ', placeImage);
            return (
              <MapView.Marker
                key={`station-${index}`}
                title={place.name} 
                coordinate={place.coordinate}
                onPress={() => this.props.onSelectMarker(key)}
              >
                <Image
                  source={placeImage}
                  style={{width: 40, height: 40}}
                />            
              </MapView.Marker>
              );
            }
          })
        }
        { currentLocation.coordinate && this.renderCurrentLocationMarker() }
      </React.Fragment>
    )
  }

  renderCurrentLocationMarker() {
    const currentLocation = this.props.currentLocation || defaultCurrentLocation;

    return (
      <MapView.Marker
        key={'my-location'}
        coordinate={currentLocation.coordinate}
        anchor={{x: 0.5, y: 0.5}}
        // title={'Me'}
      >
        <Image
          source={CURRENT_LOCATION_IMAGE}
          style={{width: 44, height: 40}}
        />
      </MapView.Marker>
    )
  }

  renderCustomDirection() {
    const { directionCoordinates } = this.state;
    const startColor = '#FFDF00';
    const endColor = '#FF52A8';
    const strokeColors = generateColor(
      startColor,
      endColor,
      directionCoordinates ? directionCoordinates.length : 1
    );

    return (
      <MapView.Polyline
        coordinates={directionCoordinates}
        strokeWidth={4}
        strokeColor={startColor}
        strokeColors={strokeColors}
      />
    )
  }
}
