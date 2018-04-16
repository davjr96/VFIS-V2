import React, { PureComponent } from "react";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const GREEN = "#4cb947";
const RED = "#ff0000";
const YELLOW = "#FFA500";
const size = 20;
var green = {
  cursor: "pointer",
  fill: GREEN,
  stroke: "none"
};
var red = {
  cursor: "pointer",
  fill: RED,
  stroke: "none"
};
var yellow = {
  cursor: "pointer",
  fill: YELLOW,
  stroke: "none"
};

const defaultContainer = ({ children }) => (
  <div className="legend">{children}</div>
);

export default class Legend extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    return (
      <Container>
        <table className="table ">
          <tbody>
            <tr>
              <td>
                <svg
                  height={size}
                  viewBox="0 0 24 24"
                  style={{
                    ...green
                  }}
                >
                  <path d={ICON} />
                </svg>
              </td>
              <td>No Flooding Expected</td>
            </tr>
            <tr>
              <td>
                <svg
                  height={size}
                  viewBox="0 0 24 24"
                  style={{
                    ...yellow
                  }}
                >
                  <path d={ICON} />
                </svg>
              </td>
              <td>Flooding Possible</td>
            </tr>
            <tr>
              <td>
                <svg
                  height={size}
                  viewBox="0 0 24 24"
                  style={{
                    ...red
                  }}
                >
                  <path d={ICON} />
                </svg>
              </td>
              <td>Flooding Expected</td>
            </tr>
          </tbody>
        </table>
      </Container>
    );
  }
}
