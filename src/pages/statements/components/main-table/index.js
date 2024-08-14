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

function MainTable(props) {
	const navigate = useNavigate();

	// Действия
	const actions = (row) => {
		switch (row.indicator) {
			case "opened":
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
			case "closed":
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
			case "outdated":
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
			let url = e.currentTarget.dataset["url"];
			navigate(url);
		}
	};

	// Индикатор
	const indicator = (row) => {
		switch (row.indicator) {
			case "opened":
				return (
					<CircleRounded
						sx={{
							color: "#00BFA5",
						}}
					/>
				);
			case "closed":
				return (
					<LockRounded
						sx={{
							color: "#939393",
						}}
					/>
				);
			case "outdated":
				return (
					<CircleRounded
						sx={{
							color: "#FF1744",
						}}
					/>
				);
			default:
				return <></>;
		}
	};

	// Статус ведомости
	const statusControl = (row) => {
		switch (row.indicator) {
			case "opened":
				return progressControl(row.status.current, row.status.total);
			case "closed":
				return <>Закрыта {row.status.closeDate}</>;
			case "outdated":
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
				return <></>;
		}
	};

	return (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow>
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
								data-url={row.statementUrl}
								onClick={openStatement}
								key={index}
								hover
							>
								<TableCell>{indicator(row)}</TableCell>
								<TableCell>{row.group}</TableCell>
								<TableCell>{row.date}</TableCell>
								<TableCell>{statusControl(row)}</TableCell>
								<TableCell>{row.type}</TableCell>
								<TableCell>{row.statementNum}</TableCell>
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
