import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
//import PropTypes from 'prop-types';
import axios from 'axios';
//import { Grid, Paper } from '@material-ui/core';
import ReactJson from 'react-json-view';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.action.hover,
		color: 'rgba(0, 0, 0, 0.54)',
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(even)': {
			backgroundColor: 'white',
		},
	},
}))(TableRow);

const useStyles = makeStyles({
	table: {
		minWidth: 700,
	},
});

function Notifications(props) {
	const classes = useStyles();
	const [notifications, setNotifications] = React.useState([]);

	useEffect(() => {
		axios
			.get(`http://localhost:4000/notification`)
			.then((res) => {
				res.data.sort(function (a, b) {
					var c = new Date(a.time);
					var d = new Date(b.time);
					return d - c;
				});
				setNotifications(res.data);
			})
			.catch(function (error) {
				console.log(error.message);
			});
	});

	const toMonthString = (monthInt) => {
		switch (monthInt) {
			case 0:
				return 'Jan';
			case 1:
				return 'Feb';
			case 2:
				return 'Mar';
			case 3:
				return 'Apr';
			case 4:
				return 'May';
			case 5:
				return 'Jun';
			case 6:
				return 'Jul';
			case 7:
				return 'Aug';
			case 8:
				return 'Sep';
			case 9:
				return 'Oct';
			case 10:
				return 'Nov';
			case 11:
				return 'Dec';
			default:
				return '';
		}
	};

	const getDateString = (time) => {
		return (
			toMonthString(time.getMonth()) +
			' ' +
			time.getDate() +
			' ' +
			time.getFullYear() +
			' at ' +
			(time.getHours() > 12 ? time.getHours() - 12 : time.getHours()) +
			':' +
			(time.getMinutes() > 10
				? time.getMinutes()
				: '0' + time.getMinutes()) +
			(time.getHours() > 12 ? ' PM' : ' AM')
		);
	};

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label='customized table'>
				<TableHead>
					<TableRow>
						<StyledTableCell>Time</StyledTableCell>
						<StyledTableCell>Header</StyledTableCell>
						<StyledTableCell>Text</StyledTableCell>

						<StyledTableCell>Changed Objects</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{notifications.map((row) => (
						<StyledTableRow key={row.text}>
							<StyledTableCell component='th' scope='row'>
								{getDateString(new Date(row.time))}
							</StyledTableCell>
							<StyledTableCell>{row.header}</StyledTableCell>
							<StyledTableCell>{row.text}</StyledTableCell>
							<StyledTableCell>
								{
									<ReactJson
										style={{
											backgroundColor: 'transparent',
										}}
										name={'Entries'}
										enableClipboard={false}
										collapsed={1}
										displayDataTypes={false}
										src={row.changedObjects}
										theme='grayscale:inverted'
									/>
								}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

Notifications.propTypes = {};

export default Notifications;
