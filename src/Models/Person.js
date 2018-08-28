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
			<div className="person-container">
				<div className="person-name">{data.name}</div>
				<div className="person-organization">
					<i class="fa fa-building" aria-hidden="true"></i>
					{data.org_name}
				</div>
				<div className="image-cropper">
					<img src={require('../Img/placeholder.jpg')}  className="person-image"/>
				</div>
			</div>
		);
	}
}
export default Person;