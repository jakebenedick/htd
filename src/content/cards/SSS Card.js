import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
	root: {
		//width: '47.5%',
		//float: 'left',
		margin: '1.25%',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export default function SSSCard(props) {
	const classes = useStyles();
	const { dataObj, id, selectCallback, unselectCallback } = props;
	const [showMore, setShowMore] = React.useState(false);
	const bull = <span className={classes.bullet}>•</span>;
	const [isSelected, setIsSelected] = React.useState(false);

	const onClickSSSCard = (entry, isSelected) => {
		if (isSelected) {
			var x = document.getElementById(entry.sss_id);
			x.style.backgroundColor = 'white';

			/* var result = selectedSSDList.filter(
				(ssd) => ssd.ssd_id !== entry.ssd_id
			); */
			//console.log(entry);
			unselectCallback(entry);
			//setSelectedSSD(result);
			setIsSelected(!isSelected);
		} else {
			var y = document.getElementById(entry.sss_id);
			y.style.backgroundColor = 'rgba(133, 15, 136, 0.5)';

			//setSelectedSSD([...selectedSSD, entry]);
			selectCallback(entry);

			//console.log(entry);
			setIsSelected(!isSelected);
		}
	};

	return (
		<Card
			className={classes.root}
			id={id}
			onClick={() => onClickSSSCard(dataObj, isSelected)}>
			<CardContent>
				<Typography
					className={classes.title}
					color='textSecondary'
					gutterBottom>
					{'SSS'}
				</Typography>

				<Typography variant='h5' component='h2'>
					{dataObj.sss_id}
				</Typography>

				{showMore ? (
					<div>
						<Typography variant='body2' component='p'>
							{dataObj.sss_requirement_text}
						</Typography>
						<br></br>
						<Typography variant='body2' component='p'>
							{bull}SSS Program: {dataObj.sss_program}
						</Typography>
						<br></br>
						<Typography variant='body2' component='p'>
							{bull}SSS Failing List: {dataObj.sss_failing_list}
						</Typography>
						<br></br>
						<Typography variant='body2' component='p'>
							{bull}SSS Status:{' '}
							{dataObj.sss_status ? 'Passed' : 'Not Passed'}
						</Typography>
						<br></br>
						<Typography variant='body2' component='p'>
							{bull}SSS Mapped SSD: {dataObj.sss_mapped_ssd}
						</Typography>
					</div>
				) : (
					''
				)}
			</CardContent>
			<CardActions>
				<Button size='small' onClick={() => setShowMore(!showMore)}>
					{showMore ? 'Close info panel' : 'Open for more info'}
				</Button>
			</CardActions>
		</Card>
	);
}
SSSCard.propTypes = {
	dataObj: PropTypes.object.isRequired,
};
