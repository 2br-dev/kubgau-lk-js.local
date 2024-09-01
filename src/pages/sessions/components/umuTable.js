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
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Fragment } from "react";
import indicator from "./indicator";
import formatRange from "../../../components/formatDate";
import ActionControl from "./actionControl";
import { useNavigate, Link } from "react-router-dom";

UMUTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function UMUTable(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

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

	const facultyHeader = (f) => {
		const isEmpty =
			f.disciplines.filter((d) => d.sessions.length > 0).length === 0;

		const style = {
			marginBottom: 0,
			marginTop: "2em",
			textTransform: "uppercase",
		};

		if (!isEmpty) {
			return (
				<TableRow>
					<TableCell colSpan={7}>
						<h3 style={style}>{f.name}</h3>
					</TableCell>
				</TableRow>
			);
		}
	};

	const disciplineHeader = (d) => {
		const style = {
			margin: ".5em 0",
			color: "#777",
		};

		return (
			<TableRow>
				<TableCell style={style} colSpan={7}>
					<h4 style={style}>{d.discipline}</h4>
				</TableCell>
			</TableRow>
		);
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
		return sessions.map((s, index) => (
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
				<TableCell sx={{ whiteSpace: "nowrap", textAlign: "right" }}>
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
		));
	};

	const tableBody = () => {
		return (
			<TableBody>
				{props.data.map((f, index) => {
					if (f.disciplines.length) {
						return (
							<Fragment key={index}>
								{facultyHeader(f)}
								{f.disciplines.map((d, dindex) => {
									if (d.sessions.length > 0) {
										return (
											<Fragment key={dindex}>
												{disciplineHeader(d)}
												{UMURows(
													d.sessions,
													dindex,
													index,
												)}
											</Fragment>
										);
									}
									return <></>;
								})}
							</Fragment>
						);
					}
					return <Fragment key={index}></Fragment>;
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
