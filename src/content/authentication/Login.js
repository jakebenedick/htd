import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginUser } from '../../actions/authActions';
//import classnames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

/* async function loginUser(credentials) {
	return fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	}).then((data) => data.json());
} */

class Login extends Component {
	constructor() {
		super();

		this.state = {
			email: '',
			password: '',
			errors: {},
		};
	}

	componentDidMount() {
		// If logged in and user navigates to Login page, should redirect them to dashboard
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/'); // push user to dashboard when they login
		}
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors,
			});
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	};

	onSubmit = (e) => {
		e.preventDefault();
		const userData = {
			email: this.state.email,
			password: this.state.password,
		};
		this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
	};

	render() {
		const { errors } = this.state;
		const classes = this.props;

		return (
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={this.onSubmit}>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							error={errors.email}
							value={this.state.email}
							onChange={this.onChange}
						/>
						<TextField
							variant='outlined'
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							error={errors.password}
							value={this.state.password}
							onChange={this.onChange}
						/>
						{/* <FormControlLabel
						control={<Checkbox value='remember' color='primary' />}
						label='Remember me'
					/> */}
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								{/* <Link href='#' variant='body2'>
								Forgot password?
							</Link> */}
							</Grid>
							<Grid item>
								<Link href='/Register' variant='body2'>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default withStyles(useStyles)(
	connect(mapStateToProps, { loginUser })(withRouter(Login))
);

//export default connect(mapStateToProps, { loginUser })(Login);
