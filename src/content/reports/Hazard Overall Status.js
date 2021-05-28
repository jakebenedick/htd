import React from 'react';
import AxiosHooks from 'axios-hooks';
import MaterialTable from 'material-table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function HazardStatus(props) {
	const { program } = props;
	const today = new Date();
	const todayDate =
		today.getDate() +
		'-' +
		today.toLocaleString('default', { month: 'long' }).substring(0, 3) +
		'-' +
		today.getFullYear();

	const title = `ERAM ${program} HAZARD OVERALL STATUS REPORT`;

	const [{ data }] = AxiosHooks(
		`http://localhost:4000/hazard/program/${program}`
	);

	const headers = [
		[
			'Hazard ID',
			'Hazard Description',
			'Hazard Likelihood',
			'Hazard Severity',
			'Hazard Risk',
			'Hazard Supporting Document',
		],
	];

	const exportToPDF = (data) => {
		const unit = 'pt';
		const size = 'A4'; // Use A1, A2, A3 or A4
		const orientation = 'landscape'; // portrait or landscape

		const marginLeft = 40;
		const doc = new jsPDF(orientation, unit, size);

		doc.setFontSize(15);
		doc.setTextColor('black');

		const dataForExport = data.map((entry) => [
			entry.hazard_id,
			entry.hazard_description,
			entry.hazard_likelihood,
			entry.hazard_severity,
			entry.hazard_risk,
			entry.hazard_supporting_document,
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

		doc.text(title, marginLeft, 40, {
			align: 'left',
		});
		doc.autoTable(content);
		addFooters(doc);
		doc.save(`${title}.pdf`);
	};

	return (
		<MaterialTable
			columns={[
				{
					title: 'Hazard ID',
					field: 'hazard_id',
					cellStyle: {
						width: '10%',
						maxWidth: '10%',
					},
					headerStyle: {
						width: '10%',
						maxWidth: '10%',
					},
				},
				{
					title: 'Hazard Description',
					field: 'hazard_description',
					cellStyle: {
						width: '50%',
						maxWidth: '50%',
					},
					headerStyle: {
						width: '50%',
						maxWidth: '50%',
					},
				},
				{
					title: 'Hazard Likelihood',
					field: 'hazard_likelihood',
					cellStyle: {
						width: '10%',
						maxWidth: '10%',
					},
					headerStyle: {
						width: '10%',
						maxWidth: '10%',
					},
				},
				{
					title: 'Hazard Severity',
					field: 'hazard_severity',
					cellStyle: {
						width: '10%',
						maxWidth: '10%',
					},
					headerStyle: {
						width: '10%',
						maxWidth: '10%',
					},
				},
				{
					title: 'Hazard Risk',
					field: 'hazard_risk',
					cellStyle: {
						width: '10%',
						maxWidth: '10%',
					},
					headerStyle: {
						width: '10%',
						maxWidth: '10%',
					},
				},
				{
					title: 'Hazard Supporting Document',
					field: 'hazard_supporting_document',
					cellStyle: {
						width: '10%',
						maxWidth: '10%',
					},
					headerStyle: {
						width: '10%',
						maxWidth: '10%',
					},
				},
			]}
			data={data}
			title={title}
			options={{
				exportButton: true,
				exportPdf: () => {
					exportToPDF(data);
				},
				exportAllData: true,
				search: false,
			}}></MaterialTable>
	);
}

export default HazardStatus;
