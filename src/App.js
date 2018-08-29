import React, { Component } from 'react';
import './App.css';
import Person from './Models/Person';
//import Modal from './Models/Modal';

class App extends Component {
  constructor() {
    super();
    this.state = {
      personsData: "",
      modalToggle: "modal-invisible",
      modalData: ""
    };
    this.modalToggle = this.modalToggle;
  }

  /*Toggling visibility of the modal window*/
  modalToggle = (data) => {
    if (this.state.modalToggle === "modal-invisible") {
      this.setState({ modalToggle: "modal-visible" });
      this.setState({ modalData: data });
      console.log(data);
    } else {
      this.setState({ modalToggle: "modal-invisible" });
    }
  };

  /*Pulling data from the API*/
  componentDidMount() {
    const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf" //!important! Should be server side.
    const company_domain = "testcompany100";
    //const persons_per_page = 10;
    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=0&limit=10`;

    fetch(`${url}`)
      .then(response => response.json())
      .then(data => this.setState({ personsData: data.data }))
  }

  render() {
    const groupKey = "eba502a1d2a7185f72d5a335ee7b4b75d89d3cd4";
    const localityKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_locality";
    const countryKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_country";

    const modalData = this.state.modalData;

    return (
      <div className="App">
        <header>
          <span className="logo">pipedrive</span>
        </header>

        <section className="section-title">
          People's List
        </section>

        {/*------Rendering Person Rows------*/}
        <main>
          {this.state.personsData ?
            this.state.personsData.map(data =>
              <Person key={data.id} data={data} openModal={this.modalToggle} />
            )
            : "Fetching data..."}
        </main>
        
        {/*------Modal Window------*/}
        {this.state.modalData ?
          <section className={this.state.modalToggle}>
            <div className={`modal-container`}>
              <div className="modal-header">
                Person Information
              <i className="fa fa-times" aria-hidden="true" onClick={this.modalToggle}/>
              </div>

              <div className="modal-person">
                <div className="image-cropper">
                  <img src={require('./Img/placeholder.jpg')} alt={modalData.name} className="person-image" />
                </div>
                <div className="modal-name">{modalData.name}</div>
                <div className="modal-phone">+{modalData.phone[0].value}</div>
              </div>

              <div className="modal-info">
                <div className="modal-info-container">
                  <div className="modal-info-title">Email</div>
                  <div className="modal-info-data">{modalData.email[0].value}</div>
                </div>

                <div className="modal-info-container">
                  <div className="modal-info-title">Organization</div>
                  <div className="modal-info-data">{modalData.org_name}</div>
                </div>

                <div className="modal-info-container">
                  <div className="modal-info-title">Groups</div>
                  <div className="modal-info-data">{modalData[groupKey]}</div>
                </div>

                <div className="modal-info-container">
                  <div className="modal-info-title">Location</div>
                  <div className="modal-info-data">
                    {modalData[localityKey] ? `${modalData[localityKey]}, ${modalData[countryKey]}` : modalData[countryKey]}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="modal-button" onClick={this.modalToggle}>Back</button>
              </div>
            </div>
          </section>
          : ""}

        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
