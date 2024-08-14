import {
	Button,
	FormControl,
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableBody,
	TableRow,
	TextField,
	IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import { DeleteRounded } from "@mui/icons-material";
import EditLabel from "./components/edit-label";
import React from "react";

function GroupsTable() {
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		fetch("/data/assemble_groups.json")
			.then((res) => res.json())
			.then((data) => setGroups(data));
	}, []);

	const handleRemove = (e) => {
		const id = parseInt(e.currentTarget.dataset["id"]);
		const newGroups = [...groups];
		newGroups.splice(id, 1);
		setGroups(newGroups);
	};

	const updateHours = (newVal, groupId) => {
		let newGroups = [...groups];
		let group = newGroups[groupId];
		group.hours.current = parseInt(newVal);
		setGroups(newGroups);
	};

	return (
		<>
			<div className="assemble-table-header">
				<div className="group-actions">
					<Button variant="text">Добавить группу</Button>
				</div>
				<div className="group-filters">
					<FormControl>
						<TextField variant="standard" label="Поиск"></TextField>
					</FormControl>
				</div>
			</div>
			<TableContainer>
				<Table className="simple-table">
					<TableHead>
						<TableRow>
							<TableCell sx={{ width: "30px" }}>№</TableCell>
							<TableCell>группа</TableCell>
							<TableCell>часов</TableCell>
							<TableCell>перекличка</TableCell>
							<TableCell>журнал</TableCell>
							<TableCell>темы</TableCell>
							<TableCell sx={{ textAlign: "right" }}>
								действия
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{groups.map((group, index) => (
							<TableRow
								key={index}
								hover
								sx={{ cursor: "pointer" }}
							>
								<TableCell>{index + 1}</TableCell>
								<TableCell sx={{ fontWeight: "bold" }}>
									{group.name}
								</TableCell>
								<TableCell>
									<div className="edit-wrapper">
										<EditLabel
											onSave={updateHours}
											groupId={index}
											val={group.hours.current}
										/>{" "}
										/ <span>{group.hours.total}</span>
									</div>
								</TableCell>
								<TableCell>
									<Link to="/main/groups">Начать</Link>
								</TableCell>
								<TableCell>
									<Link to="/main/journal">Открыть</Link>
								</TableCell>
								<TableCell>
									<Link to="/main/themes">Редактировать</Link>
								</TableCell>
								<TableCell sx={{ textAlign: "right" }}>
									<IconButton
										data-id={index}
										onClick={handleRemove}
									>
										<DeleteRounded />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

export default GroupsTable;
