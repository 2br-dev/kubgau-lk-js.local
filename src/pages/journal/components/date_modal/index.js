import { CloseRounded } from "@mui/icons-material";
import { Button, Grid, IconButton, Select, TextField, MenuItem, FormControl, InputLabel, FormLabel } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

function DateModal(props){

	const [ event, setEvent ] = useState({
		theme: "",
		date: dayjs('1 dec 1980'),
		pair: '1'
	})

	useEffect(() => {
		if(props.event){
			let newEvent = JSON.parse(JSON.stringify({
				theme: props.event.theme,
				date: null,
				pair: props.event.pair
			}));
			newEvent.date = dayjs(new Date(props.event.date));
			setEvent(newEvent);
		}
	}, [props.event])

	const closeModal = () => {
		props.closeHandler();
	}

	const updatePair = (e, newVal) => {
		setEvent(prevEvent => ({ ...prevEvent, pair: newVal.props.value }));
	}

	const updateTheme = (e) => {

	}

	const updateDate = (e) => {
		let newEvent = {...event};
		newEvent.date = e;
		setEvent(newEvent);
	}

	return(		
		<div className={props.open ? "modal-wrapper open" : "modal-wrapper"} id="event">
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
							<TextField onChange={updateTheme} value={event.theme} sx={{width:"100%"}} variant="standard" label="Тема занятия" />
						</Grid>
						<Grid item md={8}>
							<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
								<DatePicker
									value={event.date}
									variant="standard"
									label="Дата занятия"
									sx={{width: '100%'}}
									onChange={updateDate}
									slotProps={{
										textField: {
											variant: "standard"
										}
									}}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item md={4}>
							<FormControl variant="standard" sx={{width: '100%'}}>
								<InputLabel>Пара</InputLabel>
								<Select value={event.pair} onChange={updatePair}>
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
					<Button variant="text" sx={{color: 'red'}}>Удалить</Button>
					<Button variant="text">Сохранить</Button>
				</div>
			</div>
		</div>
	)
}

export default DateModal;