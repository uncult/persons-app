import React, { Component } from 'react';

class PersonAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibility: "modal-visible"
    };
  }

  render() {
    return (
      <div className={this.state.visibility}>
        <div className="modal-container">
          <div className="modal-header">
            Add new person
            <i className="fa fa-times" aria-hidden="true" onClick={() => this.setState({visibility: "modal-invisible"})} />
          </div>

          <div className="person-add-body">
            <div className="person-add-label">Name</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Order</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Address</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Group</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Phone</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Email</div>
            <div><input type="text" className="person-add-input"/></div>
            <div className="person-add-label">Organization</div>
            <div><input type="text" className="person-add-input"/></div>
          </div>

          <div className="modal-footer">
                <button className="person-button-add person-save" onClick={this.modalToggle}>Save</button>
              </div>
        </div>
      </div>
    );
  }
}

export default PersonAdd;