import {
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	ToggleButton,
	ToggleButtonGroup,
	ThemeProvider,
	IconButton,
} from "@mui/material";
import {
	MoreVertRounded,
	CheckRounded,
	CancelRounded,
} from "@mui/icons-material";
import toggleTheme from "../../../../components/toggleTheme";
import React from "react";
import PropTypes from "prop-types";

StatementTable.propTypes = {
	data: PropTypes.any,
	setValue: PropTypes.func,
	open: PropTypes.bool,
	handleContext: PropTypes.func,
};

function StatementTable(props) {
	const data = props.data;

	// Заголовок колонки таблицы с допуском
	const accessHeader = () => {
		if (data.students.length) {
			if (data.students[0].access !== undefined) {
				return <TableCell sx={{ width: "100%" }}>Допуск</TableCell>;
			}
		}
		return <></>;
	};

	/**
	 * Ячейка таблицы со значением допуска
	 * @param {*} student - студент
	 * @returns контрол со значением допуска
	 */
	const accessVal = (student) => {
		if (student.access !== undefined) {
			let control = <></>;

			if (student.access) {
				control = (
					<>
						<CheckRounded
							className="screen"
							sx={{ color: "#939393" }}
						/>
						<span className="print">да</span>
					</>
				);
			} else {
				control = (
					<>
						<div className="screen">
							<div
								style={{
									display: "flex",
									alignItems: "center",
									color: "red",
								}}
							>
								<CancelRounded sx={{ marginRight: "10px" }} />{" "}
								Нет допуска
							</div>
						</div>
						<div className="print">Нет допуска</div>
					</>
				);
			}

			return <TableCell>{control}</TableCell>;
		}

		return <></>;
	};

	/**
	 * Контрол оценки
	 * @param {*} value - оценка
	 * @param {*} index - индекс студента
	 * @returns Контрол с оценкой
	 */
	const getValue = (value, index) => {
		if (typeof value === "number") {
			return (
				<ThemeProvider theme={toggleTheme}>
					<ToggleButtonGroup
						className="screen"
						exclusive
						value={value}
						onChange={props.setValue}
					>
						<ToggleButton
							data-student={index}
							selected={value === 5}
							value={5}
						>
							5
						</ToggleButton>
						<ToggleButton
							data-student={index}
							selected={value === 4}
							value={4}
						>
							4
						</ToggleButton>
						<ToggleButton
							data-student={index}
							selected={value === 3}
							value={3}
						>
							3
						</ToggleButton>
						<ToggleButton
							data-student={index}
							selected={value === 2}
							value={2}
						>
							2
						</ToggleButton>
						<ToggleButton
							data-student={index}
							selected={value === -1}
							value={-1}
						>
							Неявка
						</ToggleButton>
					</ToggleButtonGroup>
					<span className="print">
						{value < 0 ? "Неявка" : value}
					</span>
				</ThemeProvider>
			);
		}
		return (
			<ThemeProvider theme={toggleTheme}>
				<ToggleButtonGroup
					exclusive
					onChange={props.setValue}
					className="screen"
				>
					<ToggleButton
						size="small"
						data-student={index}
						selected={value === "Зачёт"}
						value="Зачёт"
					>
						Зачёт
					</ToggleButton>
					<ToggleButton
						size="small"
						data-student={index}
						selected={value === "Незачёт"}
						value="Незачёт"
					>
						Незачёт
					</ToggleButton>
					<ToggleButton
						size="small"
						data-student={index}
						selected={value === "Неявка"}
						value="Неявка"
					>
						Неявка
					</ToggleButton>
				</ToggleButtonGroup>
				<span className="print">{value}</span>
			</ThemeProvider>
		);
	};

	return (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow>
						<TableCell>№</TableCell>
						<TableCell sx={{ width: "70%" }}>ФИО</TableCell>
						{accessHeader()}
						<TableCell sx={{ width: "220px" }}>Оценка</TableCell>
						<TableCell
							className="screen"
							sx={{ textAlign: "right" }}
						>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.students.map((student, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{student.name}</TableCell>
							{accessVal(student)}
							<TableCell>
								{getValue(student.value, index)}
							</TableCell>
							<TableCell
								className="screen"
								sx={{
									textAlign: "right",
								}}
							>
								<IconButton
									aria-controls={
										props.open ? "student-menu" : undefined
									}
									aria-haspopup={true}
									aria-expanded={
										props.open ? "true" : undefined
									}
									onClick={props.handleContext}
								>
									<MoreVertRounded />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default StatementTable;
