import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import MenuIcon from '@material-ui/icons/Menu';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '50%',
		transform: 'translateZ(0px)',
		flexGrow: 1,
	},
	speedDial: {
		position: 'absolute',
		top: 0,
		left: 0,
		margin: '5px',
	},
}));

export default function OpenIconSpeedDial(props) {
	const classes = useStyles();
	const { hidden, actions } = props;
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<SpeedDial
				ariaLabel='SpeedDial'
				direction='down'
				hidden={hidden}
				className={classes.speedDial}
				icon={<MenuIcon />}
				FabProps={{ color: 'inherit' }}
				onClose={handleClose}
				onOpen={handleOpen}
				open={open}>
				{actions.map((action) => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.func}
					/>
				))}
			</SpeedDial>
		</div>
	);
}
