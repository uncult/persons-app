import React, { Component } from 'react';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }

  componentDidUpdate() {
    if (this.state.data !== this.props.data) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    let data = this.state.data;
    return (
      data && data !== null ?
        <div className={[this.props.className, "search-container"].join(' ')}>
          <div className="search-data-header">
          </div>
          <div className="search-data-container">
            {data.map(el =>
              <div key={el.id} className="search-row" onClick={() => this.props.onClick(el.id)}>
                <div style={{ marginRight: "10px" }}>
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <div>
                  <div className="search-name">{el.name}</div>
                  <div className="search-data">
                    {el.org_name}
                    {el.phone ? `, ${el.phone}` : ''}
                    {el.email ? <div>{el.email}</div> : ''}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        :
        <div className={[this.props.className, "search-container"].join(' ')}>
          <div className="search-data-header">
          </div>
          <div className="search-data-container">
            <div style={{ padding: "5px 10px 0 10px" }}>
              <div className="search-data">No results.</div>
            </div>
          </div>
        </div>
    );
  }
}

export default SearchResult;