import React from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Link,
	Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import RepassModal from "./repass_modal";

function OutplanRepasses() {
	useEffect(() => {
		fetch("/data/outplanPassings.json")
			.then((res) => res.json())
			.then((response) => {
				setData(response.data);
			});
	}, []);

	const [data, setData] = useState({
		courseName: "Название курса",
		outsidePlanPassings: [],
	});

	const [requestOpen, setRequestopen] = useState(false);

	const statusText = (code) => {
		const codes = [
			{
				code: 0,
				message: "Не отправлено на утверждение в УМУ",
			},
			{
				code: 1,
				message: "Отправлено на утверждение в УМУ",
			},
			{
				code: 2,
				message: "Отправлено на утверждение в диспетчерскую",
			},
			{
				code: 3,
				message:
					"Возвращено для внесения изменений по решению диспетчерской",
			},
			{
				code: 4,
				message: "Запрос на прерывание отправлен в УМУ",
			},
			{
				code: 5,
				message: "Запрос на прерывание отправлен в диспетчерскую",
			},
			{
				code: 6,
				message: "Запрос на прерывание отправлен в УМУ и диспетчерскую",
			},
			{
				code: 7,
				message: "Возвращено для внесения изменений по решению УМУ",
			},
			{
				code: 100,
				message: "Утверждено",
			},
		];

		return codes.filter((c) => c.code === code)[0];
	};

	const graphic = (val) => {
		return val ? "Индивидуальный" : "Общий";
	};

	const formatStudents = (students) => {
		let _students = students.map((s) => {
			let arr = s.value.split(" ");
			return {
				key: s.key,
				value:
					arr[0] + arr[1].charAt(0) + ". " + arr[2].charAt(0) + ".",
			};
		});

		return _students.map((s, sindex) => {
			return (
				<Link
					key={sindex}
					href={`/main/students/${s.key}`}
					sx={{ marginRight: "6px" }}
				>
					{s.value}
				</Link>
			);
		});
	};

	const tablebody = () => {
		return (
			<TableBody>
				{data.outsidePlanPassings.map((p, pindex) => {
					return (
						<TableRow key={pindex}>
							<TableCell>{pindex + 1}</TableCell>
							<TableCell>{p.groupName}</TableCell>
							<TableCell>{p.orderNumber}</TableCell>
							<TableCell>
								{graphic(p.individualSchedule)}
							</TableCell>
							<TableCell>
								{statusText(p.approveStatus).message}
							</TableCell>
							<TableCell>{formatStudents(p.students)}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		);
	};

	const handleCloseRepass = () => {
		setRequestopen(false);
	};

	const handleOpenRepass = () => {
		setRequestopen(true);
	};

	const handleSubmit = (data) => {
		console.log(data);
		setRequestopen(false);
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header={data.courseName}
						backLink={true}
						subheader="Управление внеплановыми сдачами"
					/>
					<div style={{ marginBottom: "2vmax" }}>
						<Button variant="contained" onClick={handleOpenRepass}>
							Создать новую
						</Button>
					</div>
					<Card>
						<CardContent>
							<TableContainer>
								<Table className="simple-table">
									<TableHead>
										<TableRow>
											<TableCell>№</TableCell>
											<TableCell>Группа</TableCell>
											<TableCell>
												Номер распоряжения
											</TableCell>
											<TableCell>График</TableCell>
											<TableCell>Ход сдачи</TableCell>
											<TableCell>Студенты</TableCell>
										</TableRow>
									</TableHead>
									{tablebody()}
								</Table>
							</TableContainer>
						</CardContent>
					</Card>
				</div>
			</section>
			<RepassModal
				open={requestOpen}
				onClose={handleCloseRepass}
				onSubmit={handleSubmit}
			/>
		</main>
	);
}

export default OutplanRepasses;
