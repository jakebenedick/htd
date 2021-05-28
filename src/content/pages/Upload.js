import React, { Fragment, useEffect } from 'react';
//import PropTypes from 'prop-types';
import ContentPage from '../../layout/Content';
import { DropzoneArea } from 'material-ui-dropzone';
import { createStyles, makeStyles } from '@material-ui/core/styles';

function Upload(props) {
	const [files, setFiles] = React.useState([]);
	const tabs = ['CSV', 'JSON', 'DOCX'];
	const [uploadType, setUploadType] = React.useState(tabs[0]);

	useEffect(() => {
		console.log(files);
	}, [files]);

	const useStyles = makeStyles((theme) =>
		createStyles({
			previewChip: {
				minWidth: 160,
				maxWidth: 210,
			},
		})
	);

	const handleCallback = (childData) => {
		if (typeof childData !== 'undefined' && childData != null) {
			//console.log(childData);
			setUploadType(childData);
		} else setUploadType(tabs[0]);
	};

	const classes = useStyles();

	return (
		<ContentPage
			tabs={tabs}
			buttonText={'Upload'}
			parentCallback={handleCallback}
			content={
				<Fragment>
					<DropzoneArea
						filesLimit={1}
						acceptedFiles={[`.${uploadType.toLowerCase()}`]}
						showPreviews={true}
						showPreviewsInDropzone={false}
						useChipsForPreview={true}
						disableRejectionFeedback={true}
						previewGridProps={{
							container: { spacing: 1, direction: 'row' },
						}}
						previewChipProps={{
							classes: { root: classes.previewChip },
						}}
						previewText='Uploaded files.'
						dropzoneText={`Drag and drop a ${uploadType} file containing ${props.dataType} data to add it to the Hazard Tracking Application.`}
						onChange={(loadedFiles) => setFiles(loadedFiles)}
					/>
				</Fragment>
			}></ContentPage>
	);
}

Upload.propTypes = {};

export default Upload;
