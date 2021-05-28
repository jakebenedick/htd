import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authActions';
import OnlineBadge from './OnlineBadge';

const useStyles = () => ({
	root: {
		minWidth: 275,
		position: 'fixed',
		top: '50px',
		right: '25px',
		textAlign: 'center',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

function AccountDropdown(props) {
	const onLogoutClick = (e) => {
		e.preventDefault();
		props.logoutUser();
	};

	const { style, avatar } = props;
	const { user } = props.auth;
	const classes = useStyles();
	var today = new Date(user.iat * 1000);
	const history = useHistory();

	return (
		<Card style={style} className={classes.root} variant='outlined'>
			<CardContent>
				<div style={{ paddingBottom: '10px' }}>
					<OnlineBadge online={true} content={avatar}></OnlineBadge>
				</div>
				<Typography
					className={classes.title}
					color='black'
					gutterBottom>
					{user.name}
				</Typography>
				<Typography color='textSecondary'>{user.email}</Typography>
				<Button
					onClick={() => history.push('/Account')}
					variant='outlined'
					size='medium'
					style={{ marginTop: '15px' }}>
					Manage your HTD account.
				</Button>
				<hr></hr>
				<Typography variant='body2' component='p'>
					<strong>Account Type:</strong> <br></br>
					{user.level}
				</Typography>
				<hr></hr>
				<Typography variant='body2' component='p'>
					<strong>Last login:</strong>
					<br />
					{today.getMonth() +
						1 +
						'/' +
						today.getDate() +
						'/' +
						today.getFullYear() +
						' at ' +
						(today.getHours() > 12
							? today.getHours() - 12
							: today.getHours()) +
						':' +
						(today.getMinutes() > 10
							? today.getMinutes()
							: '0' + today.getMinutes()) +
						(today.getHours() > 12 ? ' PM' : ' AM')}
				</Typography>
			</CardContent>
			<CardActions style={{ float: 'right' }}>
				<Button
					size='medium'
					style={{ color: '#850F88' }}
					onClick={onLogoutClick}>
					Sign Out
				</Button>
			</CardActions>
		</Card>
	);
}

AccountDropdown.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default withStyles(useStyles)(
	connect(mapStateToProps, { logoutUser })(AccountDropdown)
);
