import React, { Component } from "react";
import "whatwg-fetch";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { connect } from "react-redux";
import base64 from "base-64";

class AlertView extends Component {
  constructor(props) {
    super(props);
    this.loadBridges = this.loadBridges.bind(this);
    this.loadAlerts = this.loadAlerts.bind(this);
    this.addAlerts = this.addAlerts.bind(this);
    this.deleteAlerts = this.deleteAlerts.bind(this);

    this.toggleRow = this.toggleRow.bind(this);

    this.state = {
      selected: new Set([]),
      selectAll: 0,
      tableOptions: {
        loading: true,
        showPagination: true,
        showPageSizeOptions: true,
        showPageJump: true,
        collapseOnSortingChange: true,
        collapseOnPageChange: true,
        collapseOnDataChange: true,
        freezeWhenExpanded: false,
        filterable: true,
        sortable: true,
        resizable: true
      },
      bridges: []
    };
  }

  toggleRow(fedid) {
    let selected = this.state.selected;
    if (selected.has(fedid)) {
      this.deleteAlerts([fedid]);
      selected.delete(fedid);
    } else {
      this.addAlerts([fedid]);
      selected.add(fedid);
    }
    this.setState({
      selected: selected,
      selectAll: 2
    });
  }

  toggleSelectAll() {
    let newSelected = new Set();

    if (this.state.selectAll === 0) {
      this.state.bridges.forEach(x => {
        newSelected.add(x.fedid);
      });
    }
    if (newSelected.size == 0) {
      this.deleteAlerts([...this.state.selected]);
    }
    this.setState(
      {
        selected: newSelected,
        selectAll: this.state.selectAll === 0 ? 1 : 0
      },
      () => {
        this.addAlerts([...this.state.selected]);
      }
    );
  }

  loadBridges() {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x")
    );

    fetch("/api/bridges", {
      method: "GET",
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        this.setState({
          tableOptions: {
            loading: false,
            showPagination: true,
            showPageSizeOptions: true,
            showPageJump: true,
            collapseOnSortingChange: true,
            collapseOnPageChange: true,
            collapseOnDataChange: true,
            freezeWhenExpanded: false,
            filterable: true,
            sortable: true,
            resizable: true
          },
          bridges: json
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  loadAlerts() {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x")
    );
    fetch("/api/alerts", {
      method: "GET",
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        let newSelected = new Set();

        json.forEach(x => {
          newSelected.add(x.fedid);
        });
        this.setState({
          selected: newSelected,
          selectAll: newSelected.size === 0 ? 0 : 2
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  addAlerts(x) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x"),
      ("Content-Type": "application/json")
    );
    fetch("/api/alerts", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ constructions: x }),
      json: true
    }).then(
      function(response) {
        this.loadAlerts();
      }.bind(this)
    );
  }

  deleteAlerts(x) {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x"),
      ("Content-Type": "application/json")
    );
    fetch("/api/alerts", {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({ constructions: x }),
      json: true
    }).then(
      function(response) {
        this.loadAlerts();
      }.bind(this)
    );
  }

  componentDidMount() {
    this.loadBridges();
    this.loadAlerts();
  }

  render() {
    const columns = [
      {
        id: "checkbox",
        accessor: "",
        Cell: ({ original }) => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selected.has(original.fedid)}
              onChange={() => this.toggleRow(original.fedid)}
            />
          );
        },
        Header: x => {
          return (
            <label>
              <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selectAll === 1}
                ref={input => {
                  if (input) {
                    input.indeterminate = this.state.selectAll === 2;
                  }
                }}
                onChange={() => this.toggleSelectAll()}
              />
              Recieve Email Alert
            </label>
          );
        },
        sortable: false,
        width: 45,
        filterAll: false
      },
      {
        Header: "Feature ID",
        accessor: "fedid",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["fedid"] }),
        filterAll: true
      },
      {
        Header: "Road Name",
        accessor: "roadname",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["roadname"] }),
        filterAll: true
      },
      {
        Header: "Stream Crossed",
        accessor: "stream",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["stream"] }),
        filterAll: true
      },
      {
        Header: "Latitude",
        accessor: "ycord",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["ycord"] }),
        filterAll: true
      },
      {
        Header: "Longitude",
        accessor: "xcord",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["xcord"] }),
        filterAll: true
      }
    ];
    return (
      <div className="TableView">
        <ReactTable
          className="table -striped -highlight"
          defaultPageSize={15}
          data={this.state.bridges}
          columns={columns}
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          {...this.state.tableOptions}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.user.date,
  authData: state.user.data
});

export default connect(mapStateToProps)(AlertView);
