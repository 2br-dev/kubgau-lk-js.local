import React from "react";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import ReactTransitionCollapse from "react-transition-collapse";
import { AccessTime, ExpandMoreRounded } from "@mui/icons-material";

MobileTable.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.object),
	handleGroupClick: PropTypes.func,
	handleSubgroupClick: PropTypes.func,
	handleJournalClick: PropTypes.func,
	editHandler: PropTypes.func,
};

function MobileTable(props) {
	const currentUser = JSON.parse(localStorage.getItem("loggedUser"));
	const [list, setList] = useState([]);

	useEffect(() => {
		let courses = props.courses;
		courses.forEach((c) => {
			if (c.lections) {
				c.lections.isOpen = false;
			}
			if (c.seminars) {
				c.seminars.isOpen = false;
			}
			if (c.labs) {
				c.labs.isOpen = false;
			}
		});
		setList(courses);
	}, [props.courses]);

	const toggle = (e) => {
		const block = e.currentTarget.dataset.block;
		const index = parseInt(e.currentTarget.dataset.index);

		let _courses = [...list];
		switch (block) {
			case "Лекции":
				_courses[index].lections.isOpen =
					!_courses[index].lections.isOpen;
				break;
			case "Семинары":
				_courses[index].lections.isOpen =
					!_courses[index].seminars.isOpen;
				break;
			case "Лабораторные работы":
				_courses[index].labs.isOpen = !_courses[index].labs.isOpen;
				break;
			default:
				_courses[index].labs.isOpen = false;
				_courses[index].lections.isOpen = false;
				_courses[index].seminars.isOpen = false;
				break;
		}

		setList(_courses);
	};

	const courseNameStyles = {
		padding: "12px 0",
		fontWeight: "bold",
		fontSize: "18px",
		lineHeight: "1.2em",
		paddingTop: "40px",
	};

	const groupStyles = {
		paddingBottom: "12px",
		borderBottom: "1px solid #d1d1d1",
	};

	const headerStyles = {
		padding: "12px 0",
		borderTop: "1px solid #d1d1d1",
		borderBottom: "1px solid #d1d1d1",
		display: "flex",
		justifyContent: "space-between",
	};

	const chipContainerStyles = {
		padding: "20px 0",
	};

	const editButton = (index) => {
		return currentUser.role === "cathedra" ? (
			<Button data-id={index} onClick={props.editHandler}>
				Редактировать
			</Button>
		) : null;
	};

	const block = (title, block, isInteractive, index) => {
		if (!block) return <></>;

		const content = (
			<div className="content" style={groupStyles}>
				<div className="checkin-wrapper" style={{ margin: "12px 0" }}>
					{!isInteractive ? (
						<Button
							variant="outlined"
							size="small"
							fullWidth
							onClick={props.handleGroupClick}
						>
							Перекличка
						</Button>
					) : null}
				</div>
				<div style={chipContainerStyles}>
					{block.list?.map((c, cindex) => {
						const current = !isInteractive
							? block.current
							: c.current;
						const total = !isInteractive ? block.total : c.total;
						const label = (
							<>
								<span>{isInteractive ? c.group : c} </span>
								<AccessTime
									fontSize="14px"
									sx={{ margin: "0 4px" }}
								/>
								<span>
									{current}/{total}{" "}
								</span>
							</>
						);

						return (
							<Chip
								key={cindex}
								label={label}
								variant="outlined"
								onClick={
									isInteractive
										? props.handleGroupClick
										: null
								}
								color={isInteractive ? "primary" : "default"}
								sx={{
									marginRight: "6px",
									marginBottom: "6px",
								}}
							/>
						);
					})}
				</div>
				<div>
					<ButtonGroup orientation="vertical" fullWidth>
						<Button>Список тем</Button>
						<Button onClick={props.handleJournalClick}>
							Журнал
						</Button>
						<Button onClick={props.handleSubgroupClick}>
							Подгруппы
						</Button>
						{editButton(index)}
					</ButtonGroup>
				</div>
			</div>
		);

		return (
			<div className="block">
				<div
					className="header"
					style={headerStyles}
					data-block={title}
					data-index={index}
					onClick={toggle}
				>
					<span>{title}</span>
					<ExpandMoreRounded
						sx={{
							transition: "transform .4s",
							transform: block.isOpen ? "rotate(180deg)" : "none",
						}}
					/>
				</div>
				<ReactTransitionCollapse duration={400} expanded={block.isOpen}>
					{content}
				</ReactTransitionCollapse>
			</div>
		);
	};

	return (
		<div className="data-wrapper mobile">
			{list.map((course, index) => {
				return (
					<div className="course-block" key={index}>
						<div className="courseName" style={courseNameStyles}>
							{course.name}
						</div>
						{block("Лекции", course.lections, false, index)}
						{block("Семинары", course.seminars, true, index)}
						{block("Лабораторные работы", course.labs, true, index)}
					</div>
				);
			})}
		</div>
	);
}

export default MobileTable;
