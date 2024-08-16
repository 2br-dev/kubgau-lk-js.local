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
	Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./index.scss";
import { useEffect, useState } from "react";
import { DeleteRounded, EditRounded } from "@mui/icons-material";
import EditLabel from "./components/edit-label";
import React from "react";
import { useDialogs } from "@toolpad/core";
import VirtaulGroupModal from "./components/virtualGroupModal";

function GroupsTable() {
	const [groups, setGroups] = useState([]);
	const [searchGroups, setSearchGroups] = useState([]);
	const dialogs = useDialogs();
	const [editGroup, setEditGroup] = useState(null);
	const [editOpen, setEditOpen] = useState(false);
	const [modalMode, setModalMode] = useState("edit");

	useEffect(() => {
		fetch("/data/getVirtualGroups.json")
			.then((res) => res.json())
			.then((response) => {
				setGroups(response.data);
				setSearchGroups(response.data);
			});
	}, []);

	const handleRemove = async (e) => {
		const id = parseInt(e.currentTarget.dataset["id"]);
		const groupId = parseInt(e.currentTarget.dataset["group"]);
		const disciplines = [...groups];

		let group = disciplines[groupId];

		let groupName = group.virtualGroups[id].virtualGroupName;
		let disciplineName = group.disciplineName;

		const confirmed = await dialogs.confirm(
			`Вы уверены, что хотите удалить сводную группу «${groupName}» из дисциплины «${disciplineName}?»`,
			{
				okText: "Да",
				cancelText: "Нет",
				title: "Удаление сводной группы",
			},
		);

		if (confirmed) {
			group.virtualGroups.splice(id, 1);
			setGroups(disciplines);
		}
	};

	const updateHours = (newVal, groupId) => {
		let newGroups = [...groups];
		let group = newGroups[groupId];
		group.hours.current = parseInt(newVal);
		setGroups(newGroups);
	};

	const handleEdit = (e) => {
		const id = parseInt(e.currentTarget.dataset["id"]);
		const groupId = parseInt(e.currentTarget.dataset["group"]);

		const discipline = groups[groupId];
		const virtualGroup = discipline.virtualGroups[id];

		virtualGroup.disciplineId = groupId;
		virtualGroup.groupId = id;

		setModalMode("edit");
		setEditOpen(true);
		setEditGroup(virtualGroup);
	};

	const handleModalSave = (group) => {
		setEditOpen(false);
		setEditGroup(null);
		setModalMode("edit");
		console.log(group);
	};

	const handleModalClose = () => {
		setEditOpen(false);
		setEditGroup(null);
		setModalMode("edit");
	};

	const tableContent = (discipline, groupId) => {
		return discipline.virtualGroups.map((group, index) => (
			<TableRow
				data-id={index}
				data-group={groupId}
				key={index}
				hover
				sx={{ cursor: "pointer" }}
			>
				<TableCell>{index + 1}</TableCell>
				<TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
					<Tooltip placement="top" title={group.employeeFullName}>
						<span>{group.virtualGroupName}</span>
					</Tooltip>
				</TableCell>
				<TableCell>
					<div className="edit-wrapper">
						<EditLabel
							onSave={updateHours}
							groupId={index}
							val={group.filledHours}
						/>{" "}
						/ <span>{group.totalHours}</span>
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
				<TableCell sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
					<Tooltip placement="top" title="Редактировать">
						<IconButton
							data-id={index}
							data-group={groupId}
							onClick={handleEdit}
						>
							<EditRounded />
						</IconButton>
					</Tooltip>
					<Tooltip placement="top" title="Удалить">
						<IconButton
							data-id={index}
							data-group={groupId}
							onClick={handleRemove}
						>
							<DeleteRounded />
						</IconButton>
					</Tooltip>
				</TableCell>
			</TableRow>
		));
	};

	const handleSearch = (e) => {
		const groupId = parseInt(e.target.parentElement.dataset["group"]);
		const query = e.target.value.toLowerCase();

		let newSearchGroups = [...groups];
		const group = { ...newSearchGroups[groupId] };

		if (query !== "") {
			const response = group.virtualGroups.filter((vg) => {
				let groupName = vg.virtualGroupName.toLowerCase();
				return groupName.indexOf(query) >= 0;
			});
			group.virtualGroups = response;
			newSearchGroups[groupId] = group;
		} else {
			newSearchGroups = [...groups];
		}

		setSearchGroups(newSearchGroups);
	};

	return (
		<>
			{searchGroups.map((discipline, index) => {
				return (
					<div className="group" key={index}>
						<h2>{discipline.disciplineName}</h2>
						<div className="assemble-table-header">
							<div className="group-actions">
								<Button variant="text">Добавить</Button>
							</div>
							<div className="group-filters">
								<FormControl>
									<TextField
										variant="standard"
										label="Поиск"
										InputProps={{
											"data-group": index,
										}}
										onKeyUp={handleSearch}
									></TextField>
								</FormControl>
							</div>
						</div>
						<TableContainer sx={{ marginBottom: "60px" }}>
							<Table className="simple-table">
								<TableHead>
									<TableRow>
										<TableCell sx={{ width: "30px" }}>
											№
										</TableCell>
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
									{tableContent(discipline, index)}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				);
			})}

			<VirtaulGroupModal
				open={editOpen}
				group={editGroup}
				mode={modalMode}
				handleClose={handleModalClose}
				handleSave={handleModalSave}
			/>
		</>
	);
}

export default GroupsTable;
