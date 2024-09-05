import {
	ChevronLeftRounded,
	AddRounded,
	AddCommentRounded,
	CloseRounded,
	EditRounded,
} from "@mui/icons-material";
import InfoPanel from "../../components/info_panel";
import { InfoClass } from "../../components/info_panel/interfaces";
import { useState, useEffect } from "react";
import GroupFilters from "./components/group_filters";
import { useNavigate } from "react-router-dom";
import {
	Grid,
	Snackbar,
	TableContainer,
	Tooltip,
	Card,
	CardContent,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
	IconButton,
	List,
	ListItemButton,
	Switch,
} from "@mui/material";
import ValueMenu from "./components/value_menu";
import { EMenuType } from "./components/value_menu/interfaces";
import "./styles.scss";
import CommentModal from "./components/comment_modal";
import React from "react";
import styled from "@emotion/styled";

const StyledSwitch = styled(Switch)(() => ({
	"& .MuiSwitch-switchBase": {
		"&.Mui-checked": {
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: "#00BFA5",
				opacity: 1,
			},
		},
	},
	"& .MuiSwitch-track": {
		backgroundColor: "#FF1744",
		opacity: 1,
		"&::before, &::after": {
			content: '""',
			position: "absolute",
			top: "50%",
			transform: "translateY(-50%)",
			width: 16,
			height: 16,
			backgroundSize: "contain",
		},
	},
	"& .MuiSwitch-thumb": {
		backgroundColor: "#D9D9D9",
	},
}));

/**
 * Перекличка
 * @returns
 */
