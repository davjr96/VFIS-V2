import React, { Component } from "react";
import "whatwg-fetch";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { connect } from "react-redux";
import base64 from "base-64";

class TableView extends Component {
  constructor(props) {
    super(props);
    this.loadBridges = this.loadBridges.bind(this);

    this.state = {
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

  componentWillReceiveProps(nextProps) {
    this.loadBridges(nextProps.date);
  }
  componentDidMount() {
    this.loadBridges(this.props.date);
  }
  render() {
    const columns = [
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
      },
      {
        Header: "Stream Crossed",
        accessor: "stream",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["stream"] }),
        filterAll: true
      },
      {
        Header: "Road Elevation",
        accessor: "roadelev",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["roadelev"] }),
        filterAll: true
      },
      {
        Header: "Maximum Water Level",
        accessor: "maxwl",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["maxwl"] }),
        filterAll: true
      },
      {
        Header: "Flooded By",
        accessor: "floodedby",
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["floodedby"] }),
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

export default connect(mapStateToProps)(TableView);
