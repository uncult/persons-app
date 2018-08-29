import React, { Component } from 'react';

class Person extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data
		};
	}

	render() {
		let data = this.state.data;

		return (
			<div className="person-container" onClick={() => this.props.openModal(data)}>
				<div className="person-name">{data.name}</div>
				<div className="person-organization">
					<i className="fa fa-building" aria-hidden="true"></i>
					{data.org_name}
				</div>
				<div className="image-cropper">
					<img src={require('../Img/placeholder.jpg')} alt={data.name} className="person-image" />
				</div>
			</div>
		);
	}
}

export default Person;