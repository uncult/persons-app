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
  BONUS: Make an ability to add organizations

  CONCEPT:
  let text = input; //org search bar
  api.getOrgListByName(text); //returns list of names and ids.

  (Basically the same solution as the search bar)
  --------------------------------------------

  BUG: Sometimes sorting doesn't save if
  done too quickly.
  --------------------------------------------
 
*/

const orderKey = process.env.REACT_APP_orderKey;
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
      filterString: "",
      spinner: "none",
      searchIcon: "block"
    };
    this.personModalToggle = this.personModalToggle;
  }

  /*Pulling data from the API*/
  fetchData = () => {
    const api_token = process.env.REACT_APP_API_KEY;
    const company_domain = "testcompany100";

    const url = `https://${company_domain}.pipedrive.com/v1/persons?api_token=${api_token} 
    &start=${(this.state.page - 1) * 10}&limit=${persons_per_page}&sort=${orderKey}%20DESC`;

    fetch(`${url}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          personsData: data.data.sort((a, b) => b[orderKey] - a[orderKey])
        })
      })
  }

  /*Sorting*/
  onSortEnd = ({ oldIndex, newIndex }) => {
    let data = this.state.personsData;

    let swapped = data[oldIndex][orderKey];
    data[oldIndex][orderKey] = data[newIndex][orderKey];
    data[newIndex][orderKey] = swapped;

    this.setState({ personsData: data });

    /*Client side sorting*/
    this.setState({
      personsData: arrayMove(this.state.personsData, oldIndex, newIndex),
    })

    /*Api saving data*/
    api.updatePersonOrder(data[oldIndex].id, data[oldIndex][orderKey]);
    api.updatePersonOrder(data[newIndex].id, data[newIndex][orderKey]);
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
      /*loader effect*/
      this.setState({ spinner: "block" });
      this.setState({ searchIcon: "none" });

      api.findPersons(input).then(data => {
        this.setState({ searchData: data });
        this.setState({ searchToggle: "search-visible" });

        this.setState({ searchIcon: "block" })
        this.setState({ spinner: "none" });
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

  /*searchFocus = () => {
    if (this.state.searchData) {
      this.setState({ searchToggle: "search-visible" });
    }
  }*/

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
        <a href="./"><div className="logo">pipedrive</div></a>
          <div className="search-bar-container">
            <div style={{ display: this.state.spinner }} className="lds-dual-ring"></div>
            <i style={{ display: this.state.searchIcon }} className="fa fa-search" aria-hidden="true"></i>
            <input className="search" type="text" placeholder="Search" onFocus={this.searchFocus} onKeyUp={event => {
              this.findPersons(event.target.value);
              this.setState({ filterString: event.target.value });
            }} />
          </div>
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
            <PersonModal
              className={this.state.personModalToggle}
              toggleModal={this.personModalToggle}
              data={modalData}
              dataLength={this.state.personsData.length}
              flipPage={() => this.flipPage(-1)}
              fetchData={this.fetchData} />
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
