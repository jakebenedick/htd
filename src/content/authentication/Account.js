import React from 'react';
//eslint-disable-next-line
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';

function Account(props) {
	return (
		<div>
			<Container component='main' maxWidth='xs'>
				<h1>Account info goes here.</h1>
			</Container>
		</div>
	);
}

Account.propTypes = {};

export default Account;
