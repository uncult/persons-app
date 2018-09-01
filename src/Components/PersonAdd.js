import React, { Component } from 'react';
import Api from '../Models/Api';

const api = new Api();

class PersonAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      country: "",
      locality: "",
      group: "",
      phone: [],
      email: [],
      organization: 1,
      successIcon: "none",
      saveButton: "block"
    };
  }

  personAdd = () => {
    let d = this.state;

    if (this.state.name)
      api.lastItemOrder().then(order => {
        api.addPerson(d.name, d.group, d.organization, d.email, d.phone, order + 1, d.address).then(res => {
          if (res.ok) {
            this.setState({ saveButton: "none" });
            this.setState({ successIcon: "block" });

            /*Country response takes too long*/
            setTimeout(() => {
              this.props.fetchData();
            }, 1000)
            setTimeout(() => {
              this.props.personAddModalToggle();
              this.setState({ saveButton: "block" });
              this.setState({ successIcon: "none" });
            }, 500)
          }
        }).catch(err => { })
      })
  }

  render() {
    return (
      <div className="modal-container">
        <div className="modal-header">
          Add new person
            <i className="fa fa-times" aria-hidden="true" onClick={this.props.personAddModalToggle} />
        </div>

        <div className="person-add-body">
          <div className="person-add-label">Name</div>
          <div><input type="text" className="person-add-input" onChange={text => this.setState({ name: text.target.value })} /></div>
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
          <button className="person-button-add person-save" onClick={this.personAdd}>
            <i style={{ display: this.state.successIcon }} className="fa fa-check" aria-hidden="true"></i>
            <span style={{ display: this.state.saveButton }}>Save</span>
          </button>
        </div>
      </div>
    );
  }
}

export default PersonAdd;