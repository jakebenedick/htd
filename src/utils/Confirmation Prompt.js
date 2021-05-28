import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core';

export default function AlertDialog(props) {
	const { title, text, isOpen, handleCloseTrue, handleCloseFalse } = props;

	return (
		<div>
			<Dialog
				open={isOpen}
				onClose={handleCloseFalse}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'>
				<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{text}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseFalse} color='primary'>
						Cancel
					</Button>
					<Button onClick={handleCloseTrue} color='primary' autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

AlertDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	handleClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	children: PropTypes.element.isRequired,
};
