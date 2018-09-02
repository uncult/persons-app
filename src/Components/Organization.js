import React, { Component } from 'react';

class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }

  componentDidUpdate() {
    if (this.state.data !== this.props.data)
      this.setState({ data: this.props.data });
  }

  onClick = (el) => {
    this.props.setOrganization(el.id, el.name);
  }

  render() {
    let data = this.state.data;
    return (
      data && data !== null ?
        <div className="search-container-org">
          <div className="search-data-container">
            {data.map(el =>
              <div key={el.id} className="search-row" onClick={() => this.onClick(el)}>
                <div className="search-data">
                  {el.name}
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className="search-container-org">
          <div className="search-data-header">
          </div>
          <div className="search-data-container">
            <div style={{ padding: "5px 10px 0 10px" }}>
              <div className="search-data">'...' will be added as a new organization.</div>
            </div>
          </div>
        </div>
    );
  }
}

export default Organization;