import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalLibraryRounded } from "@mui/icons-material";
import { Grid, Card, CardContent, TextField } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { EditRounded } from "@mui/icons-material";
import toggleTheme from "../../../../components/toggleTheme";
import "dayjs/locale/ru";
import "./styles.scss";
import React from "react";
import PropTypes from "prop-types";
import { Dayjs } from "dayjs";

GroupFilters.propTypes = {
	pairSetter: PropTypes.func,
	themeSetter: PropTypes.func,
	date: Dayjs,
	dateSetter: PropTypes.func,
	pair: PropTypes.number,
};

/**
 * Фильтры групп
 * @param props Параметры компонента
 * @returns React.Node
 */
function GroupFilters(props) {
	const handleSetPair = (e, pair) => {
		if (pair !== null) {
			props.pairSetter(pair);
		}
	};

	const handleSetTheme = (e) => {
		props.themeSetter(e.target.value);
	};

	return (
		<Card className="filters-card">
			<CardContent className="filters-card-content">
				<Grid container spacing={2}>
					<Grid item xl={5} lg={4} md={4} sm={6} xs={12}>
						<TextField
							onInput={handleSetTheme}
							sx={{ width: "100%" }}
							variant="standard"
							placeholder="Тема занятия"
							InputProps={{
								startAdornment: (
									<EditRounded sx={{ marginRight: "10px" }} />
								),
							}}
						/>
					</Grid>
					<Grid item lg={2} md={3} sm={6} xs={12}>
						<LocalizationProvider
							dateAdapter={AdapterDayjs}
							adapterLocale="ru"
						>
							<DatePicker
								sx={{ width: "100%" }}
								value={props.date}
								onChange={props.dateSetter}
								slotProps={{
									textField: {
										variant: "standard",
									},
								}}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xl={5} lg={6} md={5} sm={12} xs={12}>
						<div className="pair-setup">
							<div className="icon-block">
								<LocalLibraryRounded />
								<span>Пара</span>
							</div>
							<div className="buttons-wrapper">
								<ThemeProvider theme={toggleTheme}>
									<ToggleButtonGroup
										exclusive
										value={props.pair}
										onChange={handleSetPair}
									>
										<ToggleButton
											size="small"
											value={1}
											aria-label="1 пара"
										>
											1
										</ToggleButton>
										<ToggleButton
											size="small"
											value={2}
											aria-label="2 пара"
										>
											2
										</ToggleButton>
										<ToggleButton
											size="small"
											value={3}
											aria-label="3 пара"
										>
											3
										</ToggleButton>
										<ToggleButton
											size="small"
											value={4}
											aria-label="4 пара"
										>
											4
										</ToggleButton>
										<ToggleButton
											size="small"
											value={5}
											aria-label="5 пара"
										>
											5
										</ToggleButton>
										<ToggleButton
											size="small"
											value={6}
											aria-label="6 пара"
										>
											6
										</ToggleButton>
									</ToggleButtonGroup>
								</ThemeProvider>
							</div>
						</div>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}

export default GroupFilters;
