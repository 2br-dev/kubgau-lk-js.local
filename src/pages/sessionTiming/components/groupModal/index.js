import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	Autocomplete,
	Button,
	Grid,
	IconButton,
	Table,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Tooltip,
} from "@mui/material";
import { AddRounded, CloseRounded, DeleteRounded } from "@mui/icons-material";

GroupModal.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
	group: PropTypes.object,
	disciplineIndex: PropTypes.number,
	groupIndex: PropTypes.number,
	control: PropTypes.number,
	disciplineName: PropTypes.string,
	chairName: PropTypes.string,
	availableTeachers: PropTypes.arrayOf(PropTypes.object),
};

function GroupModal(props) {
	const openClass = props.isOpen ? "modal-wrapper open" : "modal-wrapper";
	const [group, setGroup] = useState({
		groupId: null,
		groupName: null,
		eventDate: null,
		eventTime: null,
		eventPlace: null,
		employees: [],
		extraEmployees: [],
	});
	const [employee2add, setEmployee2add] = useState();
	const [extraEmployee2add, setExtraEmployee2add] = useState("");
	const [employees, setEmployees] = useState([]);

	useEffect(() => {
		setGroup(props.group);
		let emp = new Set(props.availableTeachers.map(JSON.stringify));
		let vals = Array.from(emp).map(JSON.parse);

		setEmployees(vals);
	}, [props.availableTeachers, props.group]);

	const closeModal = () => {
		props.onClose();
	};

	const handleSave = () => {
		props.onSubmit(group, props.disciplineIndex, props.groupIndex);
	};

	const controls = [
		"экзамена",
		"зачёта",
		"дифф. зачёта",
		"курсовой работы",
		"курсового проекта",
	];

	const onListChange = (e, newVal) => {
		setEmployee2add(newVal);
	};

	const autocompleteControl = () => {
		if (Array.isArray(employees)) {
			return (
				<Autocomplete
					fullWidth
					disablePortal
					getOptionLabel={(option) => {
						return (
							option.lastName +
							" " +
							option.firstName.substr(0, 1) +
							". " +
							option.middleName.substr(0, 1) +
							"."
						);
					}}
					onChange={onListChange}
					options={employees}
					renderInput={(params) => (
						<TextField
							variant="standard"
							{...params}
							label="Преподаватели"
						/>
					)}
				/>
			);
		}
	};

	const addEmployee = () => {
		if (employee2add) {
			group.employees.push(employee2add);
			setGroup({ ...group });
			setEmployee2add(null);
		}
	};

	const addExtraEmployee = () => {
		if (extraEmployee2add.trim() !== "") {
			group.extraEmployees.push(extraEmployee2add);
			setGroup({ ...group });
			setExtraEmployee2add("");
		}
	};

	const handleExtraInput = (e) => {
		setExtraEmployee2add(e.target.value);
	};

	const deleteExtraEmployee = (e) => {
		const id = parseInt(e.currentTarget.dataset.index);
		group.extraEmployees.splice(id, 1);
		setGroup({ ...group });
	};

	const deleteEmployee = (e) => {
		const id = parseInt(e.currentTarget.dataset.id);
		const filtered = group.employees.filter((e) => e.employeeId !== id);
		group.employees = filtered;
		setGroup({ ...group });
	};

	return (
		<div className={openClass}>
			<div className="modal" style={{ overflow: "visible" }}>
				<div className="modal-header">
					<div className="name">
						Редактирование {controls[props.control]}
					</div>
					<IconButton onClick={closeModal}>
						<CloseRounded />
					</IconButton>
				</div>
				<div className="modal-content">
					<p style={{ marginTop: 0 }}>
						{props.disciplineName} ({props.chairName})
					</p>
					<p style={{ marginTop: 0 }}>
						Группа <strong>{group.groupName}</strong>
					</p>
					<Grid container spacing={2}>
						<Grid item md={6} sm={12}>
							<strong>Штатные сотрудники</strong>
							<div
								style={{
									display: "flex",
									alignItems: "flex-end",
								}}
							>
								{autocompleteControl()}
								<Tooltip
									placement="top"
									title="Добавить штатного сотрудника"
								>
									<IconButton onClick={addEmployee}>
										<AddRounded />
									</IconButton>
								</Tooltip>
							</div>
							<TableContainer sx={{ minHeight: 200 }}>
								<Table size="small">
									{group.employees.map((e, index) => (
										<TableRow key={index}>
											<TableCell>
												{e.lastName}{" "}
												{e.firstName.substr(0, 1)}.{" "}
												{e.middleName.substr(0, 1)}.
											</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												<Tooltip placement="top">
													<IconButton
														onClick={deleteEmployee}
														data-id={e.employeeId}
													>
														<DeleteRounded />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									))}
								</Table>
							</TableContainer>
						</Grid>
						<Grid item md={6} sm={12}>
							<p style={{ margin: 0 }}>
								<strong>Внештатные сотрудники</strong>
							</p>
							<div
								style={{
									display: "flex",
									alignItems: "flex-end",
								}}
							>
								<TextField
									fullWidth
									value={extraEmployee2add}
									onChange={handleExtraInput}
									variant="standard"
									label="ФИО преподавателя"
								/>
								<Tooltip
									placement="top"
									title="Добавить внештатного сотрудника"
								>
									<IconButton onClick={addExtraEmployee}>
										<AddRounded />
									</IconButton>
								</Tooltip>
							</div>
							<TableContainer sx={{ minHeigth: 200 }}>
								<Table size="small">
									{group.extraEmployees.map((e, index) => (
										<TableRow key={index}>
											<TableCell>{e}</TableCell>
											<TableCell
												sx={{ textAlign: "right" }}
											>
												<IconButton
													data-index={index}
													onClick={
														deleteExtraEmployee
													}
												>
													<DeleteRounded />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
				</div>
				<div className="modal-footer">
					<span></span>
					<Button variant="text" onClick={handleSave}>
						Сохранить
					</Button>
				</div>
			</div>
		</div>
	);
}

export default GroupModal;
