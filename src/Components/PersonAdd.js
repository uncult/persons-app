import React, { Component } from 'react';
import Api from '../Models/Api';

const api = new Api();

class PersonAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      order: null,
      address: "",
      group: "",
      phone: [],
      email: [],
      organization: null
    };
  }

  personAdd = () => {
    let d = this.state;
    api.addPerson(d.name, d.group, d.organization, d.email, d.phone, d.order, d.address);
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
          <div className="person-add-label">Organization</div>
          <div><input type="text" className="person-add-input" onChange={text => this.setState({ organization: text.target.value })} /></div>
        </div>

        <div className="modal-footer">
          <button className="person-button-add person-save" onClick={this.personAdd}>Save</button>
        </div>
      </div>
    );
  }
}

export default PersonAdd;