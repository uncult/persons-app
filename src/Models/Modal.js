import React, { Component } from 'react';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  render() {
    let data = this.state.data;

    return (
      <div className="modal-container">
        {data.name}
			</div>
    );
  }
}
export default Modal;