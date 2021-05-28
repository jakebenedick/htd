import React, { Component } from 'react';
import ContentPage from '../../layout/Content';

class Contact extends Component {
	constructor(props) {
		super();
		this.state = {
			name: '',
			email: '',
			message: '',
			status: 'Submit',
		};
	}

	submitContactForm = () => {
		console.log('Contact form submitted.');
	};

	render() {
		return (
			<ContentPage
				content={<p>Contact form goes here.</p>}
				tabs={[]}
				buttonText={'Submit'}
				buttonFunction={this.submitContactForm}
			/>
		);
	}
}

export default Contact;
