import React, { Component } from 'react';
import './App.css';
import Person from './Components/Person';
import PersonAdd from './Components/PersonAdd';
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
      personModalToggle: "modal-invisible",
      modalData: "",
      isMobileDevice: this.isMobileDevice(),
      filterString: ""
    };
    this.personModalToggle = this.personModalToggle;
  }

  /*Sorting*/
  onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(oldIndex, newIndex);
    this.setState({
      personsData: arrayMove(this.state.personsData, oldIndex, newIndex),
    })
  };

  /*Toggling visibility of the modal window*/
  personModalToggle = (data) => {
    if (this.state.personModalToggle === "modal-invisible") {
      this.setState({ personModalToggle: "modal-visible" });
      this.setState({ modalData: data });
    } else {
      this.setState({ personModalToggle: "modal-invisible" });
    }
  };

  /*Page controllers*/
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

  searchData = () => {

  }

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

    let personsToRender = this.state.personsData ? this.state.personsData.filter(person => person.name.toLowerCase().includes(
      this.state.filterString ? this.state.filterString.toLowerCase() : ""
    )) : [];

    const modalData = this.state.modalData;

    /*Page Variables*/
    let numOfPages = Math.ceil(personsToRender.length / persons_per_page);
    let pageStart = (this.state.page - 1) * persons_per_page;
    let pageEnd = this.state.page * persons_per_page;

    /* Sorting drag and drop */
    const SortableItem = SortableElement(({ data }) => {
      return <Person key={data.id} data={data} openModal={this.personModalToggle} />
    });

    const SortableList = SortableContainer((items) => {
      return (
        <div>
          {items.data ?
            items.data
              .slice(pageStart, pageEnd).map((data, key) => (
                <SortableItem key={data.id} index={key + pageStart} data={data} />
              )) : ""}
        </div>
      );
    });

    return (
      <div className="App">
        <header>
          <div className="logo">pipedrive</div>
          <i className="fa fa-search" aria-hidden="true"></i>
          <input className="search" type="text" placeholder="Search" onKeyUp={event => {
            this.setState({ page: 1 });
            this.setState({ filterString: event.target.value });
          }} />
        </header>

        <section className="section-title">
          People's List
        </section>

        {/*------Rendering Person Rows------*/}
        <main>
          <button className="person-button-add" >Add person</button>

          <PersonAdd visibility="modal-visible"/>

          {this.state.isMobileDevice ?
            <SortableList data={personsToRender} onSortEnd={this.onSortEnd} pressDelay={100} /> :
            <SortableList data={personsToRender} onSortEnd={this.onSortEnd} distance={10} />}
        </main>

        {/*------Modal Window------*/}
        {this.state.modalData ?
          <section className={this.state.personModalToggle}>
            <div className={`modal-container`}>
              <div className="modal-header">
                Person Information
              <i className="fa fa-times" aria-hidden="true" onClick={this.personModalToggle} />
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
                <button className="modal-button" onClick={this.personModalToggle}>Back</button>
              </div>
            </div>
          </section>
          : ""}

        {/*------Pagination------*/}
        <section className="pagination-container">
          {this.state.page !== 1 ?
            <button className="pagination-button" onClick={this.previousPage}>Previous</button> : ""
          }

          {this.state.page !== numOfPages && numOfPages !== 0 ?
            <button className="pagination-button" onClick={this.nextPage}>Next</button> : ""
          }
        </section>

        <footer></footer>
      </div>
    );
  }
}

export default App;
