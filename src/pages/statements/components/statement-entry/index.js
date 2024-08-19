import { Card, CardContent } from "@mui/material";
import "./styles.scss";
import MainTable from "../main-table";
import PracticeTable from "../practice-table";
import React from "react";
import PropTypes from "prop-types";

StatementEntry.propTypes = {
	type: PropTypes.string,
	data: PropTypes.array,
	statementType: PropTypes.number,
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
			<MainTable
				groups={data}
				statementId={statementId}
				statementType={props.statementType}
			/>
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
											el.controlTypeId,
										)}
									</CardContent>
								</Card>
							);
						}
						return <></>;
					})}
				</>
			);
			const show = Math.max(props.data.map((e) => e.details.length));
			if (show === 0) {
				control = (
					<Card>
						<CardContent>Нет данных</CardContent>
					</Card>
				);
			}
		}
	}

	return control;
}

export default StatementEntry;
