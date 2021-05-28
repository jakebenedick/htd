import React from 'react';
import PropTypes from 'prop-types';
import HazardStatusReport from './Hazard Overall Status';
import Content from '../../layout/Content';
import HazardMediumRiskReport from './Hazard Medium Risk';
import HazardProceduralControlReport from './Hazard Procedural Control';
import HazardNonVerifiedReport from './Hazard Non-Verified';
import SSDRequirementStatusReport from './SSD Requirement Status';
import SSSRequirementStatusReport from './SSS Requirement Status';

function HazardSearch(props) {
	const { selectedTab } = props;
	const [program, setProgram] = React.useState('ABRR');
	const [selectedReport, setSelectedReport] = React.useState(0);
	const programList = ['ABRR', 'ADSB', 'DATACOM', 'GIMS', 'SWIM'];
	const [count, setCount] = React.useState(0);
	const hazardReportList = ['Hazard Status', 'Medium Risk'];
	const sssReportList = ['SSS Requirement Status'];
	const ssdReportList = ['SSD Requirement Status'];

	const handleCallback = (childData) => {
		if (typeof childData !== 'undefined' && childData != null) {
			console.log(childData);
			setSelectedReport(childData);
		} else setSelectedReport(0);
	};

	// const onSubmit = () => {};

	const forwardCallback = () => {
		setProgram(programList[(count + 1) % programList.length]);
		setCount(count + 1);
	};

	const backCallback = () => {
		setProgram(programList[(count + 4) % programList.length]);
		setCount(count + 4);
	};

	const handleTabType = (type) => {
		if (type === 'Hazard') {
			return hazardReportList;
		} else if (type === 'SSS') {
			return sssReportList;
		} else {
			return ssdReportList;
		}
	};

	const handleReportType = (type, report) => {
		if (type === 'Hazard') {
			switch (report) {
				case 'Hazard Status':
					return (
						<HazardStatusReport
							program={program}></HazardStatusReport>
					);
				case 'Medium Risk':
					return (
						<HazardMediumRiskReport
							program={program}></HazardMediumRiskReport>
					);
				case 'Procedural Control':
					return (
						<HazardProceduralControlReport
							program={program}></HazardProceduralControlReport>
					);
				case 'Non-Verified':
					return (
						<HazardNonVerifiedReport
							program={program}></HazardNonVerifiedReport>
					);
				default:
					return (
						<HazardStatusReport
							program={program}></HazardStatusReport>
					);
			}
		} else if (type === 'SSD') {
			switch (count) {
				case 0:
					return (
						<SSDRequirementStatusReport
							program={program}></SSDRequirementStatusReport>
					);
				case 1:
					return (
						<HazardMediumRiskReport
							program={program}></HazardMediumRiskReport>
					);
				case 2:
					return (
						<HazardProceduralControlReport
							program={program}></HazardProceduralControlReport>
					);
				case 3:
					return (
						<HazardNonVerifiedReport
							program={program}></HazardNonVerifiedReport>
					);
				default:
					return (
						<HazardStatusReport
							program={program}></HazardStatusReport>
					);
			}
		} else {
			switch (count) {
				case 0:
					return (
						<SSSRequirementStatusReport
							program={program}></SSSRequirementStatusReport>
					);
				case 1:
					return (
						<HazardMediumRiskReport
							program={program}></HazardMediumRiskReport>
					);
				case 2:
					return (
						<HazardProceduralControlReport
							program={program}></HazardProceduralControlReport>
					);
				case 3:
					return (
						<HazardNonVerifiedReport
							program={program}></HazardNonVerifiedReport>
					);
				default:
					return (
						<HazardStatusReport
							program={program}></HazardStatusReport>
					);
			}
		}
	};

	return (
		<Content
			tabs={handleTabType(selectedTab)}
			parentCallback={handleCallback}
			hideButton={true}
			showForward={true}
			showBack={true}
			forwardCallback={forwardCallback}
			backCallback={backCallback}
			content={handleReportType(selectedTab, selectedReport)}></Content>
	);
}

HazardSearch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default HazardSearch;
