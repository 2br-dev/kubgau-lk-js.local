import {
	EditRounded,
	LockOpenRounded,
	LockRounded,
	PrintRounded,
} from "@mui/icons-material";
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Tooltip,
	IconButton,
	TableContainer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

PracticeTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
};

function PracticeTable(props) {
	const navigate = useNavigate();

	const indicator = (row) => {
		return row.closingDate === null ? <LockOpenRounded /> : <LockRounded />;
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

	const openStatement = (e) => {
		const path = Array.from(e.nativeEvent.composedPath()).filter(
			(item) => item.tagName === "BUTTON",
		);

		const url = "/main/practice-statement";

		if (!path.length) {
			navigate(url);
		}
	};

	const actions = (val) => {
		return val === "close" ? (
			<Tooltip title="Печать" placement="top">
				<IconButton>
					<PrintRounded />
				</IconButton>
			</Tooltip>
		) : (
			<>
				<Tooltip title="Редактировать" placement="top">
					<IconButton>
						<EditRounded />
					</IconButton>
				</Tooltip>
				<Tooltip title="Справочная ведомость" placement="top">
					<IconButton>
						<PrintRounded />
					</IconButton>
				</Tooltip>
			</>
		);
	};

	const groups = props.data ? props.data : [];

	return (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow>
						<TableCell colSpan={2}>Номер ведомости</TableCell>
						<TableCell>Вид сдачи</TableCell>
						<TableCell sx={{ textAlign: "right" }}>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{groups.map((group, index) => (
						<TableRow
							key={index}
							sx={{ cursor: "pointer" }}
							hover
							onClick={openStatement}
						>
							<TableCell sx={{ width: "50px" }}>
								{indicator(group)}
							</TableCell>
							<TableCell
								sx={{ whiteSpace: "nowrap", width: "30%" }}
							>
								{group.statementNumber || "Не указано"}
							</TableCell>
							<TableCell>{type(group.statementType)}</TableCell>
							<TableCell
								sx={{
									textAlign: "right",
									whiteSpace: "nowrap",
								}}
							>
								{actions(group.indicator)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default PracticeTable;
