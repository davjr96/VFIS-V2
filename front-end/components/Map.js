import React, { Component } from "react";
import "mapbox-gl";
import MapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import { connect } from "react-redux";
import base64 from "base-64";

import BridgePin from "./bridge-pin";
import BridgeInfo from "./bridge-info";
import Legend from "./legend";
import "whatwg-fetch";

const GREEN = "#4cb947";
const RED = "#ff0000";
const YELLOW = "#ffff00";

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};

class Map extends Component {
  constructor(props) {
    super(props);
    this.loadBridges = this.loadBridges.bind(this);
    this.state = {
      date: "",
      bridges: [],
      viewport: {
        latitude: 36.8,
        longitude: -77.2,
        zoom: 9,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      },
      popupInfo: null
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
    if (bridge.floodedby > 1) {
      color = RED;
    } else if (bridge.floodedby < 1 && bridge.floodedby > 0.5) {
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
              preventStyleDiffing={false}
              mapboxApiAccessToken="pk.eyJ1IjoidXZhaHlkcm9pbmZvcm1hdGljc2xhYiIsImEiOiJjamI5bXRqanowbTM4MnFwczN3emNjYW9oIn0.mejJdMMfKWw7xn0i5K6c2Q"
              onViewportChange={this._updateViewport}
            >
              {this.state.bridges.map(this._renderBridgeMarker)}

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
  authData: state.user.data
});

export default connect(mapStateToProps)(Map);
