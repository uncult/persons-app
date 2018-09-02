import React, { Component } from 'react';
import Api from '../Models/Api';
import Organization from '../Components/Organization';

const api = new Api();

class PersonAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: "",
      searchToggle: "",
      name: null,
      country: "",
      locality: "",
      group: "",
      phone: [],
      email: [],
      organization: null,
      successIcon: "none",
      saveButton: "block",
      spinner: "none",
      searchVisibility: "none",
      orgFill: ""
    };
  }

  dataAdd = (e) => {
    e.preventDefault();
    if (this.state.name) {
      if (this.state.orgFill && this.state.orgFill.length > 1 && this.state.organization === null) {
        api.addOrg(this.state.orgFill).then(data => this.setState({ organization: data.id })).then(() => {
          this.personAdd()
        });
      } else {
        this.personAdd();
      }
    }
  }

  personAdd = () => {
    let s = this.state;

    api.lastItemOrder().then(order => {
      api.addPerson(s.name, s.group, s.organization, s.email, s.phone, order + 1, s.address).then(res => {
        if (res.ok) {
          this.setState({ saveButton: "none" });
          this.setState({ successIcon: "block" });

          /*Country response takes too long*/
          setTimeout(() => {
            this.props.fetchData();
          }, 500)
          setTimeout(() => {
            this.props.personAddModalToggle();
            this.setState({ saveButton: "block" });
            this.setState({ successIcon: "none" });
          }, 500)
        }
      }).catch(err => { })
    })
  }

  orgSearch = (input) => {
    this.setState({ orgFill: input });
    if (input.length > 1) {
      /*loader effect*/
      this.setState({ spinner: "block" });
      this.setState({ searchVisibility: "block" });

      api.findOrg(input).then(data => {
        this.setState({ searchData: data });
        this.setState({ spinner: "none" });

        if (!data) {
          this.setState({ organization: null });
        }
      });
    } else {
      this.setState({ searchData: '' });
      this.setState({ searchVisibility: "none" });
    }
  }

  setOrganization = (id, name) => {
    this.setState({ searchVisibility: "none" });
    this.setState({ orgFill: name })
    this.setState({ organization: id });
  }

  handleClick = (e) => {
    if (this.node) {
      if (this.node.contains(e.target))
        return

      if (this.state.searchVisibility === "block" && !this.node.contains(e.target))
        this.setState({ searchVisibility: "none" });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  render() {
    return (
      <div className="modal-container">
        <div className="modal-header">
          Add new person
            <i className="fa fa-times" aria-hidden="true" onClick={this.props.personAddModalToggle} />
        </div>
        
        <form>
          <div className="person-add-body">
            <div className="person-add-label">Name</div>
            <div><input type="text" className="person-add-input" onChange={text => this.setState({ name: text.target.value })} /></div>
            <div style={{ position: "relative" }}>
              <i style={{ position: "absolute", top: "30px", left: "9px", fontSize: "12px" }} className="fa fa-building" aria-hidden="true"></i>
              <div style={{ display: this.state.spinner, top: "25px", left: "280px" }} className="lds-dual-ring"></div>
              <div className="person-add-label">Organization</div>
              <div><input type="text" style={{ padding: "4px 25px" }} value={this.state.orgFill} className="person-add-input" onChange={text => this.orgSearch(text.target.value)} /></div>
            </div>
            <div ref={node => this.node = node} style={{ display: this.state.searchVisibility }}>
              <Organization setOrganization={this.setOrganization} data={this.state.searchData} />
            </div>
            <div className="person-add-label">Address</div>
            <div><input type="text" className="person-add-input" onChange={text => this.setState({ address: text.target.value })} /></div>
            <div className="person-add-label">Group</div>
            <div><input type="text" className="person-add-input" onChange={text => this.setState({ group: text.target.value })} /></div>
            <div className="person-add-label">Phone</div>
            <div><input type="text" className="person-add-input" onChange={text => this.setState({ phone: [text.target.value] })} /></div>
            <div className="person-add-label">Email</div>
            <div><input type="text" className="person-add-input" onChange={text => this.setState({ email: [text.target.value] })} /></div>
          </div>

          <div className="modal-footer">
            <button className="person-button-add person-save" onClick={this.dataAdd}>
              <i style={{ display: this.state.successIcon }} className="fa fa-check" aria-hidden="true"></i>
              <span style={{ display: this.state.saveButton }}>Save</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default PersonAdd;