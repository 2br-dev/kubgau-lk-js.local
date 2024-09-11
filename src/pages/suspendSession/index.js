import React, { useState, useEffect, Fragment } from "react";
import InfoPanel from "../../components/info_panel";
import { useNavigate } from "react-router-dom";
import { ChevronLeftRounded } from "@mui/icons-material";
import { InfoClass } from "../../components/info_panel/interfaces";
import {
	Button,
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";

function SuspendSession() {
	const navigate = useNavigate();
	const [requestDetails, setRequestDetails] = useState({
		courseName: "Название курса",
		types: [],
	});

	const back = () => {
		navigate(-1);
	};

	const groupDisciplines = (course) => {
		let output = {
			courseName: course.courseName,
			types: [
				{
					name: "Экзамены",
					disciplines: course.disciplines.filter(
						(d) => d.controlType === 0,
					),
				},
				{
					name: "Зачёты",
					disciplines: course.disciplines.filter(
						(d) => d.controlType === 1 || d.controlType === 2,
					),
				},
				{
					name: "Курсовые",
					disciplines: course.disciplines.filter(
						(d) => d.controlType === 3 || d.controlType === 4,
					),
				},
			],
		};
		return output;
	};

	useEffect(() => {
		fetch("/data/suspendStatements.json")
			.then((res) => res.json())
			.then((response) => {
				setRequestDetails(groupDisciplines(response));
			});
	}, []);

	const tableBody = () => {
		return requestDetails.types.map((t, tindex) => {
			if (t.disciplines.length) {
				return (
					<Fragment key={tindex}>
						<TableRow>
							<TableCell colSpan={3}>
								<h3 style={{ marginBottom: 0 }}>{t.name}</h3>
							</TableCell>
						</TableRow>
						{t.disciplines.map((d, dindex) => {
							return (
								<Fragment key={dindex}>
									<TableRow>
										<TableCell
											rowSpan={d.statements.length + 1}
										>
											{d.disciplineName}
										</TableCell>
									</TableRow>
									{d.statements.map((s, sindex) => {
										return (
											<Fragment key={sindex}>
												<TableRow>
													<TableCell
														sx={{
															borderLeft:
																"1px solid rgb(224,224,224)",
														}}
													>
														{s.statementNumber}
													</TableCell>
													<TableCell>
														{s.closed
															? "Закрыта"
															: "Открыта"}
													</TableCell>
												</TableRow>
											</Fragment>
										);
									})}
								</Fragment>
							);
						})}
					</Fragment>
				);
			} else {
				return <></>;
			}
		});
	};

	return (
		<main>
			<section>
				<div className="container">
					<div className="back-link screen">
						<a href="#!" onClick={back} className="icon-block">
							<ChevronLeftRounded />
							Назад
						</a>
						<span>Заявка на прерывание сессии</span>
					</div>
					<InfoPanel
						id="suspend-session-info"
						title={requestDetails.courseName}
						message={
							<>
								<p>
									Вы пытаетесь создать заявку к
									Учебно-методическому управлению с просьбой
									приостановить ход сессии курса для 38.03.05
									Бизнес-информатика, «Анализ, моделирование и
									формирование интегрального представления
									стратегий и целей, бизнес-процессов и
									информационно-логической инфраструктуры
									предприятий и организаций» (программа
									бакалавриата) 1 курс. После создания, заявка
									будет рассмотрена Учебно-методическим
									управлением и, в случае положительного
									ответа, с сессии будет снято утверждение и
									вы получите возможность редактировать
									сессию. Имейте в виду, что нельзя
									редактировать расписание для пар
									группа-предмет у которых уже есть созданные
									ведомости.
								</p>
								<p>
									После снятия утверждения Учебно-методическим
									управлением, преподаватели не смогут
									заполнять ведомости по предметам,
									приведённым в таблице, до тех пор, пока
									сессия не будет заново утверждена.
								</p>
							</>
						}
						type={InfoClass.WARNING}
					/>
					<Grid container spacing={4} sx={{ marginTop: ".5vmax" }}>
						<Grid item xs={12} lg={9} md={12}>
							<Card>
								<CardContent>
									<TableContainer>
										<Table
											className="simple-table"
											size="small"
										>
											<TableHead>
												<TableRow>
													<TableCell>
														Дисциплина
													</TableCell>
													<TableCell>
														Ведомость
													</TableCell>
													<TableCell>
														Статус
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>{tableBody()}</TableBody>
										</Table>
									</TableContainer>
								</CardContent>
							</Card>
						</Grid>
						<Grid item lg={3}>
							<strong>
								Отправка заявки на прерывание сессии
							</strong>
							<p>Адресат</p>
							<FormControlLabel
								sx={{ userSelect: "none" }}
								label="Учебно-методическое управление"
								control={<Checkbox />}
							/>
							<FormControlLabel
								sx={{ userSelect: "none" }}
								label="Диспетчерская"
								control={<Checkbox />}
							/>
							<TextField
								variant="standard"
								fullWidth
								label="Подробное описание причины"
								multiline
							/>
							<FormControlLabel
								sx={{
									marginTop: "10px",
									marginBottom: "10px",
									userSelect: "none",
								}}
								label="Я понимаю последствия своих действий"
								control={<Checkbox />}
							/>
							<Button variant="contained">Оформить заявку</Button>
						</Grid>
					</Grid>
				</div>
			</section>
		</main>
	);
}

export default SuspendSession;
