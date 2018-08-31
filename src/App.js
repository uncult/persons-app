import React, { Component } from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import './App.css';
import Person from './Components/Person';
import PersonModal from './Components/PersonModal';
import PersonAdd from './Components/PersonAdd';
import SearchResult from './Components/SearchResult';
import Api from './Models/Api';

/*
  -------------------TO DO--------------------
  1) Saving order

  BUG: need to start searching when refocusing
  the search bar
  --------------------------------------------
*/

const orderKey = "4aef6c7aeac722a72f486c85b0fba827f3bea8dd";
const persons_per_page = 11;
const api = new Api();

class App extends Component {
  constructor() {
    super();
    this.state = {
      personsData: "",
      searchData: "",
      page: 1,
      personModalToggle: "modal-invisible",
      personAddModalToggle: "modal-invisible",
      searchToggle: "modal-invisible",
      modalData: "",
      isMobileDevice: this.isMobileDevice(),
      filterString: ""
    };
    this.personModalToggle = this.personModalToggle;
  }

  /*Pulling data from the API*/
  fetchData = () => {
    const api_token = "df3541068dfdbdc2895db305918e6ed5743c74cf" //!important! Should be server side.
    const company_domain = "testcompany100";

    if(this.state.personsData.length === 1 && this.state.page !== 1)
      this.setState({page: this.state.page-1})

    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=${(this.state.page - 1) * 10}&limit=${persons_per_page}&sort=${orderKey}%20ASC`;

    //const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token}&start=0&limit=105`;

    fetch(`${url}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          personsData: data.data.sort((a, b) => a[orderKey] - b[orderKey])
        })
      })
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

  personAddModalToggle = (e) => {
    if (this.state.personAddModalToggle === "modal-invisible") {
      this.setState({ personAddModalToggle: "modal-visible" })
    } else {
      this.setState({ personAddModalToggle: "modal-invisible" });
    }
  };

  /*Search functionality*/
  findPersons = (input) => {
    if (input.length > 1) {
      api.findPersons(input).then(data => {
        this.setState({ searchData: data });
        this.setState({ searchToggle: "search-visible" })
      });
    } else {
      this.setState({ searchData: '' });
      this.setState({ searchToggle: "modal-invisible" })
    }
  }

  searchModalToggle = (id) => {
    api.findById(id)
      .then(data => {
        this.setState({ searchToggle: "modal-invisible" })
        this.personModalToggle(data);
      })
  }

  /*Detecting if clicking outside the search window*/
  handleClick = (e) => {
    if (this.node) {
      if (this.node.contains(e.target))
        return

      if (this.state.searchToggle === "search-visible" && !this.node.contains(e.target))
        this.setState({ searchToggle: "modal-invisible" });
    }
  }


  searchFocus = () => {
    if (this.state.searchData){      
      this.setState({ searchToggle: "search-visible" });
    }
  }

  /*Page controllers*/
  flipPage = (direction) => {
    this.setState({ page: this.state.page + direction })
    setTimeout(() => this.fetchData(), 0);
  }

  /*Checking if mobile*/
  isMobileDevice = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };


  componentDidMount() {
    this.fetchData();
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentDidUpdate() {

  }

  render() {
    const modalData = this.state.modalData;

    /* Sorting drag and drop */
    const SortableItem = SortableElement(({ data }) => {
      return <Person key={data.id} data={data} openModal={this.personModalToggle} />
    });

    const SortableList = SortableContainer((items) => {
      return (
        <div>
          {items.data.map((data, key) => key !== persons_per_page - 1 ? (
            <SortableItem key={data.id} index={key} data={data} />
          ) : '')}
        </div>
      );
    });


    return (
      <div className="App">
        <header>
          <div className="logo">pipedrive</div>
          <i className="fa fa-search" aria-hidden="true"></i>
          <input className="search" type="text" placeholder="Search" onFocus={this.searchFocus} onKeyUp={event => {
            this.findPersons(event.target.value);
            this.setState({ filterString: event.target.value });
          }} />
        </header>
        <div ref={node => this.node = node}>
          <SearchResult
            className={this.state.searchToggle}
            data={this.state.searchData}
            onClick={this.searchModalToggle} />
        </div>
        <section className="section-title">
          People's List
        </section>

        {/*------Rendering Person Rows------*/}
        {this.state.personsData ?
          <main>
            <button className="person-button-add" onClick={this.personAddModalToggle}>Add person</button>
            <div className={this.state.personAddModalToggle}>
              <PersonAdd fetchData={this.fetchData} personAddModalToggle={this.personAddModalToggle} visibility={this.state.personAddModalToggle} />
            </div>
            {this.state.isMobileDevice ?
              <SortableList data={this.state.personsData} onSortEnd={this.onSortEnd} pressDelay={100} /> :
              <SortableList data={this.state.personsData} onSortEnd={this.onSortEnd} distance={10} />}
          </main>
          : ''}
        {/*------Person Modal Window------*/}
        {modalData ?
          <section className={this.state.personModalToggle}>
            <PersonModal className={this.state.personModalToggle} toggleModal={this.personModalToggle} data={modalData} fetchData={this.fetchData} />
          </section>
          : ''}

        {/*------Pagination------*/}
        <section className="pagination-container">
          <div className="pagination-button-container-left">
            {this.state.page !== 1 ?
              <button className="pagination-button" onClick={() => this.flipPage(-1)}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </button> : ""
            }
          </div>
          <div className="pagination-button-container-right">
            {this.state.personsData.length > 10 ?
              <button className="pagination-button" onClick={() => this.flipPage(1)}>
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </button> : ""
            }
          </div>
        </section>

        <footer></footer>
      </div>
    );
  }
}

export default App;
