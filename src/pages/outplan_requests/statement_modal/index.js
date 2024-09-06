import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Grid,
	IconButton,
	TextField,
	FormControl,
	InputLabel,
	Button,
} from "@mui/material";
import { CloseRounded } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

StatementModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

function StatementModal(props) {
	const className = props.isOpen ? "modal-wrapper open" : "modal-wrapper";

	const [orderNum, setOrderNum] = useState("");
	const [statementNum, setStatementNum] = useState("");
	const [date, setDate] = useState(null);

	const handleNumChange = (e) => {
		setOrderNum(e.target.value);
	};

	const handleDateChange = (e) => {
		setDate(e);
	};

	const handleStatementChange = (e) => {
		setStatementNum(e.target.value);
	};

	return (
		<div className={className} style={{ zIndex: 200 }}>
			<div className="modal">
				<div className="modal-header">
					<div className="name">Создание ведомости</div>
					<IconButton onClick={props.onClose}>
						<CloseRounded />
					</IconButton>
				</div>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							value={statementNum}
							variant="standard"
							onChange={handleStatementChange}
							label="Номер ведомости"
						/>
					</Grid>
					<Grid item xs={12}>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale="ru"
						>
							<InputLabel>Дата/время</InputLabel>
							<FormControl fullWidth>
								<DatePicker
									size="small"
									fullWidth
									value={date}
									onChange={handleDateChange}
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
					<Grid item sm={12}>
						<TextField
							value={orderNum}
							fullWidth
							variant="standard"
							label="Номер распоряжения"
							onChange={handleNumChange}
						/>
					</Grid>
				</Grid>
				<div className="modal-footer">
					<span></span>
					<Button variant="text">Сохранить</Button>
				</div>
			</div>
		</div>
	);
}

export default StatementModal;
