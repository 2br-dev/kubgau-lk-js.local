import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Button,
	Grid,
	InputLabel,
	FormControl,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

TimingModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
	courseData: PropTypes.object,
};

function TimingModal(props) {
	const [course, setCourse] = useState({
		courseName: "",
		courseId: null,
		sessionId: null,
		checksStartDate: null,
		checksEndDate: null,
		examsStartDate: null,
		examsEndDate: null,
		holidaysStartDate: null,
		holidaysEndDate: null,
		disciplines: [],
	});

	const dateControl = (
		label,
		startDate,
		endDate,
		startHandler,
		endHandler,
	) => {
		const start = dayjs(startDate);
		const end = dayjs(endDate);

		return (
			<Grid container alignItems="baseline" sx={{ marginBottom: "20px" }}>
				<Grid item lg={3}>
					<span
						style={{
							display: "block",
							transform: "translateY(25px)",
						}}
					>
						{label}
					</span>
				</Grid>
				<Grid item lg={9}>
					<Grid container spacing={2}>
						<Grid item lg={6}>
							<LocalizationProvider
								dateAdapter={AdapterDayjs}
								adapterLocale="ru"
							>
								<InputLabel>Дата начала</InputLabel>
								<FormControl fullWidth>
									<DatePicker
										size="small"
										fullWidth
										value={start}
										onChange={startHandler}
										slotProps={{
											textField: {
												variant: "standard",
												fullWidth: true,
											},
										}}
									/>
								</FormControl>
							</LocalizationProvider>
						</Grid>
						<Grid item lg={6}>
							<LocalizationProvider
								dateAdapter={AdapterDayjs}
								adapterLocale="ru"
							>
								<InputLabel>Дата окончания</InputLabel>
								<FormControl fullWidth>
									<DatePicker
										size="small"
										fullWidth
										value={end}
										onChange={endHandler}
										slotProps={{
											textField: {
												variant: "standard",
												fullWidth: true,
											},
										}}
									/>
								</FormControl>
							</LocalizationProvider>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	useEffect(() => {
		setCourse({ ...props.courseData });
	}, [props.courseData]);

	const testStartHandler = (e) => {
		const date = e.$d;
		course.checksStartDate = date.toString();
		setCourse({ ...course });
	};

	const testEndHandler = (e) => {
		const date = e.$d;
		course.checksEndDate = date.toString();
		setCourse({ ...course });
	};

	const examsStartHandler = (e) => {
		const date = e.$d;
		course.examsStartDate = date.toString();
		setCourse({ ...course });
	};

	const examsEndHandler = (e) => {
		const date = e.$d;
		course.examsEndDate = date.toString();
		setCourse({ ...course });
	};

	const holidaysStartHandler = (e) => {
		const date = e.$d;
		course.holidaysStartDate = date.toString();
		setCourse({ ...course });
	};

	const holidaysEndHandler = (e) => {
		const date = e.$d;
		course.holidaysEndDate = date.toString();
		setCourse({ ...course });
	};

	const handleSave = () => {
		props.onSave(course);
	};

	const openClass = props.isOpen ? "modal-wrapper open" : "modal-wrapper";

	return (
		<div className={openClass}>
			<div className="modal" style={{ maxWidth: "800px" }}>
				<div className="modal-header">
					<div className="name">Редактирование расписания</div>
					<IconButton onClick={props.onClose}>
						<CloseRounded />
					</IconButton>
				</div>
				{dateControl(
					"Зачётная неделя",
					course.checksStartDate,
					course.checksEndDate,
					testStartHandler,
					testEndHandler,
				)}
				{dateControl(
					"Экзамены",
					course.examsStartDate,
					course.examsEndDate,
					examsStartHandler,
					examsEndHandler,
				)}
				{dateControl(
					"Каникулы",
					course.holidaysStartDate,
					course.holidaysEndDate,
					holidaysStartHandler,
					holidaysEndHandler,
				)}
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

export default TimingModal;
