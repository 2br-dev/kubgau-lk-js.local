import React from "react";
import PageHeader from "../../components/pageHeader";
import { Button, Card, CardContent, Grid } from "@mui/material";
import NumberCard from "../login/components/number-card";
import Session from "./assets/session.svg";
import Practice from "./assets/practice.svg";
import Urgent from "./assets/urgent.svg";
import Prevention from "./assets/prevention.svg";
import Reports from "./assets/reports.svg";
import SectionList from "../login/components/sectionList.js";

import mainLinks from "./components/mainLinks.js";
import analyticsLinks from "./components/analyticsLinks.js";
import PieCard from "../login/components/pie-card.js";
import { useState, useEffect } from "react";

function UMUDashboard() {
	const suffix = <Button variant="contained">Посещаемость групп</Button>;

	const [umuStats, setUmuStats] = useState({
		sessionApprovalRequests: 0,
		practiceApprovalRequests: 0,
		outplanSessionRequests: 0,
		sessionSuspendingRequests: 0,
	});

	useEffect(() => {
		fetch("/data/umu_data.json")
			.then((res) => res.json())
			.then((response) => {
				const d = response.data;
				setUmuStats({
					sessionApprovalRequests:
						d.numberOfRequestsForSessionApproval,
					practiceApprovalRequests:
						d.numberOfRequestsForPracticeApproval,
					outplanSessionRequests:
						d.numberOfRequestsForOutsidePlanSessionApproval,
					sessionSuspendingRequests:
						d.numberOfRequestsForSessionSuspending,
				});
			});
	}, []);

	const series1 = [
		{
			value: 859,
			label: "Зачёт",
		},
		{
			value: 589,
			label: "Экзамен",
		},
		{
			value: 38,
			label: "Дифф. зачёт",
		},
		{
			value: 136,
			label: "Курсовая работа",
		},
		{
			value: 58,
			label: "Курсовой проект",
		},
	];

	const series2 = [
		{
			value: 193,
			label: "Студенты с задолжностью",
		},
		{
			value: 14086,
			label: "Студенты без задолженности",
		},
	];

	const series3 = [
		{
			value: 202,
			label: "Просроченные",
		},
		{
			value: 37,
			label: "Закрытые с задержкой",
		},
		{
			value: 266,
			label: "Закрытые вовремя",
		},
	];

	const openStatementClick = (e, value) => {
		console.log({
			"Статистика открытых ведомостей": series1[value.dataIndex],
		});
	};

	const deptClick = (e, value) => {
		console.log({
			"Студенты с задолженностью на сегодня": series2[value.dataIndex],
		});
	};

	const closingStatementClick = (e, value) => {
		console.log({
			"Статистика закрытия ведомости": series3[value.dataIndex],
		});
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader header="Управление" suffix={suffix} />
					<Grid container spacing={2}>
						<Grid item lg={3} md={6} sm={6} xs={12}>
							<NumberCard
								value={umuStats.sessionApprovalRequests}
								title="заявки на утверждение сессии"
								color="#E3F2FF"
								icon={Session}
							/>
						</Grid>
						<Grid item lg={3} md={6} sm={6} xs={12}>
							<NumberCard
								value={umuStats.practiceApprovalRequests}
								title="заявки на утверждение практик"
								color="#FFE5D4"
								icon={Practice}
							/>
						</Grid>
						<Grid item lg={3} md={6} sm={6} xs={12}>
							<NumberCard
								value={umuStats.outplanSessionRequests}
								title="заявки на досрочные сессии"
								color="#DFF5F1"
								icon={Urgent}
							/>
						</Grid>
						<Grid item lg={3} md={6} sm={6} xs={12}>
							<NumberCard
								value={umuStats.sessionSuspendingRequests}
								title="заявки на прерывание сессии"
								url="/main/session-suspend-requests"
								color="#FFF3D8"
								icon={Prevention}
							/>
						</Grid>
						<Grid item lg={3} md={12} sm={12} xs={12}>
							<h2
								style={{ fontSize: "18px", fontWeight: "bold" }}
							>
								Мониторинг образовательного процесса
							</h2>
							<Grid container spacing={2}>
								<Grid item lg={12} md={12} sm={12} xs={12}>
									<NumberCard
										value={0}
										title="экзаменов проводится сегодня"
									/>
								</Grid>
								<Grid item lg={12} md={4} sm={4} xs={12}>
									<PieCard
										series={series1}
										value={1680}
										title="Статистика открытых ведомостей"
										onItemClick={openStatementClick}
									/>
								</Grid>
								<Grid item lg={12} md={4} sm={4} xs={12}>
									<PieCard
										series={series2}
										value={193}
										title="Студенты с задолжностью на сегодня"
										onItemClick={deptClick}
									/>
								</Grid>
								<Grid item lg={12} md={4} sm={4} xs={12}>
									<PieCard
										series={series3}
										value={505}
										title="Статистика закрытия ведомостей"
										onItemClick={closingStatementClick}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item lg={9} md={12} sm={12} xs={12}>
							<h2
								style={{ fontSize: "18px", fontWeight: "bold" }}
							>
								Конструктор отчётов
							</h2>
							<Card
								sx={{
									backgroundImage: `url(${Reports})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition:
										"bottom 1vmax right 1vmax",
									backgroundSize:
										"calc(max(240px, 12vw)) auto",
									"@media(max-width: 1200px)": {
										backgroundImage: "none",
									},
								}}
							>
								<CardContent>
									<Grid container spacing={2}>
										<Grid
											item
											lg={6}
											md={12}
											sm={12}
											xs={12}
										>
											<h3
												style={{
													marginTop: 0,
													fontSize: "18px",
												}}
											>
												Основные
											</h3>
											<SectionList items={mainLinks} />
										</Grid>
										<Grid
											item
											lg={6}
											md={12}
											sm={12}
											xs={12}
										>
											<h3
												style={{
													marginTop: 0,
													fontSize: "18px",
												}}
											>
												Аналитический отдел
											</h3>
											<SectionList
												items={analyticsLinks}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</div>
			</section>
		</main>
	);
}

export default UMUDashboard;
