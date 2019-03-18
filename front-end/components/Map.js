import React, { Component } from "react";
import "mapbox-gl";
import MapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import { connect } from "react-redux";
import base64 from "base-64";
import Select from "react-select";

import areaComponent from "./areaComponent";
import BridgePin from "./bridge-pin";
import BridgeInfo from "./bridge-info";
import Legend from "./legend";
import "whatwg-fetch";

const GREEN = "#4cb947";
const RED = "#ff0000";
const YELLOW = "#CCCC00";

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};
const VAViewport = {
  latitude: 36.8,
  longitude: -77.2,
  zoom: 9,
  bearing: 0,
  pitch: 0,
  width: 500,
  height: 500
};

const LAViewport = {
  latitude: 30.2240906,
  longitude: -92.0198364,
  zoom: 11,
  bearing: 0,
  pitch: 0,
  width: 500,
  height: 500
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.loadBridges = this.loadBridges.bind(this);
    this.state = {
      date: "",
      bridges: [],
      viewport: VAViewport,
      popupInfo: null,
      locations: [
        {
          ID: 738,
          Lon: -92.0301,
          Lat: 30.1948,
          max: 5.71
        },
        {
          ID: 5106,
          Lon: -92.0386,
          Lat: 30.2033,
          max: 7.12
        },
        {
          ID: 8896,
          Lon: -92.0487,
          Lat: 30.2055,
          max: 7.33
        },
        {
          ID: 13001,
          Lon: -92.0552,
          Lat: 30.2137,
          max: 7.628519247
        },
        {
          ID: 815,
          Lon: -92.0549,
          Lat: 30.216,
          max: 8.048634302
        },
        {
          ID: 3238,
          Lon: -92.0569,
          Lat: 30.222,
          max: 9.635483954
        },
        {
          ID: 7186,
          Lon: -92.0588,
          Lat: 30.2313,
          max: 11.08041901
        },
        {
          ID: 10882,
          Lon: -92.0602,
          Lat: 30.2412,
          max: 11.49300546
        },
        {
          ID: 13859,
          Lon: -92.0574,
          Lat: 30.2147,
          max: 7.628519247
        },
        {
          ID: 16928,
          Lon: -92.0639,
          Lat: 30.2195,
          max: 7.9608821
        },
        {
          ID: 19452,
          Lon: -92.0687,
          Lat: 30.2244,
          max: 8.642412012
        },
        {
          ID: 20505,
          Lon: -92.0709,
          Lat: 30.2265,
          max: 9.013405646
        },
        {
          ID: 22973,
          Lon: -92.0746,
          Lat: 30.2319,
          max: 10.234123
        },
        {
          ID: 24187,
          Lon: -92.0763,
          Lat: 30.2346,
          max: 10.34610104
        },
        {
          ID: 475,
          Lon: -92.0773,
          Lat: 30.236,
          max: 10.3512484
        },
        {
          ID: 2062,
          Lon: -92.0784,
          Lat: 30.2399,
          max: 10.46527168
        },
        {
          ID: 3811,
          Lon: -92.0776,
          Lat: 30.2441,
          max: 10.56410867
        },
        {
          ID: 4915,
          Lon: -92.0788,
          Lat: 30.2467,
          max: 10.61297778
        },
        {
          ID: 9987,
          Lon: -92.0858,
          Lat: 30.2591,
          max: 10.95743233
        },
        {
          ID: 27981,
          Lon: -92.0723,
          Lat: 30.2432,
          max: 10.68427343
        },
        {
          ID: 29663,
          Lon: -92.0721,
          Lat: 30.2474,
          max: 11.02956281
        },
        {
          ID: 37892,
          Lon: -92.067,
          Lat: 30.267,
          max: 12.44871805
        },
        {
          ID: 41957,
          Lon: -92.0597,
          Lat: 30.2755,
          max: 12.83674902
        },
        {
          ID: 44923,
          Lon: -92.0592,
          Lat: 30.2834,
          max: 13.49380077
        }
      ]
    };
  }

  loadBridges(date) {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x")
    );

    fetch("/api/bridges/" + date, {
      method: "GET",
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        this.setState({
          bridges: json
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  componentDidMount() {
    window.addEventListener("resize", this._resize);
    this._resize();
    this.loadBridges(this.props.date);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._resize);
  }
  componentWillReceiveProps(nextProps) {
    this.loadBridges(nextProps.date);

    if (nextProps.area == "VA")
      this.setState({ viewport: VAViewport }, () => this._resize());
    else if (nextProps.area == "LA")
      this.setState({ viewport: LAViewport }, () => this._resize());
  }
  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _renderBridgeMarker = (bridge, index) => {
    let color;
    if (bridge.floodedby > 0) {
      color = RED;
    } else if (bridge.floodedby > -0.3 && bridge.floodedby < 0) {
      color = YELLOW;
    } else {
      color = GREEN;
    }
    return (
      <Marker
        key={`marker-${index}`}
        longitude={bridge.xcord}
        latitude={bridge.ycord}
      >
        <BridgePin
          size={20}
          onClick={() => this.setState({ popupInfo: bridge })}
          color={color}
        />
      </Marker>
    );
  };

  _renderLAMarker = (bridge, index) => {
    let color;
    if (bridge.max > 11) {
      color = RED;
    } else if (bridge.max < 11 && bridge.max > 8) {
      color = YELLOW;
    } else {
      color = GREEN;
    }
    return (
      <Marker
        key={`marker-${index}`}
        longitude={bridge.Lon}
        latitude={bridge.Lat}
      >
        <BridgePin
          size={20}
          onClick={() => this.setState({ popupInfo: bridge })}
          color={color}
        />
      </Marker>
    );
  };

  _renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.xcord}
          latitude={popupInfo.ycord}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <BridgeInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    const { viewport } = this.state;

    return (
      <div>
        <div className="container-fluid Map">
          <div>
            <MapGL
              {...viewport}
              mapStyle="mapbox://styles/uvahydroinformaticslab/cjb9nxa3x4kas2spin2633nt5"
              mapboxApiAccessToken="pk.eyJ1IjoidXZhaHlkcm9pbmZvcm1hdGljc2xhYiIsImEiOiJjamI5bXRqanowbTM4MnFwczN3emNjYW9oIn0.mejJdMMfKWw7xn0i5K6c2Q"
              onViewportChange={this._updateViewport}
            >
              {this.state.bridges.map(this._renderBridgeMarker)}
              {this.state.locations.map(this._renderLAMarker)}

              {this._renderPopup()}
              <div className="nav" style={navStyle}>
                <NavigationControl onViewportChange={this._updateViewport} />
              </div>
              <Legend />
            </MapGL>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.user.date,
  authData: state.user.data,
  area: state.user.area
});

export default connect(mapStateToProps)(Map);
