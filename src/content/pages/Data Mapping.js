import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ContentPage from '../../layout/Content';
import SSDCard from '../cards/SSD Card';
import SSSCard from '../cards/SSS Card';
import axios from 'axios';
import Alert from '../../utils/Confirmation Prompt';
import SuccessDialog from '@material-ui/lab/Alert';
import CheckIcon from '@material-ui/icons/Check';
import TablePagination from '@material-ui/core/TablePagination';
import { connect } from 'react-redux';

function Mapping(props) {
	const { requirementParam, type, programSelected } = props;
	const { user } = props.auth;
	const history = useHistory();
	const tabs = ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM', 'EE'];
	const calledOnce = React.useRef(false);
	const [data, setData] = React.useState();
	const [dataTwo, setDataTwo] = React.useState();
	const [urlTwo, setUrlTwo] = React.useState();
	const [url, setUrl] = React.useState();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [program, setProgram] = React.useState(programSelected);
	const [mappings, setMappings] = React.useState(false);
	const [selectedSSD, setSelectedSSD] = React.useState([]);
	const [selectedSSS, setSelectedSSS] = React.useState([]);
	const [isOpen, setIsOpen] = React.useState(false);
	const [accessDenied, setAccessDenied] = React.useState(false);
	const [submissionSuccessful, setSubmissionSuccessful] = React.useState(
		false
	);

	/*
		useEffect() is a function that is called immediately when the page renders, and is called any time that one of its 
		arguments is changed - in this case url, urltwo, and type. The function checks to see if the type (SSS or SSD), program
		(ABRR, DATACOM, etc), and id / requirementParam (ERD#####) have been declard in the URL.  If they have, these values
		are used to retrieve the specific entries in the DB with a GET request to the specified API endpoint. If one or all of
		the parameters are not specified, there are a series of default values that are added to the URL API endpoint. The data
		that is displayed to the user is in the data and dataTwo arrays, which store the results of the API calls.
	*/
	useEffect(() => {
		if (!calledOnce.current) {
			if (
				typeof requirementParam === 'undefined' &&
				typeof type === 'undefined'
			) {
				setUrl(`http://localhost:4000/SSD/program/${program}`);
			} else if (
				type === 'SSS' &&
				typeof requirementParam === 'undefined'
			) {
				setUrl(`http://localhost:4000/SSS/program/${program}`);
			} else if (
				type === 'SSD' &&
				typeof requirementParam === 'undefined'
			) {
				setUrl(`http://localhost:4000/SSD/program/${program}`);
			} else if (
				type === 'SSS' &&
				typeof requirementParam !== 'undefined'
			) {
				setUrl(`http://localhost:4000/SSS/id/${requirementParam}`);
			} else {
				setUrl(`http://localhost:4000/SSD/id/${requirementParam}`);
			}
			calledOnce.current = true;
		}

		axios
			.get(url)
			.then(function (response) {
				setData(response.data);

				if (typeof requirementParam !== 'undefined') {
					if (type === 'SSD') {
						setUrlTwo(
							`http://localhost:4000/SSS/ids/${response.data[0].ssd_mapped_sss}`
						);
					} else {
						setUrlTwo(
							`http://localhost:4000/SSD/ids/${response.data[0].sss_mapped_ssd}`
						);
					}
				}
			})
			.catch(function (error) {});

		axios
			.get(urlTwo)
			.then(function (response) {
				setDataTwo(response.data);
			})
			.catch(function (error) {});

		//eslint-disable-next-line
	}, [url, urlTwo, type]);

	/*	
		This function is called when a user presses the mapping button.  setIsOpen(true) opens
		the confirmation alert prompt.
	*/
	const onSubmit = () => {
		if (user.level === 'Admin') {
			setIsOpen(true);
		} else {
			setAccessDenied(true);
		}
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

	/*
		This function is called when a user presses the cancel button on the mapping confirmation alert.
		setIsOpen(false) closes the alert.
	*/
	const handleAlertCloseFalse = () => {
		setIsOpen(false);
	};

	/*
		This function is called when a user presses the confirm button on the mapping confirmation alert. The first thing the 
		function does is convert the selected SSS and SSD object arrays into a comma-separated string of ids.  This is necessary
		in order to store the references in the _mapped_ field of the data entry.  To update the selected SSS and SSD data entries
		with the new references, a new entry is created and the field values are copied over to the new entry.  The _mapped_ field
		is updated to include the string of the opposite type of entries.  Once the new entry has been created, a POST request is
		made to the API, replacing the entry of the sss_id with the new entry that was just created.  This process is completed
		for every entry in the selected SSS and SSD arrays.  setIsOpen(false) closes the confirmation alert, and the user is shown
		a confirmation display for 1.5 seconds before being redirected back to the main /Mapping page.
	*/
	const handleAlertCloseTrue = () => {
		var i, j;
		var selectedSSSString = [];
		var selectedSSDString = [];

		for (i = 0; i < selectedSSS.length; i++) {
			selectedSSSString.push(selectedSSS[i].sss_id);
		}

		for (j = 0; j < selectedSSD.length; j++) {
			selectedSSDString.push(selectedSSD[j].ssd_id);
		}

		for (i = 0; i < selectedSSS.length; i++) {
			const newSSS = {
				sss_id: selectedSSS[i].sss_id,
				sss_requirement_text: selectedSSS[i].sss_requirement_text,
				sss_status: selectedSSS[i].sss_status,
				sss_failing_list: selectedSSS[i].sss_failing_list,
				sss_blocking_list: selectedSSS[i].sss_blocking_list,
				sss_other_list: selectedSSS[i].sss_other_list,
				sss_program: selectedSSS[i].sss_program,
				sss_mapped_ssd:
					selectedSSS[i].sss_mapped_ssd === ''
						? selectedSSDString.toString()
						: selectedSSS[i].sss_mapped_ssd +
						  ',' +
						  selectedSSDString.toString(),
			};

			axios
				.post(
					`http://localhost:4000/sss/update/${selectedSSS[i].sss_id}`,
					newSSS
				)
				.then((res) => console.log(res.data));
		}

		for (j = 0; j < selectedSSD.length; j++) {
			const newSSD = {
				ssd_id: selectedSSD[j].ssd_id,
				ssd_requirement_text: selectedSSD[j].ssd_requirement_text,
				ssd_status: selectedSSD[j].ssd_status,
				ssd_program: selectedSSD[j].ssd_program,
				ssd_safety_control_list: selectedSSD[j].ssd_safety_control_list,
				ssd_mapped_sss:
					selectedSSD[j].ssd_mapped_sss === ''
						? selectedSSSString.toString()
						: selectedSSD[j].ssd_mapped_sss +
						  ',' +
						  selectedSSSString.toString(),
			};

			axios
				.post(
					`http://localhost:4000/ssd/update/${selectedSSD[j].ssd_id}`,
					newSSD
				)
				.then((res) => console.log(res.data));
		}

		setIsOpen(false);
		setSubmissionSuccessful(true);
		setTimeout(() => {
			setSubmissionSuccessful(false);

			window.location.replace('/Mapping');
		}, 1500);
	};

	/*
		This function is called when the user clicks on one of the program tabs. It updates both
		axios request urls so that the data for the selected program can be loaded. 
	 */
	const handleCallback = (childData) => {
		setProgram(childData);

		if (type === 'SSD') {
			setUrl(`http://localhost:4000/SSD/program/${childData}`);
		} else setUrl(`http://localhost:4000/SSS/program/${childData}`);
	};

	/*
		This function is called when a user clicks on an already-selected SSD card. This removes the
		card data entry from the array.
	*/
	const unselectSSD = (entry) => {
		var result = selectedSSD.filter((ssd) => ssd.ssd_id !== entry.ssd_id);

		//console.log(result);
		setSelectedSSD(result);
	};

	/*
		This function is called when a user clicks on an SSD card.  This adds the card data entry to the
		selectedSSD array.
	*/
	const selectSSD = (entry) => {
		setSelectedSSD([...selectedSSD, entry]);
		//console.log(selectedSSD);
	};

	/*
		This function is called when a user clicks on an already-selected SSS card. This removes the card data entry from
		the array.
	*/
	const unselectSSS = (entry) => {
		var result = selectedSSS.filter((ssd) => ssd.ssd_id !== entry.ssd_id);

		//console.log(result);
		setSelectedSSS(result);
	};

	/*
		This function is called when a user clicks on an SSS card.  This adds the card data entry to the selectedSSS array.
	*/
	const selectSSS = (entry) => {
		setSelectedSSS([...selectedSSS, entry]);
		//console.log(selectedSSS);
	};

	/*
		This function is called when a user clicks on the "Show Mapping" button, and changes the state of the mappings variable.
		The mappings variable is used to conditionally render the data with and without the graphical mapping lines.
	*/
	const handleMappingClicked = (mappingsClicked) => {
		var sssSearchArray = [];
		var ssdSearchArray = [];

		//Mappings button is selected.
		if (mappingsClicked) {
			let x = document.getElementById('mapping_button');
			x.style.backgroundColor = '#850F88';
			x.style.color = 'white';

			if (type === 'SSD') {
				selectedSSD.forEach((ssdEntry) => {
					sssSearchArray.push(ssdEntry.ssd_mapped_sss.split(','));
					ssdSearchArray.push(ssdEntry.ssd_id);
				});

				setUrl(
					`http://localhost:4000/SSD/ids/${ssdSearchArray.toString()}`
				);
				setUrlTwo(
					`http://localhost:4000/SSS/ids/${sssSearchArray.toString()}`
				);
			} else {
				selectedSSS.forEach((sssEntry) => {
					ssdSearchArray.push(sssEntry.sss_mapped_ssd.split(','));
					sssSearchArray.push(sssEntry.sss_id);
				});

				setUrlTwo(
					`http://localhost:4000/SSD/ids/${ssdSearchArray.toString()}`
				);
				setUrl(
					`http://localhost:4000/SSS/ids/${sssSearchArray.toString()}`
				);
			}
		} else {
			//Mappings button is deselected.
			let x = document.getElementById('mapping_button');
			x.style.backgroundColor = '#f5f5f5';
			x.style.color = 'gray';
			setSelectedSSD([]);
			setSelectedSSS([]);

			if (type === 'SSD') {
				//Resets the left and right column with the original data
				setUrl(`http://localhost:4000/SSD/program/${program}`);
				setUrlTwo(`http://localhost:4000/SSS/id/`);
			} else {
				//Resets the left and right column with the original data
				setUrl(`http://localhost:4000/SSS/program/${program}`);
				setUrlTwo(`http://localhost:4000/SSD/id/`);
			}
		}
		setMappings(mappingsClicked);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<ContentPage
			tabs={tabs}
			parentCallback={handleCallback}
			buttonText={mappings ? 'Clear' : 'Mappings'}
			showMapping={true}
			showEdit={true}
			editCallback={onSubmit}
			hideButton={true}
			mappingCallback={handleMappingClicked}
			selectedTabIndex={tabs.indexOf(programSelected)}
			content={
				<Fragment>
					{mappings ? (
						<div style={{ display: 'flex' }}>
							{/*This div contains the left column*/}
							<div style={{ flex: '50%' }}>
								{data && data.length > 0 ? (
									data.map((entry) =>
										//Chooses whether SSD or SSS is rendered on left side
										type === 'SSD' ? (
											<div key={entry.ssd_id + '_mapped'}>
												<SSDCard
													selectCallback={selectSSD}
													unselectCallback={
														unselectSSD
													}
													id={entry.ssd_id}
													dataObj={entry}
												/>
											</div>
										) : (
											<div key={entry.sss_id + '_mapped'}>
												<SSSCard
													selectCallback={selectSSS}
													unselectCallback={
														unselectSSS
													}
													id={entry.sss_id}
													dataObj={entry}
												/>
											</div>
										)
									)
								) : (
									//Rendered if no data is present
									<div>
										<p>
											No{' '}
											{type === 'SSD' ||
											typeof type === 'undefined'
												? 'SSD'
												: 'SSS'}{' '}
											data found.
										</p>
									</div>
								)}
							</div>
							{/*This div contains the right column*/}
							<div
								style={{
									flex: '50%',
								}}>
								{dataTwo && dataTwo.length > 0 ? (
									dataTwo.map((entry) =>
										//Renders the opposite type to the left side
										type === 'SSD' ? (
											//Only render arrow if the card has been selected
											<div key={entry.sss_id + '_right'}>
												<SSSCard
													selectCallback={selectSSS}
													unselectCallback={
														unselectSSS
													}
													id={entry.sss_id}
													dataObj={entry}
												/>
											</div>
										) : (
											<div key={entry.ssd_id + '_right'}>
												<SSDCard
													selectCallback={selectSSD}
													unselectCallback={
														unselectSSD
													}
													id={entry.ssd_id}
													dataObj={entry}
												/>
											</div>
										)
									)
								) : (
									//Rendered if no data is present
									<div>
										<p>
											No matching{' '}
											{type === 'SSS' ||
											typeof type === 'undefined'
												? 'SSS'
												: 'SSD'}{' '}
											data loaded. Click on an entry to
											see mapped data.{' '}
										</p>
									</div>
								)}
							</div>
						</div>
					) : (
						//Mappings button is not selected.
						<div style={{ display: 'flex' }}>
							{/* Left Column*/}
							<div style={{ flex: '50%' }}>
								{data && data.length > 0 ? (
									data
										.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
										)
										.map((entry) =>
											type === 'SSD' ? (
												<div key={entry.ssd_id}>
													<SSDCard
														selectCallback={
															selectSSD
														}
														unselectCallback={
															unselectSSD
														}
														id={entry.ssd_id}
														dataObj={entry}
													/>
												</div>
											) : (
												<div key={entry.sss_id}>
													<SSSCard
														selectCallback={
															selectSSS
														}
														unselectCallback={
															unselectSSS
														}
														id={entry.sss_id}
														dataObj={entry}
													/>
												</div>
											)
										)
								) : (
									<div>
										<p>
											No{' '}
											{type === 'SSD' ||
											typeof type === 'undefined'
												? 'SSD'
												: 'SSS'}{' '}
											data found.
										</p>
									</div>
								)}
								<hr></hr>
								{data && data.length > 0 && (
									<div>
										<TablePagination
											rowsPerPageOptions={[5, 10, 25]}
											component='div'
											count={data.length}
											rowsPerPage={rowsPerPage}
											page={page}
											onChangePage={handleChangePage}
											onChangeRowsPerPage={
												handleChangeRowsPerPage
											}
										/>
									</div>
								)}
							</div>
							{/* Right Column*/}
							{/* <div
								style={{
									flex: '50%',
								}}>
								{dataTwo && dataTwo.length > 0 ? (
									dataTwo.map((entry) =>
										type === 'SSD' ? (
											<div key={entry.sss_id + '_right'}>
												<SSSCard
													selectCallback={selectSSS}
													unselectCallback={
														unselectSSS
													}
													id={entry.sss_id}
													dataObj={entry}
												/>
											</div>
										) : (
											<div key={entry.ssd_id + '_right'}>
												<SSDCard
													selectCallback={selectSSD}
													unselectCallback={
														unselectSSD
													}
													id={entry.ssd_id}
													dataObj={entry}
												/>
											</div>
										)
									)
								) : (
									<div>
										<p>
											No matching{' '}
											{type === 'SSD' ||
											typeof type === 'undefined'
												? 'SSS'
												: 'SSD'}{' '}
											data loaded. Click on an entry to
											see mapped data.{' '}
										</p>
									</div>
								)}
							</div>
						 */}
						</div>
					)}
					<Alert
						title='Confirm Mapping'
						text={`Are you sure you would like to create a mapping between the selected ${
							type === 'SSS' ? 'SSS(s)' : 'SSD(s)'
						} and ${
							type === 'SSS' ? 'SSD(s)' : 'SSS(s)'
						}?  This operation cannot be undone.`}
						isOpen={isOpen}
						handleCloseFalse={handleAlertCloseFalse}
						handleCloseTrue={handleAlertCloseTrue}></Alert>
					<Alert
						title='Access Denied'
						text={
							'You do not currently have access to this function.  Only Admins can access this function.  Would you like to navigate to the Contact page to request access to an admin account?'
						}
						isOpen={accessDenied}
						handleCloseFalse={handleAccessDeniedAlertFalse}
						handleCloseTrue={handleAccessDeniedAlertTrue}></Alert>
					{submissionSuccessful && (
						<SuccessDialog
							icon={<CheckIcon fontSize='inherit' />}
							style={{ margin: 8, width: '100%' }}
							severity='success'>
							Success! The selected entries have been mapped to
							each other.
						</SuccessDialog>
					)}
				</Fragment>
			}></ContentPage>
	);
}

Mapping.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Mapping);
