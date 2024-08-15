import { Card, CardContent } from "@mui/material";
import "./styles.scss";
import MainTable from "../main-table";
import PracticeTable from "../practice-table";
import React from "react";
import PropTypes from "prop-types";

StatementEntry.propTypes = {
	type: PropTypes.string,
	data: PropTypes.array,
};

function StatementEntry(props) {
	// Контрол по умолчанию
	let control = (
		<Card>
			<CardContent>Нет данных</CardContent>
		</Card>
	);

	const outputTable = (data, statementId) => {
		return props.type === "common" ? (
			<MainTable groups={data} statementId={statementId} />
		) : (
			<PracticeTable groups={data} />
		);
	};

	// DOM

	if (props) {
		if (props.data !== null) {
			control = (
				<>
					{props.data.map((el, index) => {
						if (el.details.length) {
							return (
								<Card key={index}>
									<CardContent>
										<h2>
											<span className="code">
												{el.disciplineName}
											</span>
										</h2>
										<p>{el.chairName}</p>
										{outputTable(
											el.details,
											el.controlTypeId
										)}
									</CardContent>
								</Card>
							);
						}
					})}
				</>
			);
		}
	}

	return control;
}

export default StatementEntry;
