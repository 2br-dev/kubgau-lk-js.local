import KVPair from "../../../../components/kv_pair";
import { Grid, Link } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function StatementData() {
	const { type } = useParams();

	const [statement, setStatement] = useState({
		statementId: null,
		controlType: 0,
		creationDate: null,
		deadline: null,
		closingDate: null,
		eventDate: null,
		groupName: "",
		discipline: "",
		eventPlace: "",
		scanGUID: null,
		statementNumber: "0",
	});

	const statementType = (typeId) => {
		const types = [
			"Экзаменационная",
			"Зачётная",
			"Зачётная",
			"Курсовая работа",
			"Курсовой проект",
		];
		return types[typeId];
	};

	useEffect(() => {
		/**
		 * Экзаменационная ведомость - 0
		 * Зачётная ведомость - 1
		 * Зачётная ведомость с оценкой - 2
		 * Курсовая работа - 3
		 * Курсовой проект - 4
		 */
		const url = `/data/statementData${type}.json`;
		fetch(url)
			.then((res) => res.json())
			.then((response) => {
				setStatement(response.statement);
			});
	}, []);

	const formatDate = (date) => {
		return new Date(date).toLocaleString("ru-RU", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatTime = (date) => {
		return new Date(date).toLocaleString("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const status = (closingDate) => {
		return closingDate === "" || closingDate === null
			? "Открыта"
			: "Закрыта";
	};

	return (
		<>
			<Grid container className="screen" sx={{ marginBottom: "40px" }}>
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair
						_key="дата выдачи"
						_value={formatDate(statement.creationDate)}
					/>
					<KVPair
						_key="дата закрытия"
						_value={formatDate(statement.closingDate)}
					/>
					<KVPair
						_key="дедлайн закрытия"
						_value={formatDate(statement.deadline)}
					/>
					<KVPair
						_key="дата проведения"
						_value={formatDate(statement.eventDate)}
					/>
					<KVPair
						_key="время проведения"
						_value={formatTime(statement.eventDate)}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair
						_key="группа"
						_value={
							<Link href="/main/group">
								{statement.groupName}
							</Link>
						}
					/>
					<KVPair
						_key="номер ведомости"
						_value={statement.statementNumber}
					/>
					<KVPair
						_key="тип ведомости"
						_value={statementType(statement.controlType)}
					/>
				</Grid>
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair
						_key="статус"
						_value={status(statement.closingDate) || "Неизвестно"}
					/>
					<KVPair
						_className="screen"
						_key="скан документа"
						_value={
							<>
								<Link>Посмотреть</Link> | <Link>Удалить</Link>
							</>
						}
					/>
				</Grid>
			</Grid>
			<div className="statement-data print">
				<KVPair
					_key="группа"
					_value={
						<Link href="/main/group">{statement.groupName}</Link>
					}
				/>
				<KVPair
					_key="номер ведомости"
					_value={statement.statementNumber}
				/>
				<KVPair
					_key="тип ведомости"
					_value={statementType(statement.controlType)}
				/>
				<KVPair
					_key="дата выдачи"
					_value={formatDate(statement.creationDate)}
				/>
				<KVPair
					_key="дата закрытия"
					_value={formatDate(statement.closingDate)}
				/>
				<KVPair
					_key="дедлайн закрытия"
					_value={formatDate(statement.deadline)}
				/>
				<KVPair
					_key="дата экзамена"
					_value={formatDate(statement.eventDate)}
				/>
			</div>
		</>
	);
}

export default StatementData;
