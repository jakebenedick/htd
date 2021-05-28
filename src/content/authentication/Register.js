import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
//import classnames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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

class Register extends Component {
	constructor() {
		super();

		this.state = {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			password2: '',
			errors: {},
		};
	}

	componentDidMount() {
		// If logged in and user navigates to Register page, should redirect them to dashboard
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/');
		}
	}

	componentWillReceiveProps(nextProps) {
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

		const newUser = {
			name: this.state.firstName + ' ' + this.state.lastName,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
		};

		this.props.registerUser(newUser, this.props.history);
	};

	render() {
		const { errors } = this.state;
		const { classes } = this.props;

		return (
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign up
					</Typography>
					<form
						className={classes.form}
						noValidate
						onSubmit={this.onSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete='fname'
									name='firstName'
									variant='outlined'
									required
									fullWidth
									id='firstName'
									label='First Name'
									errors={errors.name}
									value={this.state.firstName}
									onChange={this.onChange}
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant='outlined'
									required
									fullWidth
									id='lastName'
									label='Last Name'
									name='lastName'
									autoComplete='lname'
									errors={errors.name}
									value={this.state.lastName}
									onChange={this.onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='outlined'
									required
									fullWidth
									id='email'
									label='Email Address'
									name='email'
									autoComplete='email'
									errors={errors.email}
									value={this.state.email}
									onChange={this.onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='outlined'
									required
									fullWidth
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='current-password'
									errors={errors.password}
									value={this.state.password}
									onChange={this.onChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant='outlined'
									required
									fullWidth
									name='password2'
									label='Confirm Password'
									type='password'
									id='password2'
									autoComplete='current-password'
									errors={errors.password2}
									value={this.state.password2}
									onChange={this.onChange}
								/>
							</Grid>
						</Grid>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							color='primary'
							className={classes.submit}>
							Sign Up
						</Button>
						<Grid container justify='flex-end'>
							<Grid item>
								<Link href='/Login' variant='body2'>
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors,
});

export default withStyles(useStyles)(
	connect(mapStateToProps, { registerUser })(withRouter(Register))
);

//export default connect(mapStateToProps, { registerUser })(withRouter(Register));
