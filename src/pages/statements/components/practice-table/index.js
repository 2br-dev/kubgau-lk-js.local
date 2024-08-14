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

function PracticeTable(props) {
	const navigate = useNavigate();

	const indicator = (val) => {
		return val === "open" ? <LockOpenRounded /> : <LockRounded />;
	};

	const openStatement = (e) => {
		const el = e.currentTarget;
		const path = Array.from(e.nativeEvent.composedPath()).filter(
			(item) => item.tagName === "BUTTON"
		);
		const url = el.dataset["url"];

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
					{props.groups.map((group, index) => (
						<TableRow
							key={index}
							sx={{ cursor: "pointer" }}
							hover
							onClick={openStatement}
							data-url={group.statementUrl}
						>
							<TableCell sx={{ width: "50px" }}>
								{indicator(group.indicator)}
							</TableCell>
							<TableCell sx={{ whiteSpace: "nowrap" }}>
								{group.statementNum}
							</TableCell>
							<TableCell>{group.type}</TableCell>
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
