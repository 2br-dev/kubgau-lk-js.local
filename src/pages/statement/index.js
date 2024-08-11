import {
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
} from "@mui/material";
import PageHeader from "../../components/pageHeader";
import KVPair from "../../components/kv_pair";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	CancelRounded,
	CheckRounded,
	MoreVertRounded,
} from "@mui/icons-material";
import toggleTheme from "../../components/toggleTheme/";

/**
 * Ведомости
 */
function Statement() {
	const { type } = useParams();

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

	useEffect(() => {
		let suffix = type;
		let url = `/data/statement_${suffix}.json`;

		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [type]);

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

	const accessHeader = () => {
		if (data.students.length) {
			if (data.students[0].access !== undefined) {
				return <TableCell sx={{ width: "100%" }}>Допуск</TableCell>;
			}
		}
		return <></>;
	};

	const accessVal = (student) => {
		if (student.access !== undefined) {
			let control = <></>;

			if (student.access) {
				control = <CheckRounded sx={{ color: "#939393" }} />;
			} else {
				control = (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							color: "red",
						}}
					>
						<CancelRounded sx={{ marginRight: "10px" }} /> Нет
						допуска
					</div>
				);
			}

			return <TableCell>{control}</TableCell>;
		}

		return <></>;
	};

	const getValue = (value, index) => {
		if (typeof value === "number") {
			return (
				<ThemeProvider theme={toggleTheme}>
					<ToggleButtonGroup
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
				</ThemeProvider>
			);
		}
		return (
			<ThemeProvider theme={toggleTheme}>
				<ToggleButtonGroup exclusive onChange={setValue}>
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
			</ThemeProvider>
		);
	};

	return (
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
					<Grid container>
						<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
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
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
							<KVPair _key="статус" _value={data.state} />
							<KVPair
								_key="зачётная единица"
								_value={data.unit}
							/>
							<KVPair _key="кол-во часов" _value={data.hours} />
							<KVPair
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
						<Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
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
				</div>
				<div className="container">
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>№</TableCell>
											<TableCell sx={{ width: "70%" }}>
												ФИО
											</TableCell>
											{accessHeader()}
											<TableCell sx={{ width: "220px" }}>
												Оценка
											</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												Действия
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.students.map((student, index) => (
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
													sx={{ textAlign: "right" }}
												>
													<IconButton>
														<MoreVertRounded />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default Statement;
