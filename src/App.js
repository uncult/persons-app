import React, { Component } from 'react';
import './App.css';
import Person from './Components/Person';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const groupKey = "eba502a1d2a7185f72d5a335ee7b4b75d89d3cd4";
const localityKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_locality";
const countryKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_country";
const orderKey = "4aef6c7aeac722a72f486c85b0fba827f3bea8dd";

class App extends Component {
  constructor() {
    super();
    this.state = {
      personsData: "",
      page: 1,
      modalToggle: "modal-invisible",
      modalData: "",
      isMobileDevice: this.isMobileDevice()
    };
    this.modalToggle = this.modalToggle;
  }

  /*Sorting*/
  onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(oldIndex, newIndex);
    this.setState({
      personsData: arrayMove(this.state.personsData, oldIndex, newIndex),
    })
  };

  /*Toggling visibility of the modal window*/
  modalToggle = (data) => {
    if (this.state.modalToggle === "modal-invisible") {
      this.setState({ modalToggle: "modal-visible" });
      this.setState({ modalData: data });
    } else {
      this.setState({ modalToggle: "modal-invisible" });
    }
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 })
  }

  previousPage = () => {
    this.setState({ page: this.state.page - 1 })
  }

  /*Checking if mobile*/
  isMobileDevice = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };

  /*Pulling data from the API*/
  fetchData = () => {
    const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf" //!important! Should be server side.
    const company_domain = "testcompany100";
    /*const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=`+ (this.state.page - 1) * persons_per_page + `&limit=` + this.state.page * persons_per_page;*/

    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token}`;

    fetch(`${url}`)
      .then(response => response.json())
      .then(data => this.setState({
        personsData: data.data.sort((a, b) => a[orderKey] - b[orderKey])
      }))
  }


  componentDidMount() {
    this.fetchData();
  }

  render() {
    const persons_per_page = 10;

    let pageStart = (this.state.page - 1) * persons_per_page;
    let pageEnd = this.state.page * persons_per_page;

    const modalData = this.state.modalData;

    /* Sorting drag and drop */
    const SortableItem = SortableElement(({ data }) => {
      return <Person key={data.id} data={data} openModal={this.modalToggle} />
    });

    const SortableList = SortableContainer((items) => {
      return (
        <div>
          {items.data ?
            items.data.slice(pageStart, pageEnd).map((data, key) => (
              <SortableItem key={data.id} index={key + pageStart} data={data} />
            )) : ""}
        </div>
      );
    });

    return (
      <div className="App">
        <header>
            <div className="logo">pipedrive</div>
            <i class="fa fa-search" aria-hidden="true"></i>
            <input className="search" type="text" placeholder="Search"/>
        </header>

        <section className="section-title">
          People's List
        </section>

        {/*------Rendering Person Rows------*/}
        <main>
          {this.state.isMobileDevice ?
            <SortableList data={this.state.personsData} onSortEnd={this.onSortEnd} pressDelay={100} /> :
            <SortableList data={this.state.personsData} onSortEnd={this.onSortEnd} distance={10} />}
        </main>

        {/*------Modal Window------*/}
        {this.state.modalData ?
          <section className={this.state.modalToggle}>
            <div className={`modal-container`}>
              <div className="modal-header">
                Person Information
              <i className="fa fa-times" aria-hidden="true" onClick={this.modalToggle} />
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
        <section className="pagination-container">
          {this.state.page !== 1 ?
            <button className="pagination-button" onClick={this.previousPage}>Previous</button> : ""
          }

          {this.state.page !== Math.ceil(this.state.personsData.length / this.state.page) ?
            <button className="pagination-button" onClick={this.nextPage}>Next</button> : ""
          }

        </section>
        <footer>
        </footer>
      </div>
    );
  }
}

export default App;
