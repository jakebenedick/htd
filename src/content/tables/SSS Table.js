import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import Link from '@material-ui/core/Link';
import Alert from '../../utils/Confirmation Prompt';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
		headerArray,
	} = props;

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	const createHeadCells = (headerArray) => {
		var headers = [];
		var i;

		for (i = 0; i < headerArray.length; i++) {
			headers.push({
				label: headerArray[i],
				id: 'sss_' + headerArray[i].replaceAll(' ', '_').toLowerCase(),
			});
		}

		return headers;
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding='checkbox'>
					<Checkbox
						indeterminate={
							numSelected > 0 && numSelected < rowCount
						}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all entries' }}
					/>
				</TableCell>
				{createHeadCells(headerArray).map((headCell) => (
					<TableCell
						key={headCell.id}
						align='left'
						padding='default'
						sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc'
										? 'sorted descending'
										: 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	headerArray: PropTypes.array.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(
						theme.palette.secondary.light,
						0.85
					),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: '1 1 100%',
	},
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const {
		numSelected,
		parentCallback,
		data,
		searchCriteria,
		category,
		user,
		setAccessDenied,
	} = props;
	const [isOpen, setIsOpen] = React.useState(false);

	const handleAlertOpen = () => {
		if (user.level !== 'Admin') {
			setAccessDenied(true);
		} else {
			setIsOpen(true);
		}
	};

	const handleAlertCloseTrue = () => {
		setIsOpen(false);
		parentCallback();
	};

	const handleAlertCloseFalse = () => {
		setIsOpen(false);
	};

	const exportToPdf = (data, title, category, searchCriteria) => {
		const headers = [
			[
				'SSS ID',
				'SSS Requirement Text',
				'SSS Status',
				'Mapped SSD',
				'SSS Program',
			],
		];
		const today = new Date();
		const todayDate =
			today.getDate() +
			'-' +
			today.toLocaleString('default', { month: 'long' }).substring(0, 3) +
			'-' +
			today.getFullYear();

		//const title = `ERAM ${program} HAZARD OVERALL STATUS REPORT`;
		const unit = 'pt';
		const size = 'A4'; // Use A1, A2, A3 or A4
		const orientation = 'landscape'; // portrait or landscape

		const marginLeft = 40;
		const doc = new jsPDF(orientation, unit, size);

		doc.setFontSize(15);
		doc.setTextColor('black');

		const dataForExport = data.map((entry) => [
			entry.sss_id,
			entry.sss_requirement_text,
			entry.sss_status ? 'Passed' : 'Not Passed',
			entry.sss_mapped_ssd,
			entry.sss_program,
		]);

		let content = {
			startY: 50,
			head: headers,
			body: dataForExport,
			headStyles: {
				fillColor: '#850F88',
			},
		};

		const addFooters = (doc) => {
			const pageCount = doc.internal.getNumberOfPages();

			doc.setFont('helvetica', 'italic');
			doc.setFontSize(8);
			for (var i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.text(
					todayDate,
					marginLeft,
					doc.internal.pageSize.height - 40,
					{ align: 'left' }
				);
				doc.text(
					'Page ' + String(i) + ' of ' + String(pageCount),
					doc.internal.pageSize.width - 40,
					doc.internal.pageSize.height - 40,
					{
						align: 'right',
					}
				);
			}
		};

		doc.text(
			title + ' - [' + category + '=' + searchCriteria + ']',
			marginLeft,
			40,
			{
				align: 'left',
			}
		);
		doc.autoTable(content);
		addFooters(doc);
		doc.save(`${title}_${category}_${searchCriteria}.pdf`);
	};

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color='inherit'
					variant='subtitle1'
					component='div'>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					className={classes.title}
					variant='h6'
					id='tableTitle'
					component='div'>
					Results
				</Typography>
			)}

			{numSelected > 0 ? (
				<Fragment>
					<Tooltip title='Delete'>
						<IconButton
							aria-label='delete'
							onClick={handleAlertOpen}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
					<Alert
						title='Confirm Delete'
						text='Are you sure you would like to delete this entry from the HTD?  This operation cannot be undone.'
						isOpen={isOpen}
						handleCloseFalse={handleAlertCloseFalse}
						handleCloseTrue={handleAlertCloseTrue}></Alert>
				</Fragment>
			) : (
				<Tooltip title='Export Results'>
					<IconButton
						aria-label='Export Results'
						onClick={() => {
							return exportToPdf(
								data,
								`SSS Search Results`,
								category,
								searchCriteria
							);
						}}>
						<PrintIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1,
	},
}));

