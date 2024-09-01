import React from "react";
import { IconButton, Button } from "@mui/material";
import { MoreVertRounded } from "@mui/icons-material";
import PropTypes from "prop-types";

ActionControl.propTypes = {
	item: PropTypes.object,
	groupIndex: PropTypes.number,
	itemIndex: PropTypes.number,
	facultyIndex: PropTypes.number,
	handleClick: PropTypes.func,
	handleCreate: PropTypes.func,
};

function ActionControl(props) {
	if (
		props.item.checksStartDate !== null &&
		props.item.examsStartDate !== null &&
		props.item.holidayStartDate !== null
	) {
		return (
			<>
				<IconButton
					onClick={props.handleClick}
					data-item={props.itemIndex}
					data-group={props.groupIndex}
					data-faculty={props.facultyIndex}
				>
					<MoreVertRounded />
				</IconButton>
			</>
		);
	}
	return (
		<Button
			variant="text"
			onClick={props.handleCreate}
			data-course={props.item.courseNumber}
		>
			Создать сессию
		</Button>
	);
}

export default ActionControl;
