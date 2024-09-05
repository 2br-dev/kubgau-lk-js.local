import React, { useState, useEffect } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Chip,
	Tooltip,
} from "@mui/material";
import {
	CheckRounded,
	DoNotDisturbAltRounded,
	HourglassTopRounded,
	RuleRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SessionSuspendRequests() {
	const [requests, setRequests] = useState([]);
	const navigate = useNavigate();

	const formatDate = (date) => {
		if (date) {
			return new Date(date).toLocaleDateString("ru", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}
	};

	const decide = (e) => {
		const id = e.currentTarget.dataset.id;
		const url = `/main/session-suspend-requests/${id}`;
		navigate(url);
	};

	const actionControl = (request) => {
		if (request.approved === null && request.umuRelatedChanges === true) {
			return (
				<Tooltip title="Принять решение" placement="top">
					<IconButton
						onClick={decide}
						data-id={request.sessionStopRequestId}
					>
						<RuleRounded />
					</IconButton>
				</Tooltip>
			);
		}
	};

	const statusChip = (request) => {
		let text;
		let tooltipText;
		let suffix = "";
		let color;

		if (request.umuRelatedChanges === true) {
			text = "УМУ";
			suffix = " в Учебно-методическом управлении";
		} else {
			if (request.dispatcherRelatedChanges === true) {
				text = "Диспетчер";
				suffix = " в диспетчерской";
			}
		}

		let icon;
		switch (request.approved) {
			case false:
				icon = <DoNotDisturbAltRounded sx={{ fontSize: 16 }} />;
				tooltipText = `Отклонено ${suffix}`;
				color = "#FFE8EA";
				break;
			case true:
				icon = <CheckRounded sx={{ fontSize: 16 }} />;
				tooltipText = `Одобрено ${suffix}`;
				color = "#E7F2E0";
				break;
			default:
				icon = <HourglassTopRounded sx={{ fontSize: 16 }} />;
				tooltipText = `Ожидает решения ${suffix}`;
				color = "#E0EFFB";
				break;
		}

		return (
			<Tooltip placement="top" title={tooltipText}>
				<Chip
					icon={icon}
					label={text}
					size="small"
					sx={{ backgroundColor: color }}
				/>
			</Tooltip>
		);
	};

	const tableContent = () => {
		return requests.map((r, rindex) => {
			return (
				<TableRow key={rindex}>
					<TableCell sx={{ minWidth: "400px" }}>
						{r.courseName}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatDate(r.requestDate)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatDate(r.approvalDate)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{statusChip(r)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{r.shortText}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{actionControl(r)}
					</TableCell>
				</TableRow>
			);
		});
	};

	useEffect(() => {
		fetch("/data/suspendRequests.json")
			.then((res) => res.json())
			.then((response) => {
				setRequests(response.requests);
			});
	}, []);

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						backLink={true}
						subheader="Просмотр заявок на прерывание сессии"
						header="Заявки на прерывание сессии"
					/>
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>Курс</TableCell>
											<TableCell>Дата создания</TableCell>
											<TableCell>
												Дата одобрения
											</TableCell>
											<TableCell>Статус</TableCell>
											<TableCell>Интро</TableCell>
											<TableCell>Решение</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>{tableContent()}</TableBody>
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default SessionSuspendRequests;