function EnhancedTable(props) {
	const classes = useStyles();
	const { user } = props.auth;
	const history = useHistory();
	const [accessDenied, setAccessDenied] = React.useState(false);
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	var rows = props.data;
	const { searchCriteria, category } = props;

	const onDeleteButtonClicked = () => {
		if (user.level !== 'Admin') {
			setAccessDenied(true);
		} else {
			for (let i = 0; i < selected.length; i++) {
				axios
					.delete(`http://localhost:4000/sss/delete/${selected[i]}`)
					.then((res) => {
						if (res.status === 200) {
							//console.log(res.data);

							const newNotification = {
								changedObjects: [res.data],
								userTo: 'everyone',
								userFrom: this.state.user.name,
								text: `${user.name} deleted an entry on the HTD: ${selected[i]}`,
								header: 'SSS Deleted',
							};

							axios
								.post(
									`http://localhost:4000/notification/add`,
									newNotification
								)
								.then((res2) => {
									//console.log(res2);
								});
						}
					});
				setSelected[i] = '';
			}
			setSelected([]);
			window.location.reload();
		}
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.sss_id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, sss_id) => {
		const selectedIndex = selected.indexOf(sss_id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, sss_id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const splitSSDMapping = (mappingString) => {
		if (typeof mappingString !== 'undefined') {
			return mappingString.split(',');
		} else return [];
	};

	/*
		This function is called when a user presses the cancel button on the access denied confirmation alert.
		setAccessDenied(false) closes the alert.
	*/
	const handleAccessDeniedAlertFalse = () => {
		setAccessDenied(false);
	};

	/*
		This function is called when a user presses the confirm button on the access denied confirmation alert.
		The user is redirected to the Contact page to request access to an admin account.
	*/
	const handleAccessDeniedAlertTrue = () => {
		history.push('/Contact');
	};

	const updateFunction = (event, row) => {
		if (user.level !== 'Admin') {
			setAccessDenied(true);
		} else {
			const { sss_id } = row;

			history.push(`/edit/sss/${sss_id}`);
		}
	};

	const isSelected = (sss_id) => selected.indexOf(sss_id) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					setAccessDenied={setAccessDenied}
					numSelected={selected.length}
					parentCallback={onDeleteButtonClicked}
					data={rows}
					user={user}
					searchCriteria={searchCriteria}
					category={category}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby='tableTitle'
						size='medium'
						aria-label='enhanced table'>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
							headerArray={props.headerArray}
						/>
						<TableBody>
							{stableSort(rows, getComparator(order, orderBy))
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => {
									const isItemSelected = isSelected(
										row.sss_id
									);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) =>
												handleClick(event, row.sss_id)
											}
											role='checkbox'
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.sss_id}
											selected={isItemSelected}
											onDoubleClick={(event) =>
												updateFunction(event, row)
											}>
											<TableCell padding='checkbox'>
												<Checkbox
													checked={isItemSelected}
													inputProps={{
														'aria-labelledby': labelId,
													}}
												/>
											</TableCell>

											<TableCell
												component='th'
												id={row.id}
												scope='row'
												padding='none'>
												<Link
													href={`/Mapping/SSS/${row.sss_program}/${row.sss_id}`}>
													{row.sss_id}
												</Link>
											</TableCell>
											<TableCell>
												{row.sss_requirement_text}
											</TableCell>
											<TableCell>
												{row.sss_status
													? 'PASSED'
													: 'NOT PASSED'}
											</TableCell>
											<TableCell>
												{splitSSDMapping(
													row.sss_mapped_ssd
												).map((value) => (
													<Link
														href={`/Mapping/SSD/${row.sss_program}/${value}`}>
														{value}
														<br></br>
													</Link>
												))}
											</TableCell>
											<TableCell>
												{row.sss_program}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<Alert
				title='Access Denied'
				text={
					'You do not currently have access to this function.  Only Admins can access this function.  Would you like to navigate to the Contact page to request access to an admin account?'
				}
				isOpen={accessDenied}
				handleCloseFalse={handleAccessDeniedAlertFalse}
				handleCloseTrue={handleAccessDeniedAlertTrue}></Alert>
		</div>
	);
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(EnhancedTable);
