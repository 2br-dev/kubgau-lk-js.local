import {
	Tooltip,
	Button,
	IconButton,
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@mui/material";
import {
	EditRounded,
	ReceiptLongRounded,
	PrintRounded,
	CircleRounded,
	LockRounded,
} from "@mui/icons-material";
import progressControl from "../../../../components/progressControl";
import { useNavigate } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

MainTable.propTypes = {
	groups: PropTypes.arrayOf(PropTypes.object),
	statementId: PropTypes.number,
	statementType: PropTypes.number,
};

function MainTable(props) {
	const navigate = useNavigate();

	// Действия
	const actions = (row) => {
		switch (true) {
			case row.closingDate === null:
				return (
					<span className="actions-wrapper">
						<Tooltip
							placement="top"
							title="Редактировать ведомость"
						>
							<IconButton aria-label="Редактировать ведомость">
								<EditRounded />
							</IconButton>
						</Tooltip>
						<Tooltip
							placement="top"
							title="Печать справочной ведомости"
						>
							<IconButton aria-label="Печать справочной ведомости">
								<ReceiptLongRounded />
							</IconButton>
						</Tooltip>
					</span>
				);
			case row.closingDate !== null:
				return (
					<span className="actions-wrapper">
						<Tooltip
							placement="top"
							title="Печать справочной ведомости"
						>
							<IconButton aria-label="Печать справочной ведомости">
								<ReceiptLongRounded />
							</IconButton>
						</Tooltip>
						<Tooltip placement="top" title="Печать ведомости">
							<IconButton aria-label="Печать ведомости">
								<PrintRounded />
							</IconButton>
						</Tooltip>
					</span>
				);
			case row.closingDate === null &&
				row.grades.current === row.grades.total:
				return (
					<span className="actions-wrapper">
						<Tooltip
							placement="top"
							title="Редактировать ведомость"
						>
							<IconButton aria-label="Редактировать ведомость">
								<EditRounded />
							</IconButton>
						</Tooltip>
						<Tooltip
							placement="top"
							title="Печать справочной ведомости"
						>
							<IconButton aria-label="Печать справочной ведомости">
								<ReceiptLongRounded />
							</IconButton>
						</Tooltip>
					</span>
				);
			default:
				return <></>;
		}
	};

	// Открытие ведомости
	const openStatement = (e) => {
		let path = Array.from(e.nativeEvent.composedPath());
		let buttons = path.filter((el) => {
			return el.tagName === "BUTTON";
		});
		if (!buttons.length) {
			let url = `/main/statement/${props.statementType}`;
			navigate(url);
		}
	};

	// Индикатор
	const indicator = (row) => {
		switch (true) {
			case row.closingDate === null &&
				row.grades.current !== row.grades.total:
				return (
					<Tooltip title="Ведомость открыта" placement="top">
						<CircleRounded
							sx={{
								color: "#00BFA5",
							}}
						/>
					</Tooltip>
				);
			case row.closingDate !== null:
				return (
					<Tooltip title="Ведомость закрыта" placement="top">
						<LockRounded
							sx={{
								color: "#939393",
							}}
						/>
					</Tooltip>
				);
			case row.closingDate === null &&
				row.grades.current === row.grades.total:
				return (
					<Tooltip title="Ведомость просрочена" placement="top">
						<CircleRounded
							sx={{
								color: "#FF1744",
							}}
						/>
					</Tooltip>
				);
			default:
				return <></>;
		}
	};

	// Тип сдачи
	const type = (typeNum) => {
		const types = [
			"Основная",
			"Дополнительная",
			"Комиссионная",
			"Внеплановая",
		];
		if (!typeNum) typeNum = 0;
		return types[typeNum];
	};

	// Статус ведомости
	const statusControl = (row) => {
		switch (true) {
			case row.closingDate !== null:
				return <>Закрыта {dateString(row.closingDate)}</>;
			case row.grades.current === row.grades.total &&
				row.closingDate === null:
				return (
					<Button
						variant="contained"
						sx={{
							boxShadow: "none",
						}}
					>
						Закрыть
					</Button>
				);
			default:
				return progressControl(
					row.grades.current,
					row.grades.total,
					"grade",
				);
		}
	};

	// Перевод даты в строку
	const dateString = (date) => {
		return new Date(date).toLocaleDateString("ru-RU");
	};

	// DOM
	return (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow onClick={openStatement}>
						<TableCell sx={{ width: "26%" }} colSpan={2}>
							Группа/студент
						</TableCell>
						<TableCell sx={{ width: "15%" }}>
							Дата проведения
						</TableCell>
						<TableCell sx={{ width: "25%" }}>Статус</TableCell>
						<TableCell sx={{ width: "15%" }}>Тип сдачи</TableCell>
						<TableCell sx={{ width: "15%" }}>
							Номер ведомости
						</TableCell>
						<TableCell
							sx={{
								width: "15%",
								textAlign: "right",
							}}
						>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.groups.map((row, index) => {
						return (
							<TableRow
								sx={{
									cursor: "pointer",
								}}
								data-type={props.statementId}
								onClick={openStatement}
								key={index}
								hover
							>
								<TableCell>{indicator(row)}</TableCell>
								<TableCell>{row.groupName}</TableCell>
								<TableCell>
									{dateString(row.eventDate)}
								</TableCell>
								<TableCell>{statusControl(row)}</TableCell>
								<TableCell>{type(row.numberInOrder)}</TableCell>
								<TableCell>{row.statementName}</TableCell>
								<TableCell> {actions(row)} </TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default MainTable;
