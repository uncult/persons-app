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
					{data.picture_id ?
						<img src={data.picture_id.pictures["512"]} alt={data.name} className="person-image" /> :
						<div className="person-image person-image-missing">{`${data.first_name[0]}${data.last_name[0]}`}</div>
					}
				</div>

			</div>
		);
	}
}

export default Person;