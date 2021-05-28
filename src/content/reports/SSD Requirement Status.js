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

	const title = `ERAM ${program} SSD Safety Requirement Status`;

	const [{ data }] = AxiosHooks(
		`http://localhost:4000/ssd/program/${program}`
	);

	const headers = [
		['SSD ID', 'SSD Requirement Text', 'SSD Status', 'SSD Mapped SSS'],
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
			entry.ssd_id,
			entry.ssd_requirement_text,
			entry.ssd_status ? 'PA' : 'FA',
			entry.ssd_mapped_sss,
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

	/* const headersToColumns = (headers) => {
		var columns = [];
		var i;

		for (i = 0; i < headers.length; i++) {
			columns.push({
				title: headers[i],
				field: headers[i],
			});
		}

		return columns;
	}; */

	return (
		<MaterialTable
			columns={[
				{
					title: 'SSD ID',
					field: 'ssd_id',
					cellStyle: {
						width: '15%',
						maxWidth: '15%',
					},
					headerStyle: {
						width: '15%',
						maxWidth: '15%',
					},
				},
				{
					title: 'SSD Requirement Text',
					field: 'ssd_requirement_text',
					cellStyle: {
						width: '55%',
						maxWidth: '55%',
					},
					headerStyle: {
						width: '55%',
						maxWidth: '55%',
					},
				},
				{
					title: 'SSD Status Passed?',
					field: 'ssd_status',
					cellStyle: {
						width: '15%',
						maxWidth: '15%',
					},
					headerStyle: {
						width: '15%',
						maxWidth: '15%',
					},
				},
				{
					title: 'SSD Mapped SSS',
					field: 'ssd_mapped_sss',
					cellStyle: {
						width: '15%',
						maxWidth: '15%',
					},
					headerStyle: {
						width: '15%',
						maxWidth: '15%',
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
