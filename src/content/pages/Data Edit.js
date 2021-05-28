import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
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

class DataEdit extends Component {
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
		this.onChangeSSDMappedSSS = this.onChangeSSDMappedSSS.bind(this);
		this.onChangeSSSMappedSSD = this.onChangeSSSMappedSSD.bind(this);
		this.onChangeSsdSafetyControlList = this.onChangeSsdSafetyControlList.bind(
			this
		);
		this.onChangeSsdProgram = this.onChangeSsdProgram.bind(this);
		this.onChangeSssProgram = this.onChangeSssProgram.bind(this);
		this.onChangeHazardLikelihood = this.onChangeHazardLikelihood.bind(
			this
		);
		this.onChangeHazardRisk = this.onChangeHazardRisk.bind(this);
		this.onChangeHazardSeverity = this.onChangeHazardSeverity.bind(this);
		this.onChangeHazardProgram = this.onChangeHazardProgram.bind(this);
		this.onChangeHazardSSSList = this.onChangeHazardSSSList.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			user: props.auth.user,
			hazard_id: this.props.hazard_id != null ? this.props.hazard_id : '',
			sss_id: this.props.sss_id != null ? this.props.sss_id : '',
			ssd_id: this.props.ssd_id != null ? this.props.ssd_id : '',
			submissionSuccessful: false,
			submissionUnsuccessful: false,
			typeOfEntry:
				this.props.secondaryTabSelected != null
					? this.props.secondaryTabSelected
					: '',
		};
	}

	componentDidMount() {
		if (this.props.hazard_id != null) {
			axios
				.get(`http://localhost:4000/hazard/${this.props.hazard_id}`)
				.then((res) => {
					if (res.status !== 500) {
						this.setState({
							hazard_id: res.data.hazard_id,
							hazard_description: res.data.hazard_description,
							hazard_likelihood: res.data.hazard_likelihood,
							hazard_risk: res.data.hazard_risk,
							hazard_severity: res.data.hazard_severity,
							hazard_supporting_document:
								res.data.hazard_supporting_document,
							hazard_sss_list: res.data.hazard_sss_list,
							hazard_program: res.data.hazard_program,
							hazard_status: res.data.hazard_status,
							hazard_old: res.data,
						});
					}
				});
		} else if (this.props.sss_id != null) {
			axios
				.get(`http://localhost:4000/sss/${this.props.sss_id}`)
				.then((res) => {
					if (res.status !== 500) {
						this.setState({
							sss_id: res.data.sss_id,
							sss_requirement_text: res.data.sss_requirement_text,
							sss_status: res.data.sss_status,
							sss_failing_list: res.data.sss_failing_list,
							sss_blocking_list: res.data.sss_blocking_list,
							sss_other_list: res.data.sss_other_list,
							sss_program: res.data.sss_program,
							sss_mapped_ssd: res.data.sss_mapped_ssd,
							sss_old: res.data,
						});
					}
				});
		} else {
			axios
				.get(`http://localhost:4000/ssd/${this.props.ssd_id}`)
				.then((res) => {
					if (res.status !== 500) {
						this.setState({
							ssd_id: res.data.ssd_id,
							ssd_requirement_text: res.data.ssd_requirement_text,
							ssd_status: res.data.ssd_status,
							ssd_safety_control_list:
								res.data.ssd_safety_control_list,
							ssd_program: res.data.ssd_program,
							ssd_mapped_sss: res.data.ssd_mapped_sss,
							ssd_old: res.data,
						});
					}
				});
		}
	}

	tabSelected = (selectedTab) => {
		if (typeof selectedTab !== 'undefined' && selectedTab != null) {
			return selectedTab;
		} else return 'ABRR';
	};

	handleCallback = (childData) => {
		this.setState({
			typeOfEntry: childData,
		});

		if (typeof childData !== 'undefined' && childData != null) {
			this.setState({
				typeOfEntry: childData,
			});
		} else
			this.setState({
				typeOfEntry: 'Hazard Edit',
			});
	};

	onChangeHazardSSSList(e) {
		this.setState({
			hazard_sss_list: e.target.value,
		});
	}

	onChangeHazardProgram(e) {
		this.setState({
			hazard_program: e.target.value,
		});
	}

	onChangeSssProgram(e) {
		this.setState({
			sss_program: e.target.value,
		});
	}

	onChangeSsdProgram(e) {
		this.setState({
			ssd_program: e.target.value,
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

		if (this.state.typeOfEntry === 'Hazard Edit') {
			const newHazard = {
				hazard_id: this.state.hazard_id,
				hazard_severity: this.state.hazard_severity,
				hazard_likelihood: this.state.hazard_likelihood,
				hazard_risk: this.state.hazard_risk,
				hazard_supporting_document: this.state
					.hazard_supporting_document,
				hazard_description: this.state.hazard_description,
				hazard_program: this.state.hazard_program,
				hazard_sss_list: this.state.hazard_sss_list,
				hazard_status: this.state.hazard_status,
			};

			axios
				.post(
					`http://localhost:4000/hazard/update/${this.state.hazard_id}`,
					newHazard
				)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							submissionSuccessful: true,
						});

						const newNotification = {
							changedObjects: [newHazard, this.state.hazard_old],
							userTo: 'everyone',
							userFrom: this.state.user.name,
							text: `${this.state.user.name} updated an entry on the HTD: ${this.state.hazard_id}`,
							header: 'Hazard Updated',
						};

						axios
							.post(
								`http://localhost:4000/notification/add`,
								newNotification
							)
							.then((res2) => {
								//console.log(res2);
							});
					} else {
						this.setState({
							submissionUnsuccessful: true,
						});
						//console.log('Submission unsuccessful :(');
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
					hazard_program: '',
				});
				this.props.history.push('/Search');
			}, 1500);
		} else if (this.state.typeOfEntry === 'SSS Edit') {
			const newSSS = {
				sss_id: this.state.sss_id,
				sss_requirement_text: this.state.sss_requirement_text,
				sss_failing_list: '',
				sss_blocking_list: '',
				sss_other_list: '',
				sss_status:
					this.state.sss_status.toLowerCase() === 'passed'
						? true
						: false,
				sss_program: this.state.sss_program,
				sss_mapped_ssd: this.state.sss_mapped_ssd,
			};

			axios
				.post(
					`http://localhost:4000/sss/update/${this.state.sss_id}`,
					newSSS
				)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							submissionSuccessful: true,
						});

						const newNotification = {
							changedObjects: [newSSS, this.state.sss_old],
							userTo: 'everyone',
							userFrom: this.state.user.name,
							text: `${this.state.user.name} updated an entry on the HTD: ${this.state.sss_id}`,
							header: 'SSS Updated',
						};

						axios
							.post(
								`http://localhost:4000/notification/add`,
								newNotification
							)
							.then((res2) => {
								//console.log(res2);
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
					sss_program: '',
					sss_mapped_ssd: '',
					sss_id: '',
					sss_requirement_text: '',
					sss_status: '',
				});
				this.props.history.push('/Search');
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
				ssd_program: this.state.ssd_program,
				ssd_mapped_sss: this.state.ssd_mapped_sss,
			};

			axios
				.post(
					`http://localhost:4000/ssd/update/${this.state.ssd_id}`,
					newSSD
				)
				.then((res) => {
					if (res.status === 200) {
						this.setState({
							submissionSuccessful: true,
						});

						const newNotification = {
							changedObjects: [newSSD, this.state.ssd_old],
							userTo: 'everyone',
							userFrom: this.state.user.name,
							text: `${this.state.user.name} updated an entry on the HTD: ${this.state.ssd_id}`,
							header: 'SSD Updated',
						};

						axios
							.post(
								`http://localhost:4000/notification/add`,
								newNotification
							)
							.then((res2) => {
								//console.log(res2);
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
					ssd_program: '',
					ssd_mapped_sss: '',
					ssd_id: '',
					ssd_requirement_text: '',
					ssd_status: '',
					ssd_safety_control_list: '',
				});
				this.props.history.push('/Search');
			}, 1500);
		}
	}

	render() {
		return (
			<Content
				tabs={this.props.tabs}
				buttonText='Update'
				buttonFunction={this.onSubmit}
				parentCallback={this.handleCallback}
				selectedTab={this.typeOfEntry}
				content={
					<div>
						{this.state.typeOfEntry === 'Hazard Edit' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='Hazard ID'
									style={{ margin: 8 }}
									placeholder='ABRR-01'
									disabled={true}
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

								<TextField
									id='outlined-full-width'
									label='Hazard SSS List'
									style={{ margin: 8 }}
									placeholder='DS12340, DS12396, DS13564, DS9312, DS9314, ERD2895, ERD2896, ERD3886, ERD4443, FDP10282, FDP10283, FDP10298, SIS28'
									margin='normal'
									multiline
									rows={4}
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.hazard_sss_list}
									onChange={this.onChangeHazardSSSList}
								/>

								<FormControl
									variant='outlined'
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '19%' }}>
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
										<MenuItem value={'1'}>1</MenuItem>
										<MenuItem value={'2'}>2</MenuItem>
										<MenuItem value={'3'}>3</MenuItem>
										<MenuItem value={'4'}>4</MenuItem>
										<MenuItem value={'5'}>5</MenuItem>
									</Select>
								</FormControl>
								<FormControl
									variant='outlined'
									/*className={classes.formControl}*/
									style={{ margin: 8, width: '18%' }}>
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

								<TextField
									id='outlined-margin-normal'
									label='Safety Risk'
									style={{ margin: 8, width: '18%' }}
									//disabled={true}
									placeholder='Low'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.hazard_risk}
									onChange={this.onChangeHazardRisk}
								/>
								<TextField
									id='outlined-margin-normal'
									label='Hazard Analysis Document'
									style={{ margin: 8, width: '18%' }}
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
								<TextField
									id='outlined-margin-normal'
									label='Hazard Program'
									style={{ margin: 8, width: '18%' }}
									placeholder='ABRR'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.hazard_program}
									onChange={this.onChangeHazardProgram}
								/>
							</form>
						)}

						{this.state.typeOfEntry === 'SSS Edit' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='SSS ID'
									style={{ margin: 8 }}
									placeholder='DS12340'
									disabled={true}
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
									style={{ margin: 8, width: '48.5%' }}>
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
									label='SSS Program'
									style={{ margin: 8, width: '48.5%' }}
									placeholder='ABRR'
									margin='normal'
									fullWidth
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.sss_program}
									onChange={this.onChangeSssProgram}
								/>
							</form>
						)}

						{this.state.typeOfEntry === 'SSD Edit' && (
							<form
								className='root'
								noValidate
								autoComplete='off'>
								<TextField
									id='outlined-full-width'
									label='SSD ID'
									style={{ margin: 8 }}
									placeholder='SSD10484'
									disabled={true}
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
								<TextField
									id='outlined-full-width'
									label='SSD Program'
									style={{ margin: 8, width: '25%' }}
									placeholder='ABRR'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_program}
									onChange={this.onChangeSsdProgram}
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
									style={{ margin: 8, width: '45%' }}
									placeholder='DS12396, DS13564, FDP10282, FDP10283'
									margin='normal'
									InputLabelProps={{
										shrink: true,
									}}
									variant='outlined'
									value={this.state.ssd_safety_control_list}
									onChange={this.onChangeSsdSafetyControlList}
								/>
							</form>
						)}

						{this.state.submissionSuccessful && (
							<Alert
								icon={<CheckIcon fontSize='inherit' />}
								style={{ margin: 8, width: '100%' }}
								severity='success'>
								Success! You have edited the original HTD entry.
							</Alert>
						)}
						{this.state.submissionUnsuccessful && (
							<Alert
								icon={<CancelIcon fontSize='inherit' />}
								style={{ margin: 8, width: '100%' }}
								severity='error'>
								Submission Failure! Something went wrong trying
								to update the original HTD entry.
							</Alert>
						)}
					</div>
				}></Content>
		);
	}
}

DataEdit.propTypes = {
	classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(DataEdit));
