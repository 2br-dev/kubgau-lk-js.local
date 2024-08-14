import { Card, CardContent } from "@mui/material";
import "./styles.scss";
import MainTable from "../main-table";
import PracticeTable from "../practice-table";

function StatementEntry(props) {
	// Контрол по умолчанию
	let control = (
		<Card>
			<CardContent>Нет данных</CardContent>
		</Card>
	);

	const outputTable = (data) => {
		return props.type === "common" ? (
			<MainTable groups={data} />
		) : (
			<PracticeTable groups={data} />
		);
	};

	// DOM
	if (props.data !== null) {
		control = (
			<>
				{props.data.map((el, index) => {
					return (
						<Card key={index}>
							<CardContent>
								<h2>
									{el.name}{" "}
									<span className="code">{el.code}</span>
								</h2>
								{outputTable(el.groups)}
							</CardContent>
						</Card>
					);
				})}
			</>
		);
	}

	return control;
}

export default StatementEntry;
