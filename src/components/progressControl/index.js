import styled from "@emotion/styled";
import { QueryBuilderRounded, GradeOutlined } from "@mui/icons-material";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import "./styles.scss";
import React from "react";

const BorderLinearProgress = styled(LinearProgress)(() => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: "#00000011",
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: "#BBDEFB",
	},
}));

const FullBorderLinearProgress = styled(LinearProgress)(() => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: "#F2F2F2",
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: "#00FFA5",
	},
}));

const progressControl = (current, total, iconType = "clock") => {
	let percent = null;
	let control = null;
	let icon = null;

	if (iconType === "clock") {
		icon = <QueryBuilderRounded className="screen" />;
	} else {
		icon = <GradeOutlined className="screen" />;
	}

	if (!current || !total) {
		return <>—</>;
	} else {
		percent = Math.round((current / total) * 100);

		if (percent < 100) {
			control = (
				<BorderLinearProgress
					className="screen"
					variant="determinate"
					value={percent}
				/>
			);
		} else {
			control = (
				<FullBorderLinearProgress
					className="screen"
					variant="determinate"
					value={percent}
				/>
			);
		}
		return (
			<div className="progress-wrapper">
				<div className="progressbar-wrapper">{control}</div>
				<div className="icon-block">
					{icon}
					<div>
						{Math.round(current)}/{Math.round(total)}
					</div>
				</div>
			</div>
		);
	}
};

export default progressControl;
