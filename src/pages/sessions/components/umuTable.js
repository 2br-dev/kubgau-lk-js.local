import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Menu,
	MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Fragment } from "react";
import indicator from "./indicator";
import formatRange from "../../../components/formatDate";
import ActionControl from "./actionControl";
import { useNavigate, Link } from "react-router-dom";
import { AddRounded } from "@mui/icons-material";

UMUTable.propTypes = {
	faculty: PropTypes.number,
	requestsOnly: PropTypes.bool,
	onLoad: PropTypes.func,
};

function UMUTable(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	useEffect(() => {
		fetch("/data/umu_sessions.json")
			.then((res) => res.json())
			.then((response) => {
				const groupedData = groupUMUData(response.data);
				setData(groupedData);
				const filteredData = filterUMUData(null, null, groupedData);
				setFilteredData(filteredData);
				props.onLoad([...groupedData]);
			});
	}, [props.faculty, props.requestsOnly]);

	const groupUMUData = (data) => {
		const faculties = data.map((f) => {
			let groups = f.sessions.map((s) => {
				return s.programOfEducationName;
			});

			const groupsUnique = [...new Set(groups)];
			const disciplines = [];

			groupsUnique.forEach((group) => {
				disciplines.push({
					discipline: group,
					sessions: f.sessions.filter(
						(s) => s.programOfEducationName === group,
					),
				});
			});

			return {
				name: f.facultyName,
				id: f.facultyId,
				disciplines: disciplines,
				isOpen: false,
				isEmpty: f.sessions.length === 0,
			};
		});
		return faculties.filter((f) => !f.isEmpty);
	};

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCreate = (e) => {
		let courseId = parseInt(e.target.dataset.course);
		navigate(`/main/create-session/${courseId}`);
	};

	const tableHeader = () => (
		<TableHead>
			<TableRow>
				<TableCell></TableCell>
				<TableCell>Курс</TableCell>
				<TableCell>Группа</TableCell>
				<TableCell>Зачётная неделя</TableCell>
				<TableCell>Экзамены</TableCell>
				<TableCell>Каникулы</TableCell>
				<TableCell sx={{ textAlign: "right" }}>Действия</TableCell>
			</TableRow>
		</TableHead>
	);

	const toggleFaculty = (e) => {
		if (props.faculty !== 0 && props.faculty !== null) return;
		let facultyId = parseInt(e.currentTarget.dataset.id);
		toggler(facultyId);
	};

	const toggler = (id) => {
		let faculty = filteredData.filter((f) => f.id === id)[0];
		faculty.isOpen = !faculty.isOpen;
		setFilteredData([...filteredData]);
	};

	const openIndicator = (f) => {
		const transform = f.isOpen ? "rotate(135deg)" : "none";
		if (props.faculty === 0 || props.faculty === null) {
			return (
				<AddRounded
					sx={{
						transition: "transform .4s",
						transform: transform,
					}}
				/>
			);
		}
	};

	const facultyHeader = (f) => {
		let style = {
			marginBottom: 0,
			marginTop: "2em",
			textTransform: "uppercase",
		};

		let rowStyle = {};

		if (props.faculty === 0 || props.faculty === null) {
			rowStyle = {
				cursor: "pointer",
				"&:hover": {
					color: "#1976d2",
				},
			};
		}

		return (
			<TableRow data-id={f.id} onClick={toggleFaculty}>
				<TableCell colSpan={7} sx={rowStyle}>
					<div
						className="header-wrapper"
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-end",
						}}
					>
						<h3 style={style}>{f.name}</h3>
						{openIndicator(f)}
					</div>
				</TableCell>
			</TableRow>
		);
	};

	const disciplineHeader = (d) => {
		const style = {
			margin: ".5em 0",
			color: "#777",
		};

		if (d.sessions.length > 0) {
			return (
				<TableRow>
					<TableCell style={style} colSpan={7}>
						<h4 style={style}>{d.discipline}</h4>
					</TableCell>
				</TableRow>
			);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const itemMenu = () => (
		<Menu
			onClose={handleClose}
			open={open}
			anchorEl={anchorEl}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
		>
			<MenuItem
				onClick={handleClose}
				component={Link}
				to="/main/session-details"
			>
				Подробные сведения
			</MenuItem>
			<MenuItem>Печать расписания</MenuItem>
			<MenuItem>Печать расписания пересдач</MenuItem>
		</Menu>
	);

	const UMURows = (sessions, disciplineIndex, facultyIndex) => {
		return sessions.map((s, index) => {
			return (
				<TableRow hover key={index}>
					<TableCell>{indicator(s)}</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{s.courseNumber}
					</TableCell>
					<TableCell>{s.groups.join(", ")}</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatRange(s.checksStartDate, s.checksEndDate)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatRange(s.examsStartDate, s.examsEndDate)}
					</TableCell>
					<TableCell sx={{ whiteSpace: "nowrap" }}>
						{formatRange(s.holidayStartDate, s.holidayEndDate)}
					</TableCell>
					<TableCell
						sx={{ whiteSpace: "nowrap", textAlign: "right" }}
					>
						<ActionControl
							item={s}
							groupIndex={disciplineIndex}
							itemIndex={index}
							facultyIndex={facultyIndex}
							handleClick={handleClick}
							handleCreate={handleCreate}
						/>
					</TableCell>
				</TableRow>
			);
		});
	};

	const filterUMUData = (
		facultyId = null,
		requests = null,
		inputData = null,
	) => {
		const umuData = inputData ?? data;
		let _data = JSON.parse(JSON.stringify(umuData));
		facultyId = facultyId ?? props.faculty;
		requests = requests ?? props.requestsOnly;
		let filtered = [];
		filtered = _data.filter((item) => {
			if (requests === true) {
				item.disciplines.forEach((d) => {
					d.sessions = d.sessions.filter(
						(s) => s.approveStatus === 1,
					);
				});
			}
			if (parseInt(facultyId) !== 0 && facultyId !== null) {
				return item.id === parseInt(facultyId);
			} else {
				return true;
			}
		});
		return filtered;
	};

	const conditionalRows = (f, index) => {
		let allEmpty = true;

		f.disciplines.forEach((d) => {
			if (d.sessions.length > 0) {
				allEmpty = false;
			}
		});

		if (!allEmpty) {
			return f.disciplines.map((d, dindex) => {
				if (d.sessions.length > 0) {
					if (
						((props.faculty === 0 || props.faculty === null) &&
							f.isOpen) ||
						(props.faculty !== 0 && props.faculty !== null)
					) {
						return (
							<Fragment key={dindex}>
								{disciplineHeader(d)}
								{UMURows(d.sessions, dindex, index)}
							</Fragment>
						);
					}
				} else {
					return <Fragment key={index} />;
				}
			});
		}

		if (f.isOpen || (props.faculty !== 0 && props.faculty !== null)) {
			return (
				<TableRow key={index}>
					<TableCell sx={{ padding: "10px 15px" }} colSpan={7}>
						Нет данных
					</TableCell>
				</TableRow>
			);
		}
	};

	const tableBody = () => {
		return (
			<TableBody>
				{filteredData.map((f, index) => {
					return (
						<Fragment key={index}>
							{facultyHeader(f)}
							{conditionalRows(f, index)}
						</Fragment>
					);
				})}
			</TableBody>
		);
	};

	return (
		<>
			<TableContainer>
				<Table className="simple-table" size="small">
					{tableHeader()}
					{tableBody()}
				</Table>
			</TableContainer>
			{itemMenu()}
		</>
	);
}

export default UMUTable;
