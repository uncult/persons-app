import React, { Component } from 'react';
import './App.css';
import Person from './Models/Person';
import Modal from './Models/Modal';

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: "",
      modalToggle: "modal-invisible",
      modalData: ""
    };
    this.modalToggle = this.modalToggle;
  }

  modalToggle = (data) => {
    if (this.state.modalToggle === "modal-invisible") {
      this.setState({ modalToggle: "modal-visible" });
      this.setState({ modalData: data });
    } else {
      this.setState({ modalToggle: "modal-invisible" });
    }
  };

  componentDidMount() {
    const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf" //!important! Should be server side.
    const company_domain = "testcompany100";
    //const persons_per_page = 10;
    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=0&limit=10`;

    fetch(`${url}`)
      .then(response => response.json())
      .then(data => this.setState({ serverData: data.data }))
  }

  render() {
    return (
      <div className="App">
        <header>
          <span className="logo">pipedrive</span>
        </header>
        <section className="section-title">
          People's List
        </section>
        <main>
          {this.state.serverData ?
            this.state.serverData.map(data =>
              <Person key={data.id} data={data} openModal={this.modalToggle} />
            )
            : "Fetching data..."}
        </main>
        <section className={this.state.modalToggle}>
          {this.state.modalData.name}
        </section>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
