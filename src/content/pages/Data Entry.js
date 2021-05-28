import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import Content from '../../layout/Content';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import CheckIcon from '@material-ui/icons/Check';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { connect } from 'react-redux';

class DataEntry extends Component {
	constructor(props) {
		super(props);

		this.onChangeHazardId = this.onChangeHazardId.bind(this);
		this.onChangeSsdId = this.onChangeSsdId.bind(this);
		this.onChangeSssId = this.onChangeSssId.bind(this);
		this.onChangeHazardDescription = this.onChangeHazardDescription.bind(
			this
		);
		this.onChangeSssRequirementText = this.onChangeSssRequirementText.bind(
			this
		);
		this.onChangeSsdRequirementText = this.onChangeSsdRequirementText.bind(
			this
		);
		this.onChangeHazardDocument = this.onChangeHazardDocument.bind(this);
		this.onChangeSssStatus = this.onChangeSssStatus.bind(this);
		this.onChangeSsdStatus = this.onChangeSsdStatus.bind(this);
		this.onChangeSSSMappedSSD = this.onChangeSSSMappedSSD.bind(this);
		this.onChangeSSDMappedSSS = this.onChangeSSDMappedSSS.bind(this);
		this.onChangeSssFailingList = this.onChangeSssFailingList.bind(this);
		this.onChangeSsdSafetyControlList = this.onChangeSsdSafetyControlList.bind(
			this
		);
		this.onChangeHazardLikelihood = this.onChangeHazardLikelihood.bind(
			this
		);
		this.onChangeHazardRisk = this.onChangeHazardRisk.bind(this);
		this.onChangeHazardSeverity = this.onChangeHazardSeverity.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			user: props.auth.user,
			hazard_id: '',
			hazard_severity: '',
			hazard_likelihood: '',
			hazard_risk: '',
			hazard_supporting_document: '',
			hazard_description: '',
			submissionSuccessful: false,
			submissionUnsuccessful: false,
			hazard_program:
				this.props.secondaryTabSelected != null
					? this.props.secondaryTabSelected
					: 'ABRR',
			typeOfEntry: this.tabSelected(this.props.selectedTab),
			sss_id: '',
			sss_requirement_text: '',
			sss_status: '',
			sss_failing_list: '',
			sss_mapped_ssd: '',
			ssd_id: '',
			ssd_requirement_text: '',
			ssd_status: '',
			ssd_safety_control_list: '',
			ssd_mapped_sss: '',
		};
	}

	calculateRisk = (severity, likelihood) => {
		console.log('Severity: ' + severity + ' Likelihood: ' + likelihood);
		if (likelihood === 'A' || likelihood === 'B') {
			if (severity === 5) {
				return 'Low';
			} else if (severity === 4) {
				return 'Medium';
			} else return 'High';
		} else if (likelihood === 'C') {
			if (severity === 5) {
				return 'Low';
			} else if (severity === 4 || severity === 3) {
				return 'Medium';
			} else return 'High';
		} else if (likelihood === 'D') {
			if (severity === 5 || severity === 4) {
				return 'Low';
			} else if (severity === 3 || severity === 2) {
				return 'Medium';
			} else return 'High';
		} else if (likelihood === 'E') {
			if (severity > 2) {
				return 'Low';
			} else return 'Medium';
		} else return '';
	};

	tabSelected = (selectedTab) => {
		if (typeof selectedTab !== 'undefined' && selectedTab != null) {
			return selectedTab;
		} else return 'Hazard';
	};

	handleCallback = (childData) => {
		if (typeof childData !== 'undefined' && childData != null) {
			this.setState({
				hazard_program: childData,
			});
		} else
			this.setState({
				hazard_program: 'ABRR',
			});
	};

	onChangeHazardProgram(e) {
		this.setState({
			hazard_program: e.target.value,
		});
	}

	onChangeHazardId(e) {
		this.setState({
			hazard_id: e.target.value,
		});
	}

	onChangeSssId(e) {
		this.setState({
			sss_id: e.target.value,
		});
	}

	onChangeSsdId(e) {
		this.setState({
			ssd_id: e.target.value,
		});
	}

	onChangeHazardDescription(e) {
		this.setState({
			hazard_description: e.target.value,
		});
	}

	onChangeSssRequirementText(e) {
		this.setState({
			sss_requirement_text: e.target.value,
		});
	}

	onChangeSsdRequirementText(e) {
		this.setState({
			ssd_requirement_text: e.target.value,
		});
	}

	onChangeSssStatus(e) {
		this.setState({
			sss_status: e.target.value,
		});
	}

	onChangeSsdStatus(e) {
		this.setState({
			ssd_status: e.target.value,
		});
	}

	onChangeSSSMappedSSD(e) {
		this.setState({
			sss_mapped_ssd: e.target.value,
		});
	}

	onChangeSSDMappedSSS(e) {
		this.setState({
			ssd_mapped_sss: e.target.value,
		});
	}

	onChangeSssFailingList(e) {
		this.setState({
			sss_failing_list: e.target.value,
		});
	}

	onChangeSsdSafetyControlList(e) {
		this.setState({
			ssd_safety_control_list: e.target.value,
		});
	}

	onChangeHazardRisk(e) {
		this.setState({
			hazard_risk: e.target.value,
		});
	}

	onChangeHazardSeverity(e) {
		this.setState({
			hazard_severity: e.target.value,
		});
	}

	onChangeHazardLikelihood(e) {
		this.setState({
			hazard_likelihood: e.target.value,
		});
	}

	onChangeHazardDocument(e) {
		this.setState({
			hazard_supporting_document: e.target.value,
		});
	}

	onSubmit(e) {
		e.preventDefault();

		if (this.tabSelected(this.props.selectedTab) === 'Hazard') {
			const newHazard = {
				hazard_id: this.state.hazard_id,
				hazard_severity: this.state.hazard_severity,
				hazard_likelihood: this.state.hazard_likelihood,
				hazard_risk: this.calculateRisk(
					this.state.hazard_severity,
					this.state.hazard_likelihood
				),
				hazard_supporting_document: this.state
					.hazard_supporting_document,
				hazard_description: this.state.hazard_description,
				hazard_program: this.state.hazard_program,
				hazard_sss_list: '',
			};

			axios
				.post('http://localhost:4000/hazard/add', newHazard)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							submissionSuccessful: true,
						});

						const newNotification = {
							changedObjects: [newHazard],
							userTo: 'everyone',
							userFrom: this.state.user.name,
							text: `${this.state.user.name} added a new entry to the HTD: ${this.state.hazard_id}`,
							header: 'Hazard Added',
						};

						axios
							.post(
								`http://localhost:4000/notification/add`,
								newNotification
							)
							.then((res2) => {
								console.log(res2);
							});
					} else {
						this.setState({
							submissionUnsuccessful: true,
						});
					}
				});

			setTimeout(() => {
				this.setState({
					hazard_id: '',
					hazard_severity: '',
					hazard_likelihood: '',
					hazard_risk: '',
					hazard_supporting_document: '',
					hazard_description: '',
					submissionSuccessful: false,
					submissionUnsuccessful: false,
					hazard_program: this.state.hazard_program,
					sss_id: '',
					sss_requirement_text: '',
					sss_status: '',
					ssd_id: '',
					ssd_requirement_text: '',
					ssd_status: '',
					ssd_safety_control_list: '',
				});
			}, 1500);
		} else if (this.tabSelected(this.props.selectedTab) === 'SSS') {
			const newSSS = {
				sss_id: this.state.sss_id,
				sss_requirement_text: this.state.sss_requirement_text,
				sss_failing_list: this.state.sss_failing_list,
				sss_blocking_list: '',
				sss_other_list: '',
				sss_mapped_ssd: '',
				sss_status:
					this.state.sss_status.toLowerCase() === 'passed'
						? true
						: false,
				sss_program: this.state.hazard_program,
			};

			axios.post('http://localhost:4000/sss/add', newSSS).then((res) => {
				if (res.status === 200) {
					this.setState({
						submissionSuccessful: true,
					});

					const newNotification = {
						changedObjects: [newSSS],
						userTo: 'everyone',
						userFrom: this.state.user.name,
						text: `${this.state.user.name} added a new entry to the HTD: ${this.state.sss_id}`,
						header: 'SSS Added',
					};

					axios
						.post(
							`http://localhost:4000/notification/add`,
							newNotification
						)
						.then((res2) => {
							console.log(res2);
						});
				} else {
					this.setState({
						submissionUnsuccessful: true,
					});
				}
			});

			setTimeout(() => {
				this.setState({
					submissionSuccessful: false,
					submissionUnsuccessful: false,
					hazard_program: this.state.hazard_program,
					sss_id: '',
					sss_requirement_text: '',
					sss_status: '',
				});
			}, 1500);
		} else {
			const newSSD = {
				ssd_id: this.state.ssd_id,
				ssd_requirement_text: this.state.ssd_requirement_text,
				ssd_status:
					this.state.ssd_status.toLowerCase() === 'passed'
						? true
						: false,
				ssd_safety_control_list: this.state.ssd_safety_control_list,
				ssd_program: this.state.hazard_program,
				ssd_mapped_sss: '',
			};

			axios.post('http://localhost:4000/ssd/add', newSSD).then((res) => {
				if (res.status === 200) {
					this.setState({
						submissionSuccessful: true,
					});

					const newNotification = {
						changedObjects: [newSSD],
						userTo: 'everyone',
						userFrom: this.state.user.name,
						text: `${this.state.user.name} added a new entry to the HTD: ${this.state.ssd_id}`,
						header: 'SSD Added',
					};

					axios
						.post(
							`http://localhost:4000/notification/add`,
							newNotification
						)
						.then((res2) => {
							console.log(res2);
						});
				} else {
					this.setState({
						submissionUnsuccessful: true,
					});
				}
			});

			setTimeout(() => {
				this.setState({
					submissionSuccessful: false,
					submissionUnsuccessful: false,
					hazard_program: this.state.hazard_program,
					ssd_id: '',
					ssd_requirement_text: '',
					ssd_status: '',
					ssd_safety_control_list: '',
				});
			}, 1500);
		}
	}

	render() {
		return (
			<Content
				tabs={this.props.tabs}
				buttonText='Submit'
				buttonFunction={this.onSubmit}
				parentCallback={this.handleCallback}
				secondarySelectedTab={this.tabSelected(this.props.selectedTab)}
				content={
					<div>
						{this.tabSelected(this.props.selectedTab) ===
							'Hazard' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='Hazard ID'
									style={{ margin: 8 }}
									placeholder={`${this.state.hazard_program}-01`}
									margin='normal'
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.hazard_id}
									onChange={this.onChangeHazardId}
								/>
								<TextField
									id='outlined-full-width'
									label='Hazard Description'
									style={{ margin: 8 }}
									placeholder='(Airborne) Flight Inadvertently Re-routed (Wrong aircraft re-routed)'
									margin='normal'
									fullWidth
									multiline
									rows={4}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.hazard_description}
									onChange={this.onChangeHazardDescription}
								/>

								<FormControl
									variant='outlined'
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '31.5%' }}>
									<InputLabel id='demo-simple-select-outlined-label'>
										Severity
									</InputLabel>
									<Select
										labelId='demo-simple-select-outlined-label'
										id='demo-simple-select-outlined'
										value={this.state.hazard_severity}
										onChange={this.onChangeHazardSeverity}
										label='Severity'>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value={1}>1</MenuItem>
										<MenuItem value={2}>2</MenuItem>
										<MenuItem value={3}>3</MenuItem>
										<MenuItem value={4}>4</MenuItem>
										<MenuItem value={5}>5</MenuItem>
									</Select>
								</FormControl>
								<FormControl
									variant='outlined'
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '31.5%' }}>
									<InputLabel id='demo-simple-select-outlined-label'>
										Likelihood
									</InputLabel>
									<Select
										labelId='demo-simple-select-outlined-label'
										id='demo-simple-select-outlined'
										value={this.state.hazard_likelihood}
										onChange={this.onChangeHazardLikelihood}
										label='Likelihood'>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value={'A'}>A</MenuItem>
										<MenuItem value={'B'}>B</MenuItem>
										<MenuItem value={'C'}>C</MenuItem>
										<MenuItem value={'D'}>D</MenuItem>
										<MenuItem value={'E'}>E</MenuItem>
									</Select>
								</FormControl>

								{/* <TextField
									id='outlined-margin-normal'
									label='Safety Risk'
									style={{ margin: 8, width: '23.273%' }}
									disabled={true}
									placeholder='Low'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.calculateRisk(
										this.state.hazard_severity,
										this.state.hazard_likelihood
									)}
									onChange={this.onChangeHazardRisk}
								/> */}
								<TextField
									id='outlined-margin-normal'
									label='Hazard Analysis Document'
									style={{ margin: 8, width: '31.5%' }}
									placeholder='ERAM ABRR SupHA'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={
										this.state.hazard_supporting_document
									}
									onChange={this.onChangeHazardDocument}
								/>
							</form>
						)}

						{this.tabSelected(this.props.selectedTab) === 'SSS' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='SSS ID'
									style={{ margin: 8 }}
									placeholder='DS12340'
									margin='normal'
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.sss_id}
									onChange={this.onChangeSssId}
								/>
								<TextField
									id='outlined-full-width'
									label='SSS Requirement Text'
									style={{ margin: 8 }}
									placeholder='The system shall (DS12340) provide the capability to submit a hold request from the Aircraft List.  A hold request includes new, modified, and cancels.'
									margin='normal'
									fullWidth
									multiline
									rows={4}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.sss_requirement_text}
									onChange={this.onChangeSssRequirementText}
								/>
								<TextField
									id='outlined-full-width'
									label='SSS Mapped SSD'
									style={{ margin: 8 }}
									placeholder='SSD10484, SSD10756'
									margin='normal'
									fullWidth
									rows={1}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.sss_mapped_ssd}
									onChange={this.onChangeSSSMappedSSD}
								/>
								<FormControl
									variant='outlined'
									fullWidth
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '25%' }}>
									<InputLabel id='demo-simple-select-outlined-label'>
										SSS Status
									</InputLabel>
									<Select
										labelId='demo-simple-select-outlined-label'
										id='demo-simple-select-outlined'
										value={this.state.sss_status}
										onChange={this.onChangeSssStatus}
										label='Likelihood'>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value={'PASSED'}>
											PASSED
										</MenuItem>
										<MenuItem value={'NOT PASSED'}>
											NOT PASSED
										</MenuItem>
									</Select>
								</FormControl>
								<TextField
									id='outlined-full-width'
									label='SSS Failing List'
									style={{ margin: 8, width: '71.5%' }}
									placeholder='SSD10484, SSD10756'
									margin='normal'
									rows={1}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.sss_failing_list}
									onChange={this.onChangeSssFailingList}
								/>
							</form>
						)}

						{this.tabSelected(this.props.selectedTab) === 'SSD' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='SSD ID'
									style={{ margin: 8 }}
									placeholder='SSD10484'
									margin='normal'
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_id}
									onChange={this.onChangeSsdId}
								/>
								<TextField
									id='outlined-full-width'
									label='SSD Requirement Text'
									style={{ margin: 8 }}
									placeholder='The system shall (SSD10484) accept flight plan reroute amendments for proposed flights from TFM.'
									margin='normal'
									fullWidth
									multiline
									rows={4}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_requirement_text}
									onChange={this.onChangeSsdRequirementText}
								/>
								<TextField
									id='outlined-full-width'
									label='SSD Mapped SSS'
									style={{ margin: 8 }}
									placeholder='DS12396, DS13564, FDP10282, FDP10283'
									margin='normal'
									fullWidth
									rows={1}
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_mapped_sss}
									onChange={this.onChangeSSDMappedSSS}
								/>
								<FormControl
									variant='outlined'
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '25%' }}>
									<InputLabel id='demo-simple-select-outlined-label'>
										SSD Status
									</InputLabel>
									<Select
										labelId='demo-simple-select-outlined-label'
										id='demo-simple-select-outlined'
										value={this.state.ssd_status}
										onChange={this.onChangeSsdStatus}
										label='Likelihood'>
										<MenuItem value=''>
											<em>None</em>
										</MenuItem>
										<MenuItem value={'PASSED'}>
											PASSED
										</MenuItem>
										<MenuItem value={'NOT PASSED'}>
											NOT PASSED
										</MenuItem>
									</Select>
								</FormControl>
								<TextField
									id='outlined-full-width'
									label='SSD Safety Control List'
									style={{ margin: 8, width: '71.5%' }}
									placeholder='DS12396, DS13564, FDP10282, FDP10283'
									margin='normal'
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_safety_control_list}
									onChange={this.onChangeSsdSafetyControlList}
								/>
							</form>
						)}

						{this.state.submissionSuccessful ? (
							<Alert
								icon={<CheckIcon fontSize='inherit' />}
								style={{ margin: 8, width: '100%' }}
								severity='success'>
								Success! You have submitted to the HTD.
							</Alert>
						) : (
							<div></div>
						)}
						{this.state.submissionUnsuccessful ? (
							<Alert
								icon={<CancelIcon fontSize='inherit' />}
								style={{ margin: 8, width: '100%' }}
								severity='error'>
								Submission Failure! Something went wrong trying
								to update the original HTD entry.
							</Alert>
						) : (
							<div></div>
						)}
					</div>
				}></Content>
		);
	}
}

DataEntry.propTypes = {
	//classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(DataEntry);
