import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const styles = (theme) => ({
	online: {
		backgroundColor: '#75ab00',
	},
	offline: {
		backgroundColor: 'lightgray',
	},
});

function SimpleBadge(props) {
	const { classes, content, size, online } = props;
	return (
		<div>
			<Badge
				variant={size === 'small' ? 'dot' : ''}
				overlap='circle'
				classes={{ badge: online ? classes.online : classes.offline }}
				className={classes.margin}
				badgeContent=' '
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}>
				{content}
			</Badge>
		</div>
	);
}

SimpleBadge.propTypes = {
	classes: PropTypes.object.isRequired,
	content: PropTypes.element.isRequired,
};

export default withStyles(styles)(SimpleBadge);
