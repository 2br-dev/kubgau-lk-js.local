import React, { Fragment, useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
	ButtonGroup,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import ConfirmButton from "../../components/buttons/confirmButton";
import RejectButton from "../../components/buttons/rejectButton";

function SessionSuspendRequest() {
	const [details, setDetails] = useState({
		facultyName: "",
		courseName: "",
		requestDate: "",
		shortText: "",
		fullText: "",
		approved: null,
		approvalDate: null,
		approvedByUMU: null,
		approvedByDispatcher: null,
		umuRelatedChanges: false,
		dispatcherRelatedChanges: false,
		sessionId: null,
	});

	const [statements, setStatements] = useState([]);

	const groupData = (data) => {
		const statements = [
			{
				name: "Экзамены",
				disciplines: data.disciplines.filter(
					(d) => d.controlType === 0,
				),
			},
			{
				name: "Зачеты",
				disciplines: data.disciplines.filter(
					(d) => d.controlType === 1 || d.controlType === 2,
				),
			},
			{
				name: "Курсовые",
				disciplines: data.disciplines.filter(
					(d) => d.controlType === 3 || d.controlType === 4,
				),
			},
		];
		return statements;
	};

	useEffect(() => {
		fetch("/data/suspendSessionRequestGeneral.json")
			.then((res) => res.json())
			.then((data) => {
				setDetails(data.requests[0]);
			});

		fetch("/data/suspendSessionRequestStatements.json")
			.then((res) => res.json())
			.then((data) => {
				setStatements(groupData(data));
			});
	}, []);

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("ru", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const tableContent = () => {
		return statements.map((type, tindex) => {
			if (type.disciplines.length) {
				return (
					<Fragment key={tindex}>
						<TableRow>
							<TableCell
								colSpan={2}
								sx={{
									borderBottom: "2px solid #aaa",
								}}
							>
								<h3 style={{ marginBottom: 0 }}>{type.name}</h3>
							</TableCell>
						</TableRow>
						{type.disciplines.map((d, dindex) => {
							return (
								<>
									<TableRow key={dindex}>
										<TableCell colSpan={2}>
											<strong>{d.disciplineName}</strong>
										</TableCell>
									</TableRow>
									{d.statements.map((s, sindex) => {
										return (
											<TableRow key={sindex}>
												<TableCell>
													Ведомость №
													{s.statementNumber}
												</TableCell>
												<TableCell>
													{s.closed
														? "Открыта"
														: "Закрыта"}
												</TableCell>
											</TableRow>
										);
									})}
								</>
							);
						})}
					</Fragment>
				);
			}
		});
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header="Заявка на прерывание сессии"
						backLink={true}
					/>
					<div
						className="data-wrapper"
						style={{ marginBottom: "2vmax" }}
					>
						<div className="kv-pair">
							<div className="key">Факульет</div>
							<div className="value">{details.facultyName}</div>
						</div>
						<div className="kv-pair">
							<div className="key">Курс</div>
							<div className="value">{details.courseName}</div>
						</div>
						<div className="kv-pair">
							<div className="key">
								Дата/время создания заявки
							</div>
							<div className="value">
								{formatDate(details.requestDate)}
							</div>
						</div>
						<div className="kv-pair">
							<div className="key">Текст заявки</div>
							<div className="value">{details.fullText}</div>
						</div>
					</div>
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table" size="small">
									<TableHead>
										<TableRow>
											<TableCell>
												Номер ведомости
											</TableCell>
											<TableCell>Статус</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{tableContent()}</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
					<div className="card-actions-wrapper screen desktop">
						<div className="left-side"></div>
						<div className="right-side">
							<div className="group">
								<ButtonGroup
									variant="contained"
									disableElevation
								>
									<RejectButton>Отклонить</RejectButton>
									<ConfirmButton sx={{ marginLeft: 0 }}>
										Принять
									</ConfirmButton>
								</ButtonGroup>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default SessionSuspendRequest;