export default function GroupsPage() {
	const [theme, setTheme] = useState("");
	const [date, setDate] = useState(null);
	const [pair, setPair] = useState(1);
	const [data, setData] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [commentModalOpen, setCommentModalOpen] = useState("");
	const [comment, setComment] = useState("");
	const [studentId, setStudentId] = useState(-1);
	const [groupId, setGroupId] = useState(-1);
	const navigate = useNavigate();

	// Переключение студента по клику на строке таблицы
	const toggleStudentHere = (e) => {
		let element = e.currentTarget;
		let studentId = parseInt(element.getAttribute("data-id"));
		let groupId = parseInt(element.getAttribute("data-group-id"));
		let student = data[groupId].students[studentId];
		let isHere = student.isHere;
		let path = Array.from(e.nativeEvent.composedPath());

		let buttons = path.filter((e) => {
			return (
				e.tagName === "A" ||
				e.tagName === "BUTTON" ||
				e.tagName === "LI"
			);
		});

		if (!buttons.length) {
			let newData = [...data];
			newData[groupId].students[studentId].isHere = !isHere;
			setData(newData);
		}
	};

	// Прокрутка до группы
	const handleGroupClick = (e) => {
		let groupIndex = e.target.dataset["group"];
		let link = "#group-" + groupIndex;
		let element = document.querySelector(link);
		let top = element.offsetTop;
		window.scrollTo({ top: top - 110, behavior: "smooth" });
	};

	// Закрытие модального окна комментария
	const closeCommentModal = () => {
		setCommentModalOpen("");
	};

	// Задание текста комментария в данных
	const setCommentField = (groupId, studentId, comment) => {
		// Сохранение данных перед вносом комментариев
		let newData = [...data];

		localStorage.setItem("prevGroupsData", JSON.stringify(data));

		if (data) {
			let group = data[groupId];

			if (group) {
				let student = group.students[studentId];

				if (student) {
					student.comment = comment;
					setData(newData);

					setCommentModalOpen("");
					setSnackbarMessage("Комментарий изменён!");
					setSnackbarOpen(true);

					// Закрываем уведомление через 2 секунды
					setTimeout(() => {
						setSnackbarOpen(false);
					}, 2000);
				}
			}
		}
	};

	// Открытие модального окна комментария
	const openCommentModal = (e) => {
		let button = e.currentTarget;
		let studentId = button.dataset["studentid"]
			? parseInt(button.dataset["studentid"])
			: -1;
		let groupId = button.dataset["groupid"]
			? parseInt(button.dataset["groupid"])
			: -1;

		setGroupId(groupId);
		setStudentId(studentId);

		if (data !== null) {
			let student = data[groupId].students[studentId];
			if (student) {
				setComment(student.comment);
			}
		}

		setCommentModalOpen(" open");
	};

	// Удаление оценки
	const valueRemover = (sectionId, studentId, valueId) => {
		let oldData;
		const newData = (oldData = [...data]);
		const section = newData[sectionId];
		const student = section.students[studentId];

		// Сохраняем данные для возможной отмены
		localStorage.setItem("prevGroupsData", JSON.stringify(oldData));

		student.values.splice(valueId, 1);
		setData(newData);
		setSnackbarMessage("Оценка удалена!");
		setSnackbarOpen(true);

		setTimeout(() => {
			setSnackbarOpen(false);
			localStorage.removeItem("prevGroupsData");
		}, 2000);
	};

	// Откат изменений
	const handleCancel = () => {
		let prevGroupsData = localStorage.getItem("prevGroupsData") || "";
		let prevData = JSON.parse(prevGroupsData);
		setData(prevData);
		setSnackbarOpen(false);
	};

	const cancelAction = (
		<>
			<Button
				onClick={handleCancel}
				sx={{ color: "yellow", marginRight: "10px" }}
			>
				Отмена
			</Button>
			<IconButton onClick={() => setSnackbarOpen(false)}>
				<CloseRounded sx={{ color: "#ffffff" }} />
			</IconButton>
		</>
	);

	// Установка оценки
	const valueSetter = (sectionId, studentId, valueId, val, name) => {
		localStorage.setItem("prevGroupsData", JSON.stringify(data));
		const newData = [...data];
		const section = newData[sectionId];
		const student = section.students[studentId];
		const value = student.values[valueId];

		// Если оценка была, меняем её
		if (value) {
			value.value = val;
			value.name = name ? name : "";

			setSnackbarMessage("Оценка изменена!");
		} else {
			// Иначе создаём её
			if (name != null) {
				let value = {
					name: name,
					value: val,
				};

				setSnackbarMessage("Оценка проставлена!");

				// Закрываем уведомление через 2 секунды
				setTimeout(() => {
					setSnackbarOpen(false);
				}, 2000);

				student.values.push(value);
			} else {
				alert("Укажите тип оценки!");
			}
		}

		setSnackbarOpen(true);

		setData(newData);
	};

	// Отработка кнопки "Назад"
	const back = () => {
		navigate(-1);
	};

	// Тема
	const themeSetter = (newVal) => {
		setTheme(newVal);

		// Вывод фильтров в консоль
		//	 showFilters()
	};

	// Дата
	const dateSetter = (newVal) => {
		setDate(newVal);

		// Вывод фильтров в консоль
		showFilters();
	};

	/**
	 * Пара
	 * @param {number} newVal Новое значение
	 */
	const pairSetter = (newVal) => {
		setPair(newVal);

		// Вывод фильтров в консоль
		showFilters();
	};

	/**
	 * Вывод фильтров в консоль
	 */
	const showFilters = () => {
		let data = {
			theme: theme,
			date: date,
			pair: pair,
		};

		console.table(data);
	};

	// Получение данных
	const getData = async () => {
		await fetch("/data/groups.json")
			.then((res) => res.json())
			.then((data) => setData(data))
			.catch((error) => console.error(error));
	};

	/**
	 * Монтаж компонента
	 */
	useEffect(() => {
		getData();
	}, []);

	const hereSwitcher = (e, value) => {
		const dataHolder =
			e.currentTarget.parentElement?.parentElement?.parentElement;
		const groupId = parseInt(dataHolder?.dataset["group"] || "-1");
		const studentId = parseInt(dataHolder?.dataset["student"] || "-1");

		let newData = [...data];

		if (data) {
			let student = newData[groupId].students[studentId];
			student.isHere = value;
		}

		setData(newData);
	};

	const switchAll = (e) => {
		const dataHolder =
			e.currentTarget.parentElement?.parentElement?.parentElement;
		const groupId = parseInt(dataHolder?.dataset["group"] || "-1");
		let el = e.target;
		let value = el.checked;

		if (data) {
			let newData = [...data];

			let group = newData[groupId];
			group.students.forEach((student) => {
				student.isHere = value;
			});

			setData(newData);
		}
	};

	return (
		<main id="groups">
			<section>
				<div className="container">
					<a href="#!" onClick={back} className="icon-block">
						<ChevronLeftRounded />
						Назад
					</a>
					<InfoPanel
						id="groups-info"
						title="Алгоритмизация и программирование"
						message={
							<div>
								<ol>
									<li>
										<strong>Основная оценка</strong>{" "}
										предназначена для отражения результатов
										работы обучающегося на занятии (устный
										ответ, защита доклада/реферата, работа
										на занятии). Выставляется
										непосредственно во время переклички в
										период 7-ми дней. Исправление или
										удаление оценки осуществляется ТОЛЬКО
										сотрудниками Центра ИТ через служебную
										записку, подписанную начальником УМУ.
									</li>
									<li>
										<strong>Дополнительная оценка</strong>{" "}
										предназначена для отражения результатов
										работы всей группы обучающихся
										(проведение тестирования, защиты
										лабораторных работ, контрольных работ,
										домашнего задания, расчетно-графических
										работ и другого). Если дополнительная
										оценка выставлена хотя бы одному
										обучающемуся, то всем остальным также
										должна быть выставлена оценка. Оценка
										может быть выставлена в период 14-ти
										дней даже студентам, которые
										отсутствовали на занятии. Исправление
										или удаление оценки осуществляется
										ТОЛЬКО сотрудниками Центра ИТ через
										служебную записку, подписанную
										начальником УМУ.
									</li>
								</ol>
							</div>
						}
						type={InfoClass.INFO}
						subtitle={
							<>
								Семинрар №2{" "}
								<span className="fogged">(из 5)</span>
							</>
						}
					/>
				</div>
				<div className="container">
					<Grid
						container
						className="filters-wrapper"
						sx={{ alignItems: "unset" }}
					>
						<Grid item lg={9}>
							<GroupFilters
								theme={theme}
								date={date}
								pair={pair}
								themeSetter={themeSetter}
								dateSetter={dateSetter}
								pairSetter={pairSetter}
							/>
							{data?.map((group, sectionIndex) => {
								return (
									<Card
										key={sectionIndex}
										id={"group-" + (sectionIndex + 1)}
									>
										<CardContent>
											<h2 style={{ marginTop: 0 }}>
												{group.name}
											</h2>
											<TableContainer>
												<Table className="simple-table">
													<TableHead>
														<TableRow>
															<TableCell
																colSpan={3}
															>
																ФИО
															</TableCell>
															<TableCell
																data-group={
																	sectionIndex
																}
															>
																<StyledSwitch
																	onChange={
																		switchAll
																	}
																/>
															</TableCell>
															<TableCell>
																Посещаемость
															</TableCell>
															<TableCell>
																Пропуски
															</TableCell>
															<TableCell>
																Оценка
															</TableCell>
															<TableCell
																sx={{
																	textAlign:
																		"right",
																}}
															>
																Добавить оценку
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{group.students.map(
															(
																student,
																studentIndex,
															) => {
																let skipping = (
																	<TableCell>
																		{
																			student
																				.skipping
																				.current
																		}
																		/
																		{
																			student
																				.skipping
																				.total
																		}
																	</TableCell>
																);
																let skippingPercent =
																	(
																		<TableCell>
																			{
																				student
																					.skipping
																					.percentage
																			}
																			%
																		</TableCell>
																	);
																let commentTooltip =
																	student.comment ===
																	""
																		? "Добавить комментарий"
																		: "Изменить комментарий";
																let commentIcon =
																	student.comment ===
																	"" ? (
																		<AddCommentRounded />
																	) : (
																		<EditRounded />
																	);
																let isHere =
																	student.isHere;

																if (
																	student.skipping
																) {
																	if (
																		student
																			.skipping
																			.percentage >=
																		50
																	) {
																		skipping =
																			(
																				<TableCell
																					sx={{
																						color: "#FF1744",
																					}}
																				>
																					{
																						student
																							.skipping
																							.current
																					}

																					/
																					{
																						student
																							.skipping
																							.total
																					}{" "}
																				</TableCell>
																			);
																		skippingPercent =
																			(
																				<TableCell
																					sx={{
																						color: "#FF1744",
																					}}
																				>
																					{
																						student
																							.skipping
																							.percentage
																					}

																					%
																				</TableCell>
																			);
																	}
																}

																return (
																	<TableRow
																		key={
																			studentIndex
																		}
																		data-group-id={
																			sectionIndex
																		}
																		data-id={
																			studentIndex
																		}
																		hover
																		onClick={
																			toggleStudentHere
																		}
																	>
																		<TableCell>
																			{studentIndex +
																				1}
																		</TableCell>
																		<TableCell>
																			<Tooltip
																				title={
																					commentTooltip
																				}
																				placement="top"
																			>
																				<IconButton
																					onClick={
																						openCommentModal
																					}
																					data-studentid={
																						studentIndex
																					}
																					data-groupid={
																						sectionIndex
																					}
																				>
																					{
																						commentIcon
																					}
																				</IconButton>
																			</Tooltip>
																		</TableCell>
																		<TableCell>
																			<div className="name">
																				{
																					student.fullname
																				}
																			</div>
																			<div className="comment">
																				{
																					student.comment
																				}
																			</div>
																		</TableCell>
																		<TableCell>
																			<div
																				data-group={
																					sectionIndex
																				}
																				data-student={
																					studentIndex
																				}
																			>
																				<StyledSwitch
																					onChange={
																						hereSwitcher
																					}
																					checked={
																						isHere
																					}
																				/>
																			</div>
																		</TableCell>
																		{
																			skipping
																		}
																		{
																			skippingPercent
																		}
																		<TableCell>
																			<div className="values">
																				{student.values.map(
																					(
																						value,
																						valueIndex,
																					) => {
																						return (
																							<ValueMenu
																								sectionId={
																									sectionIndex
																								}
																								valueId={
																									valueIndex
																								}
																								studentId={
																									studentIndex
																								}
																								name={
																									value.name
																								}
																								key={
																									valueIndex
																								}
																								value={
																									value.value
																								}
																								type={
																									EMenuType.UPDATE
																								}
																								content={
																									<span>
																										{
																											value.value
																										}
																									</span>
																								}
																								changeHandler={
																									valueSetter
																								}
																								removeHandler={
																									valueRemover
																								}
																							/>
																						);
																					},
																				)}
																			</div>
																		</TableCell>
																		<TableCell
																			sx={{
																				textAlign:
																					"right",
																			}}
																		>
																			<ValueMenu
																				sectionId={
																					sectionIndex
																				}
																				studentId={
																					studentIndex
																				}
																				valueId={
																					-1
																				}
																				type={
																					EMenuType.CREATE
																				}
																				value={
																					-1
																				}
																				content={
																					<AddRounded />
																				}
																				changeHandler={
																					valueSetter
																				}
																			/>
																		</TableCell>
																	</TableRow>
																);
															},
														)}
													</TableBody>
												</Table>
											</TableContainer>
										</CardContent>
									</Card>
								);
							})}
							<div className="save-wrapper">
								<Button variant="outlined">Отмена</Button>
								<Button variant="contained">Сохранить</Button>
							</div>
						</Grid>
						<Grid item lg={1} />
						<Grid item lg={2}>
							<div className="pin">
								<h2>Группы</h2>
								<List>
									{data?.map((group, groupIndex) => {
										return (
											<ListItemButton
												key={groupIndex}
												data-group={groupIndex + 1}
												onClick={handleGroupClick}
											>
												{group.name}
											</ListItemButton>
										);
									})}
								</List>
							</div>
						</Grid>
					</Grid>
				</div>
			</section>
			<Snackbar
				open={snackbarOpen}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				message={snackbarMessage}
				action={cancelAction}
			/>
			<CommentModal
				openClass={commentModalOpen}
				comment={comment}
				groupId={groupId}
				studentId={studentId}
				setter={setCommentField}
				closeSetter={closeCommentModal}
			/>
		</main>
	);
}
