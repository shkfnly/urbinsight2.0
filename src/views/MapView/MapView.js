import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import DataInputLayout from 'layouts/DataInputLayout/DataInputLayout'
import DataDashboardLayout from 'layouts/DataDashboardLayout/DataDashboardLayout'
import { connect } from 'react-redux'
import { requestSurveys } from 'redux/modules/survey'
// import MapGL from 'react-map-gl'
const cityObject = {
  cusco: [-71.9675, -13.5320],
  medellin: [-75.5812, 6.2442],
  abudhabi: [54.36745, 24.47608],
  lima: [-77.0428, -12.0464],
  budapest: [19.0402, 47.4979]
}
const cityList = ['cusco', 'medellin', 'abudhabi', 'lima', 'budapest']

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
// need one of these for parcel request
function cityObjectFunc (city) {
  if (Object.keys(cityObject).indexOf(city) !== -1) {
    return cityObject[city]
  } else {
    return cityObject[cityList[getRandomInt(0, 5)]]
  }
}
type Props = {
  isAuthenticated: PropTypes.bool,
  fetchSurveys: PropTypes.func
}

class MapView extends React.Component {
  props: Props;
  constructor (props) {
    super(props)
    this.state = {
      mapToken: 'pk.eyJ1IjoidGhpc3NheXNub3RoaW5nIiwiYSI6IjFNbHllT2MifQ.5F7AhW2FxnpENc8eiE-HUA',
      mapView: {
        container: 'map',
        style: 'mapbox://styles/thissaysnothing/cijever1v00098xm3zso2fvk7',
        center: cityObjectFunc(window.location.pathname.slice(1)),
        zoom: 15
      }
    }
  }
  render () {
    // style={this.mapStyle}
    const { isAuthenticated } = this.props
    return (
      <div id='mapContainer'>
        <div id='map'>
          <DataDashboardLayout />
          {isAuthenticated && <DataInputLayout map={this.state.map}/>}
        </div>
      </div>
    )
  }
  // <Dashboard />
  componentDidMount () {
    let city = window.location.pathname.slice(1)
    let tileLocation = 'http://localhost:5001/data/city/lots/' + city + '/{z}/{x}/{y}.mvt'
    mapboxgl.accessToken = this.state.mapToken
    var map = new mapboxgl.Map(this.state.mapView)
    map.addControl(new mapboxgl.Navigation())
    map.on('style.load', function () {
      map.addSource('lots', {
        'type': 'vector',
        'tiles': [tileLocation]
      })
      map.addLayer({
        'id': 'lots',
        'type': 'fill',
        'source': 'lots',
        'source-layer': 'parcels',
        'layout': {
          'visibility': 'visible'
        },
        'interactive': true,
        'paint': {
          'fill-color': '#ff0000',
          'fill-opacity': 0.5
        }
      })
    })
    let bounds = map.getBounds()
    let coords = [[bounds.getSouthWest().lng, bounds.getSouthWest().lat],
                 [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
                 [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
                 [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
                 [bounds.getSouthWest().lng, bounds.getSouthWest().lat]]
    // this._map = map
    this.props.fetchSurveys(coords)
    this.setState({map: map})
  }
  componentWillUnmount () {
    // if (this._map) {
    //   this._map.remove()
    // }
    if (this.state.map) {
      this.state.map.remove()
    }
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode())
  }
}

const mapStateToProps = (state) => {
  const { auth } = state
  const { isAuthenticated, errorMessage } = auth
  return {
    isAuthenticated,
    errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSurveys: (bounds) => {
      dispatch(requestSurveys(bounds))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapView)
