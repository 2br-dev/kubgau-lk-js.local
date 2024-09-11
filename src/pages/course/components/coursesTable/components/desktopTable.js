import React from "react";
import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
	ButtonGroup,
	Chip,
} from "@mui/material";
import PropTypes from "prop-types";
import { Fragment } from "react";
import { AccessTime } from "@mui/icons-material";

DesktopTable.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.object),
	handleGroupClick: PropTypes.func,
	handleSubgroupClick: PropTypes.func,
	handleJournalClick: PropTypes.func,
	editHandler: PropTypes.func,
};

function DesktopTable(props) {
	const currentUser = JSON.parse(localStorage.getItem("loggedUser"));

	const groups = (set, isInteractive) => {
		return set.list.map((el, index) => {
			const current = isInteractive ? el.current : set.current;
			const total = isInteractive ? el.total : set.total;

			const label = (
				<>
					<span>{isInteractive ? el.group : el} </span>
					<AccessTime fontSize="14px" sx={{ margin: "0 4px" }} />
					<span>
						{current}/{total}{" "}
					</span>
				</>
			);

			if (!isInteractive) {
				return (
					<Chip
						key={index}
						label={label}
						size="small"
						variant="outlined"
						sx={{ marginRight: "6px", marginBottom: "6px" }}
					/>
				);
			} else {
				return (
					<Chip
						key={index}
						label={label}
						variant="outlined"
						size="small"
						color="primary"
						onClick={props.handleGroupClick}
						sx={{
							marginRight: "6px",
							marginBottom: "6px",
							display: "inline-flex",
							alignItems: "center",
						}}
					/>
				);
			}
		});
	};

	const courseRow = (name, set, isInteractive, index) => {
		if (!set) return <></>;
		const runButton = !isInteractive ? (
			<Button
				variant="outlined"
				size="small"
				onClick={props.handleGroupClick}
			>
				Перекличка
			</Button>
		) : null;
		const editButton =
			currentUser.role === "cathedra" ? (
				<Button data-id={index} onClick={props.editHandler}>
					Редактировать
				</Button>
			) : null;
		if (set.list.length) {
			return (
				<TableRow>
					<TableCell>
						<div>{name}</div>
						<div style={{ marginTop: "10px" }}>{runButton}</div>
					</TableCell>
					<TableCell>{groups(set, isInteractive)}</TableCell>
					<TableCell>
						<ButtonGroup
							orientation="vertical"
							variant="outlined"
							size="small"
						>
							<Button>Список тем</Button>
							<Button onClick={props.handleJournalClick}>
								Журнал
							</Button>
							<Button onClick={props.handleSubgroupClick}>
								Подгруппы
							</Button>
							{editButton}
						</ButtonGroup>
					</TableCell>
				</TableRow>
			);
		}
	};

	return (
		<TableContainer>
			<Table
				className="simple-table screen desktop"
				sx={{
					borderSpacing: 0,
					borderCollapse: "collapse",
				}}
				aria-label="simple table"
			>
				<TableHead>
					<TableRow>
						<TableCell>Тип занятия</TableCell>
						<TableCell>Группы</TableCell>
						<TableCell>Действия</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.courses.map((c, cindex) => {
						return (
							<Fragment key={cindex}>
								<TableRow>
									<TableCell colSpan={3}>
										<h3
											style={{
												marginBottom: 0,
											}}
										>
											{c.name}{" "}
											<span
												style={{
													fontWeight: "normal",
												}}
											>
												({c.course})
											</span>
										</h3>
									</TableCell>
								</TableRow>
								{courseRow("Лекции", c.lections, false, cindex)}
								{courseRow(
									"Семинары",
									c.seminars,
									true,
									cindex,
								)}
								{courseRow(
									"Лабораторные работы",
									c.labs,
									true,
									cindex,
								)}
							</Fragment>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default DesktopTable;
