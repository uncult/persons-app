import React, { Component } from 'react';
import './App.css';
import Person from './Models/Person';

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: ""
    };
  }

  componentDidMount() {
    const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf" //!important! Should be server side.
    const company_domain = "testcompany100";
    //const persons_per_page = 10;
    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=0&limit=10`;
    
    fetch(`${url}`)
    .then(response => response.json())
    .then(data => this.setState({serverData: data.data}))
  }

  render() {
    return (
      <div className="App">
        {console.log(this.state.serverData)}
        {this.state.serverData ? 
          this.state.serverData.map(data => 
            <Person key={data.id} data={data}/>
          )
          : "Fetching data..."}
      </div>
    );
  }
}

export default App;
