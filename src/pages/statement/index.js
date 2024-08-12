import {
	Button,
	Card,
	CardContent,
	Grid,
	Link,
	Table,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
	ThemeProvider,
	Menu,
	Tooltip,
	MenuItem,
	Snackbar,
} from "@mui/material";
import PageHeader from "../../components/pageHeader";
import KVPair from "../../components/kv_pair";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	CancelRounded,
	CheckRounded,
	CloudUploadOutlined,
	PrintRounded,
	SaveRounded,
	ClearRounded,
	DeleteOutlined,
	DownloadOutlined,
	EditOutlined,
	MoreVertRounded,
} from "@mui/icons-material";
import toggleTheme from "../../components/toggleTheme/";
import "./index.scss";

/**
 * Ведомости
 */
function Statement() {
	// Инициализация
	const { type } = useParams(); // Тип ведомости, указанный в URL, сюда же по хорошему нужно передать ID ведомости

	const [data, setData] = useState({
		group: null,
		number: null,
		type: null,
		subtype: null,
		state: null,
		access: null,
		unit: null,
		hours: null,
		doc: null,
		startDate: null,
		closeDate: null,
		deadline: null,
		examDate: null,
		students: [],
	});

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const menuItems = () => {
		if (type === "course") {
			return [
				<MenuItem disableRipple key={0}>
					<span className="context-item">
						<span className="context-title">Рецензия</span>
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
							{/* Показываем кнопку удалить, когда есть что удалять */}
							{/* <Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip> */}
						</span>
					</span>
				</MenuItem>,
				<MenuItem disableRipple key={1}>
					<span className="context-item">
						<span className="context-title">Работа</span>
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
			];
		} else {
			return [
				<MenuItem disableRipple key={1}>
					<span className="context-item">
						<span className="context-title">
							Аттестационный лист
						</span>
						{/* Если уже загружен, кнопки как у остальных */}
						<span className="context-actions">
							<Tooltip title="Загрузить" placement="top">
								<IconButton>
									<CloudUploadOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
				<MenuItem disableRipple key={2}>
					<span className="context-item">
						<span className="context-title">Отчёт</span>
						<span className="context-actions">
							<Tooltip title="Редактировать" placement="top">
								<IconButton>
									<EditOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Скачать" placement="top">
								<IconButton>
									<DownloadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
				<MenuItem key={3}>
					<span className="context-item">
						<span className="context-title">Документы</span>
						<span className="context-actions">
							<Tooltip title="Редактировать" placement="top">
								<IconButton>
									<EditOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Скачать" placement="top">
								<IconButton>
									<DownloadOutlined />
								</IconButton>
							</Tooltip>
							<Tooltip title="Удалить" placement="top">
								<IconButton>
									<DeleteOutlined />
								</IconButton>
							</Tooltip>
						</span>
					</span>
				</MenuItem>,
			];
		}
	};

	// Получение данных из JSON
	const getJsonData = (url) => {
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	// Получение начальных данных
	useEffect(() => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;
		getJsonData(url);
	}, [type]);

	// Установка оценки
	const setValue = (e, newVal) => {
		if (!newVal) return;
		let newData = { ...data };
		let studentId = parseInt(e.target.dataset["student"]);
		let student = newData.students[studentId];
		if (student) {
			student.value = newVal;
		}
		setData(newData);
	};

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
						onChange={setValue}
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
					onChange={setValue}
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

	// Вызов контекстного меню
	const handleContext = (e) => {
		setAnchorEl(e.currentTarget);
	};

	// Закрытие контекстного меню
	const handleCloseContext = () => {
		setAnchorEl(null);
	};

	// Сохранение
	const save = () => {
		setSnackbarOpen(true);
		setSnackbarMessage("Данные успешно сохранены!");

		setTimeout(() => {
			setSnackbarOpen(false);
		}, 2000);
	};

	// Сброс
	const reset = () => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;
		getJsonData(url);
	};

	// Печать
	const print = () => {
		window.print();
	};

	// DOM
	return (
		<>
			<main id="statement">
				<section>
					<div className="container">
						<PageHeader
							header="Программирование"
							backLink={true}
							subheader="Редактирование ведомости"
						/>
					</div>
					<div className="container" style={{ marginBottom: "40px" }}>
						<Grid container className="screen">
							<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
								<KVPair
									_key="группа"
									_value={
										<Link href="/main/group">
											{data.group}
										</Link>
									}
								/>
								<KVPair
									_key="номер ведомости"
									_value={data.number}
								/>
								<KVPair
									_key="тип ведомости"
									_value={data.type}
								/>
								<KVPair
									_key="вид ведомости"
									_value={data.subtype}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
								<KVPair _key="статус" _value={data.state} />
								<KVPair
									_key="зачётная единица"
									_value={data.unit}
								/>
								<KVPair
									_key="кол-во часов"
									_value={data.hours}
								/>
								<KVPair
									_className="screen"
									_key="скан документа"
									_value={
										<>
											<Link href={"/" + data.doc}>
												Посмотреть
											</Link>{" "}
											| <Link>Удалить</Link>
										</>
									}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
								<KVPair
									_key="дата выдачи"
									_value={data.startDate}
								/>
								<KVPair
									_key="дата закрытия"
									_value={data.closeDate}
								/>
								<KVPair
									_key="дедлайн закрытия"
									_value={data.deadline}
								/>
								<KVPair
									_key="дата экзамена"
									_value={data.examDate}
								/>
							</Grid>
						</Grid>
						<div className="statement-data print">
							<KVPair
								_key="группа"
								_value={
									<Link href="/main/group">{data.group}</Link>
								}
							/>
							<KVPair
								_key="номер ведомости"
								_value={data.number}
							/>
							<KVPair _key="тип ведомости" _value={data.type} />
							<KVPair
								_key="вид ведомости"
								_value={data.subtype}
							/>
							<KVPair _key="статус" _value={data.state} />
							<KVPair
								_key="зачётная единица"
								_value={data.unit}
							/>
							<KVPair _key="кол-во часов" _value={data.hours} />
							<KVPair
								_key="дата выдачи"
								_value={data.startDate}
							/>
							<KVPair
								_key="дата закрытия"
								_value={data.closeDate}
							/>
							<KVPair
								_key="дедлайн закрытия"
								_value={data.deadline}
							/>
							<KVPair
								_key="дата экзамена"
								_value={data.examDate}
							/>
						</div>
					</div>
					<div className="container">
						<Card>
							<CardContent>
								<TableContainer>
									<Table className="simple-table">
										<TableHead>
											<TableRow>
												<TableCell>№</TableCell>
												<TableCell
													sx={{ width: "70%" }}
												>
													ФИО
												</TableCell>
												{accessHeader()}
												<TableCell
													sx={{ width: "220px" }}
												>
													Оценка
												</TableCell>
												<TableCell
													className="screen"
													sx={{ textAlign: "right" }}
												>
													Действия
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{data.students.map(
												(student, index) => (
													<TableRow key={index}>
														<TableCell>
															{index + 1}
														</TableCell>
														<TableCell>
															{student.name}
														</TableCell>
														{accessVal(student)}
														<TableCell>
															{getValue(
																student.value,
																index
															)}
														</TableCell>
														<TableCell
															className="screen"
															sx={{
																textAlign:
																	"right",
															}}
														>
															<IconButton
																aria-controls={
																	open
																		? "student-menu"
																		: undefined
																}
																aria-haspopup={
																	true
																}
																aria-expanded={
																	open
																		? "true"
																		: undefined
																}
																onClick={
																	handleContext
																}
															>
																<MoreVertRounded />
															</IconButton>
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</CardContent>
						</Card>
						<div className="card-actions-wrapper screen desktop">
							<div className="left-side">
								<Button onClick={print} variant="outlined">
									Печать
								</Button>
							</div>
							<div className="right-side">
								<Button variant="outlined" onClick={reset}>
									Сброс
								</Button>
								<Button variant="contained" onClick={save}>
									Сохранить
								</Button>
							</div>
						</div>
						<div className="card-actions-wrapper mobile">
							<IconButton onClick={print}>
								<PrintRounded />
							</IconButton>
							<IconButton onClick={reset}>
								<ClearRounded />
							</IconButton>
							<IconButton onClick={save}>
								<SaveRounded />
							</IconButton>
						</div>
					</div>
				</section>
			</main>
			<Menu
				id="student-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseContext}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
			>
				{menuItems()}
			</Menu>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={snackbarOpen}
				message={snackbarMessage}
			/>
		</>
	);
}

export default Statement;
