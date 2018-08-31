import React, { Component } from 'react';
import Api from '../Models/Api';

const api = new Api();

const groupKey = "eba502a1d2a7185f72d5a335ee7b4b75d89d3cd4";
const localityKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_locality";
const countryKey = "588b8754dc0f49dc5aa5f1ad750c3a877f7dd5a1_country";

class PersonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: this.props.data,
      personModalToggle: this.props.className,
      toggleModal: this.props.toggleModal
    };
  }

  personDelete = (id) => {
    api.deletePerson(id).then(res => {
      this.props.fetchData();
    }).catch(err => {
      console.log(err);
    });;
  }

  deleteEvent = () => {
    this.personDelete(this.state.modalData.id);
    this.state.toggleModal();
  }

  componentDidUpdate() {
    if (this.state.modalData !== this.props.data)
      this.setState({ modalData: this.props.data });
  }

  render() {
    let modalData = this.state.modalData;
    return (
      <div className={`modal-container`}>
        <div className="modal-header">
          Person Information
            <i className="fa fa-times" aria-hidden="true" onClick={this.state.toggleModal} />
        </div>

        <div className="modal-person">
          <div className="image-cropper">
            {modalData.picture_id ?
              <img src={modalData.picture_id.pictures["128"]} alt={modalData.name} className="person-image" /> :
              <div className="person-image person-image-missing lg">
                {`${modalData.first_name ? modalData.first_name[0] : ""}${modalData.last_name ? modalData.last_name[0] : ''}`}
              </div>
            }
          </div>
          <div className="modal-name">{modalData.name}</div>
          <div className="modal-phone">{modalData.phone[0].value}</div>
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
          <button className="person-button-delete" onClick={this.deleteEvent}>
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
          <button className="modal-button" onClick={this.state.toggleModal}>Back</button>
        </div>
      </div>
    );
  }
}

export default PersonModal;