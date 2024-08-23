import { Card, CardContent } from "@mui/material";
import "./styles.scss";
import MainTable from "../main-table";
import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

StatementEntry.propTypes = {
	type: PropTypes.string,
	data: PropTypes.array,
	statementType: PropTypes.number,
};

function StatementEntry(props) {
	const { type } = useParams();

	const cardContent = (el, index) => {
		const header = type !== "practice" ? el.disciplineName : el.courseName;
		const subHeader = type !== "practice" ? el.chairName : el.practiceType;

		return (
			<Card key={index}>
				<CardContent>
					<h2>
						<span className="code">{header}</span>
					</h2>
					<p>{subHeader}</p>
					<MainTable
						groups={el.details}
						statementId={el.controlTypeId}
						statementType={props.statementType}
					/>
				</CardContent>
			</Card>
		);
	};

	// DOM
	if (props.data.length) {
		return (
			<>
				{props.data.map((el, index) => {
					if (el.details.length) {
						return cardContent(el, index);
					}

					return (
						<Card key={index}>
							<CardContent>Нет данных</CardContent>
						</Card>
					);
				})}
			</>
		);
	}

	return (
		<Card>
			<CardContent>Нет данных</CardContent>
		</Card>
	);
}

export default StatementEntry;
