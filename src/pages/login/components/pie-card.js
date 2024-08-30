import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import "./pie-card.scss";

PieCard.propTypes = {
	value: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	series: PropTypes.arrayOf(PropTypes.object).isRequired,
	onItemClick: PropTypes.func.isRequired,
};

function PieCard(props) {
	return (
		<Card sx={{ minHeight: "100%" }}>
			<CardContent>
				<div
					className="pie-content"
					style={{ display: "flex", alignContent: "center" }}
				>
					<div className="chart-wrapper">
						<div className="chart-label">{props.value}</div>
						<PieChart
							onItemClick={props.onItemClick}
							colors={[
								"#00BFA5",
								"#3278FF",
								"#B132FA",
								"#BF0086",
								"#FFC700",
							]}
							sx={{
								"& path": {
									strokeWidth: 0,
								},
								mixBlendMode: "multiply",
							}}
							series={[
								{
									cx: 50,
									cy: 50,
									outerRadius: 55,
									data: props.series,
								},
							]}
							width={110}
							height={110}
						/>
					</div>
					<div className="label-wrapper">{props.title}</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default PieCard;
