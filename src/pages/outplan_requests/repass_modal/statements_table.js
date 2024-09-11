import React, { useState, useEffect, Fragment } from "react";
import {
	Grid,
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	Tabs,
	Tab,
	IconButton,
} from "@mui/material";
import { AddRounded } from "@mui/icons-material";
import PropTypes from "prop-types";

StatementsTable.propTypes = {
	onAddStatement: PropTypes.func,
	onLoad: PropTypes.func,
};

function StatementsTable(props) {
	const [tabVal, setTabVal] = useState(0);
	const [statements, setStatements] = useState([]);
	const [filteredStatements, setFilteredStatements] = useState([]);

	const handleTabChange = (e, newVal) => {
		let filtered = filterStatements(null, newVal);
		setFilteredStatements(filtered);
		setTabVal(newVal);
	};

	useEffect(() => {
		// Подгружаем доступные ведомости
		fetch("/data/resultsOfStudents.json")
			.then((res) => res.json())
			.then((response) => {
				setStatements(response.data);
				setFilteredStatements(filterStatements(response.data, 0));
				props.onLoad(response.data);
			});
		// eslint-disable-next-line
	}, []);

	const studentsShorts = (students) => {
		let studs = students.map((s) => {
			let arr = s.fullName.split(" ");
			return (
				arr[0] + " " + arr[1].charAt(0) + "." + arr[2].charAt(0) + "."
			);
		});
		return "…" + studs.join(", ") + "…";
	};

	const filterStatements = (s, t) => {
		let stat = s ? s : statements;
		let tab = t !== null ? t : tabVal;
		switch (tab) {
			case 12:
				return stat.filter(
					(st) => st.controlType === 1 || st.controlType === 2,
				);
			case 34:
				return stat.filter(
					(st) => st.controlType === 3 || st.controlType === 4,
				);
			default:
				return stat.filter((st) => st.controlType === 0);
		}
	};

	const statementsTable = () => {
		return (
			<TableBody>
				{filteredStatements.map((s, sindex) => (
					<Fragment key={sindex}>
						<TableRow>
							<TableCell colSpan={3} sx={{ paddingTop: "40px" }}>
								<strong
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									{s.disciplineName}
									<IconButton onClick={props.onAddStatement}>
										<AddRounded />
										{/* <DoNotDisturbAltRounded /> */}
									</IconButton>
								</strong>
							</TableCell>
						</TableRow>
						{s.statements.map((st, stindex) => {
							return (
								<TableRow key={stindex}>
									<TableCell>
										Ведомость №{st.statementNumber}
									</TableCell>
									<TableCell>
										{st.isClosed ? "Закрыта" : "Открыта"}
									</TableCell>
									<TableCell>
										{studentsShorts(st.students)}
									</TableCell>
								</TableRow>
							);
						})}
					</Fragment>
				))}
			</TableBody>
		);
	};

	return (
		<>
			<Grid item sm={12}>
				<Tabs value={tabVal} onChange={handleTabChange}>
					<Tab value={0} label="Экзамены" />
					<Tab value={12} label="Зачёты" />
					<Tab value={34} label="Курсовые" />
				</Tabs>
			</Grid>
			<Grid item sm={12}>
				<TableContainer sx={{ height: 300 }}>
					<Table className="simple-table" size="small">
						<TableHead>
							<TableRow>
								<TableCell>Номер ведомости</TableCell>
								<TableCell>Статус</TableCell>
								<TableCell>Студенты</TableCell>
							</TableRow>
						</TableHead>
						{statementsTable()}
					</Table>
				</TableContainer>
			</Grid>
		</>
	);
}

export default StatementsTable;
