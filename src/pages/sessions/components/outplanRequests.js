import {
	CheckRounded,
	CircleRounded,
	InsertDriveFileOutlined,
} from "@mui/icons-material";
import {
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	Tooltip,
	IconButton,
} from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";

function OutplanRequests() {
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		fetch("/data/outplanRequests.json")
			.then((res) => res.json())
			.then((response) => {
				setRequests(response.data);
			});
	}, []);

	const actions = (p) => {
		switch (p.approvalStatus) {
			case 1:
				return (
					<Tooltip placement="top" title="Утвердить">
						<IconButton>
							<CheckRounded />
						</IconButton>
					</Tooltip>
				);
			default:
				return (
					<Tooltip placement="top" title="Детали">
						<IconButton>
							<InsertDriveFileOutlined />
						</IconButton>
					</Tooltip>
				);
		}
	};

	const indicator = (p) => {
		let color = "";
		let message = "";
		switch (p.approvalStatus) {
			case 1:
				color = "#FDD835";
				message = "Ожидает утверждения";
				break;
			default:
				color = "#00BFA5";
				message = "Утверждён";
				break;
		}
		return (
			<Tooltip placement="top" title={message}>
				<CircleRounded sx={{ color: color }} />
			</Tooltip>
		);
	};

	const students = (students) => {
		let shortStudents = students.map((s) => {
			let nameArray = s.value.split(" ");
			return (
				nameArray[0] +
				" " +
				nameArray[1].substr(0, 1) +
				". " +
				nameArray[2].substr(0, 1) +
				"."
			);
		});
		return shortStudents.join(", ");
	};

	return (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow>
						<TableCell colSpan={2}>Курс</TableCell>
						<TableCell>Студенты</TableCell>
						<TableCell>Номер приказа</TableCell>
						<TableCell sx={{ textAlign: "right" }}>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{requests.map((r, index) => {
						return (
							<Fragment key={index}>
								<TableRow key={index}>
									<TableCell colSpan={5}>
										<h2 style={{ margin: 0 }}>
											{r.facultyName}
										</h2>
									</TableCell>
								</TableRow>
								{r.passings.map((p, pindex) => {
									return (
										<TableRow key={pindex}>
											<TableCell>
												{indicator(p)}
											</TableCell>
											<TableCell>
												{p.courseName}
											</TableCell>
											<TableCell>
												{students(p.students)}
											</TableCell>
											<TableCell>
												{p.orderNumber}
											</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												{actions(p)}
											</TableCell>
										</TableRow>
									);
								})}
							</Fragment>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default OutplanRequests;
