import {
	Card,
	CardContent,
	Table,
	TableCell,
	TableRow,
	TableHead,
	TableBody,
	Button,
	IconButton,
	Tooltip,
	TableContainer,
} from "@mui/material";
import {
	CircleRounded,
	EditRounded,
	LockRounded,
	PrintRounded,
	ReceiptLongRounded,
} from "@mui/icons-material";
import progressControl from "../../../../components/progressControl";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

function StatementEntry(props) {
	const navigate = useNavigate();

	let control = (
		<Card>
			<CardContent>Нет данных</CardContent>
		</Card>
	);

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
								<TableContainer>
									<Table className="simple-table">
										<TableHead>
											<TableRow>
												<TableCell
													sx={{ width: "26%" }}
													colSpan={2}
												>
													Группа/студент
												</TableCell>
												<TableCell
													sx={{ width: "15%" }}
												>
													Дата проведения
												</TableCell>
												<TableCell
													sx={{ width: "25%" }}
												>
													Статус
												</TableCell>
												<TableCell
													sx={{ width: "15%" }}
												>
													Тип сдачи
												</TableCell>
												<TableCell
													sx={{ width: "15%" }}
												>
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
											{el.groups.map((row, index) => {
												// Индикатор ведомости
												let indicator = null;

												// Ячейка статуса
												let statusControl = null;

												// Действия
												let actions = null;

												switch (row.indicator) {
													// Ведомость открыта
													case "opened":
														indicator = (
															<CircleRounded
																sx={{
																	color: "#00BFA5",
																}}
															/>
														);
														statusControl =
															progressControl(
																row.status
																	.current,
																row.status.total
															);
														actions = (
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
														break;
													// Ведомость закрыта
													case "closed":
														indicator = (
															<LockRounded
																sx={{
																	color: "#939393",
																}}
															/>
														);
														statusControl = (
															<>
																Закрыта{" "}
																{
																	row.status
																		.closeDate
																}
															</>
														);
														actions = (
															<span className="actions-wrapper">
																<Tooltip
																	placement="top"
																	title="Печать справочной ведомости"
																>
																	<IconButton aria-label="Печать справочной ведомости">
																		<ReceiptLongRounded />
																	</IconButton>
																</Tooltip>
																<Tooltip
																	placement="top"
																	title="Печать ведомости"
																>
																	<IconButton aria-label="Печать ведомости">
																		<PrintRounded />
																	</IconButton>
																</Tooltip>
															</span>
														);
														break;
													// Ведомость просрочена
													case "outdated":
														indicator = (
															<CircleRounded
																sx={{
																	color: "#FF1744",
																}}
															/>
														);
														statusControl = (
															<Button
																variant="contained"
																sx={{
																	boxShadow:
																		"none",
																}}
															>
																Закрыть
															</Button>
														);
														actions = (
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
														break;
													// По умолчанию
													default:
														indicator = <></>;
														break;
												}

												return (
													<TableRow
														sx={{
															cursor: "pointer",
														}}
														data-url={
															row.statementUrl
														}
														onClick={openStatement}
														key={index}
														hover
													>
														<TableCell>
															{indicator}
														</TableCell>
														<TableCell>
															{row.group}
														</TableCell>
														<TableCell>
															{row.date}
														</TableCell>
														<TableCell>
															{statusControl}
														</TableCell>
														<TableCell>
															{row.type}
														</TableCell>
														<TableCell>
															{row.statementNum}
														</TableCell>
														<TableCell>
															{" "}
															{actions}{" "}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</TableContainer>
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
