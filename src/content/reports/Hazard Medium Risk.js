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

	const title = `ERAM ${program} MEDIUM RISK HAZARD REPORT`;

	const [{ data }] = AxiosHooks(
		`http://localhost:4000/hazard/mediumRisk/${program}`
	);

	const headers = [['Hazard ID', 'Hazard Risk', 'Hazard Overall Status']];

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
			entry.hazard_risk,
			entry.hazard_status,
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
				{ title: 'Hazard ID', field: 'hazard_id' },
				{ title: 'Hazard Risk', field: 'hazard_risk' },
				{ title: 'Hazard Overall Status', field: 'hazard_status' },
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
