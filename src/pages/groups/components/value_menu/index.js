import {
	Divider,
	MenuList,
	MenuItem,
	Tooltip,
	Button,
	ToggleButtonGroup,
	ToggleButton,
	ThemeProvider,
} from "@mui/material";
import { EMenuType } from "./interfaces";
import { useState, useEffect } from "react";
import { Popper } from "@mui/base";
import "./styles.scss";
import toggleTheme from "../../../../components/toggleTheme";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { CheckRounded } from "@mui/icons-material";
import { IconButton, Snackbar } from "@mui/material";

export default function ValueMenu(props) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [value, setValue] = useState(5);
	const [open, setOpen] = useState(false);
	const [type, setType] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	useEffect(() => {
		setType(props.name || "");
		if (props.value > 0) {
			setValue(props.value);
		} else {
			setValue(5);
		}
	}, [props.name, props.value]);

	useEffect(() => {}, [anchorEl]);

	const valueTypes = [
		"Тестирование",
		"Лабораторная работа",
		"Контрольная работа",
		"Расчётно-графическая работа",
		"Домашняя работа",
		"Другое",
	];

	// Сохранение оценки
	const handleSubmit = () => {
		if (!type || !value) {
			setSnackbarMessage("Выберите оценку и тип оценки");
			setSnackbarOpen(true);

			// Закрываем toast через 2 секунды
			setTimeout(() => {
				setSnackbarOpen(false);
			}, 2000);
			return;
		}
		setAnchorEl(null);
		setOpen(false);
		props.changeHandler(
			props.sectionId,
			props.studentId,
			props.valueId,
			value,
			type
		);
	};

	// Открытие popup
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
		setTimeout(() => setOpen((prev) => !prev));
	};

	const handleType = (e) => {
		let val = e.currentTarget.textContent;
		if (e.currentTarget.textContent !== null) {
			val = val?.trim();
		}
		setType(val);
	};

	const removeHandler = () => {
		props.removeHandler?.(props.sectionId, props.studentId, props.valueId);
		setOpen(false);
	};

	const handleClickAway = (e) => {
		setOpen(false);
	};

	const handleValue = (e, newVal) => {
		if (newVal !== null) setValue(newVal);
	};

	const Header = () => {
		switch (props.type) {
			case EMenuType.UPDATE:
				return <div className="menu-header">Изменить оценку</div>;
			default:
				return <div className="menu-header">Новая оценка</div>;
		}
	};

	const menuitem = (text, index) => {
		let icon =
			type === text ? (
				<CheckRounded sx={{ marginRight: "10px" }} />
			) : (
				<CheckRounded
					key={index}
					sx={{ color: "transparent", marginRight: "10px" }}
				/>
			);
		return (
			<MenuItem key={index} onClick={handleType}>
				{icon} {text}
			</MenuItem>
		);
	};

	let tooltip =
		props.type === EMenuType.CREATE ? "Добавить оценку" : props.name;

	let control = <></>;
	if (props.value) {
		switch (props.value) {
			case 5:
				control = (
					<IconButton
						color="success"
						onClick={handleClick}
						className="icon-button"
					>
						{props.content}
					</IconButton>
				);
				break;
			case 4:
				control = (
					<IconButton
						color="success"
						onClick={handleClick}
						className="icon-button"
					>
						{props.content}
					</IconButton>
				);
				break;
			case 3:
				control = (
					<IconButton
						color="warning"
						onClick={handleClick}
						className="icon-button"
					>
						{props.content}
					</IconButton>
				);
				break;
			case 2:
				control = (
					<IconButton
						color="error"
						onClick={handleClick}
						className="icon-button"
					>
						{props.content}
					</IconButton>
				);
				break;
			default:
				control = (
					<IconButton onClick={handleClick} className="icon-button">
						{props.content}
					</IconButton>
				);
				break;
		}
	}

	return (
		<>
			<Tooltip title={tooltip} placement="top">
				{control}
			</Tooltip>
			<ClickAwayListener onClickAway={handleClickAway}>
				<Popper
					id="placement-popper"
					open={open}
					anchorEl={anchorEl}
					placement="bottom-end"
				>
					<div className="popup-menu-wrapper">
						<Header />
						<Divider />
						<div className="value">
							<ThemeProvider theme={toggleTheme}>
								<ToggleButtonGroup
									exclusive
									value={value}
									onChange={handleValue}
								>
									<ToggleButton size="small" value={5}>
										5
									</ToggleButton>
									<ToggleButton size="small" value={4}>
										4
									</ToggleButton>
									<ToggleButton size="small" value={3}>
										3
									</ToggleButton>
									<ToggleButton size="small" value={2}>
										Неуд
									</ToggleButton>
								</ToggleButtonGroup>
							</ThemeProvider>
						</div>
						<div className="types">
							<MenuList>
								{valueTypes.map((el, index) => {
									return menuitem(el, index);
								})}
							</MenuList>
						</div>
						<Divider />
						<div className="actions">
							{props.type === EMenuType.UPDATE ? (
								<Button
									onClick={removeHandler}
									variant="text"
									sx={{ color: "red" }}
								>
									Удалить
								</Button>
							) : (
								<span></span>
							)}
							<Button onClick={handleSubmit}>Ок</Button>
						</div>
					</div>
				</Popper>
			</ClickAwayListener>
			<Snackbar
				open={snackbarOpen}
				message={snackbarMessage}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			/>
		</>
	);
}
