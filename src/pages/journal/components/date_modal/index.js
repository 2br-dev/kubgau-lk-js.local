import { CloseRounded } from "@mui/icons-material";
import {
	Button,
	Grid,
	IconButton,
	Select,
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import React from "react";
import PropTypes from "prop-types";

DateModal.propTypes = {
	event: PropTypes.object,
	closeHandler: PropTypes.func,
	saveHandler: PropTypes.func,
	open: PropTypes.bool,
};

function DateModal(props) {
	const [event, setEvent] = useState({
		theme: "",
		date: dayjs("1 dec 1980"),
		pairNumber: 1,
		month: null,
		day: 0,
		id: null,
	});

	useEffect(() => {
		if (props.event) {
			if (props.event.date !== null) {
				let newEvent = {
					theme: props.event.theme,
					date: props.event.date,
					pairNumber: props.event.pairNumber,
					month: props.event.month,
					day: props.event.day,
					id: props.event.id,
				};
				setEvent(newEvent);
			}
		}
	}, [props.event]);

	const closeModal = () => {
		props.closeHandler();
	};

	const updatePair = (e, newVal) => {
		setEvent((prevEvent) => ({
			...prevEvent,
			pairNumber: parseInt(newVal.props.value),
		}));
	};

	const updateTheme = (e) => {
		setEvent((prevEvent) => ({ ...prevEvent, theme: e.target.value }));
	};

	const updateDate = (e) => {
		let newEvent = { ...event };
		newEvent.date = e;
		setEvent(newEvent);
	};

	const save = () => {
		props.saveHandler(event);
	};

	return (
		<div
			className={props.open ? "modal-wrapper open" : "modal-wrapper"}
			id="event"
		>
			<div className="modal">
				<div className="modal-content">
					<div className="modal-header">
						<div className="name">Редактирование занятия</div>
						<IconButton onClick={closeModal}>
							<CloseRounded />
						</IconButton>
					</div>
					<Grid container columnSpacing={2} rowSpacing={3}>
						<Grid item md={12}>
							<TextField
								onChange={updateTheme}
								value={event.theme}
								sx={{ width: "100%" }}
								variant="standard"
								label="Тема занятия"
							/>
						</Grid>
						<Grid item md={8}>
							<LocalizationProvider
								dateAdapter={AdapterDayjs}
								adapterLocale="ru"
							>
								<DatePicker
									value={event.date}
									format="D MMMM YYYY г."
									variant="standard"
									label="Дата занятия"
									sx={{ width: "100%" }}
									onChange={updateDate}
									slotProps={{
										textField: {
											variant: "standard",
										},
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item md={4}>
							<FormControl
								variant="standard"
								sx={{ width: "100%" }}
							>
								<InputLabel>Пара</InputLabel>
								<Select
									value={event.pairNumber}
									onChange={updatePair}
								>
									<MenuItem value="1">1 пара</MenuItem>
									<MenuItem value="2">2 пара</MenuItem>
									<MenuItem value="3">3 пара</MenuItem>
									<MenuItem value="4">4 пара</MenuItem>
									<MenuItem value="5">5 пара</MenuItem>
									<MenuItem value="6">6 пара</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				</div>
				<div className="modal-footer">
					<span />
					<Button variant="text" onClick={save}>
						Сохранить
					</Button>
				</div>
			</div>
		</div>
	);
}

export default DateModal;
