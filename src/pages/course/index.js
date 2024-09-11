import { Card, CardContent, Button, Tabs, Tab } from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import ErrorBanner from "../../components/error_banner";
import "./styles.scss";
import PageHeader from "../../components/pageHeader";
import CoursesTable from "./components/coursesTable";
import GroupsTable from "./components/groupsTable";
import { Link } from "react-router-dom";

/** Страница курсов  */
function CoursePage() {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [selectedTab, setSelectedTab] = useState("Список курсов");

	useEffect(() => {
		/**
		 * Функция получения данных
		 */
	}, []);

	// Заглушка - рыбные ошибки
	let message = "У вас есть незакрытые ведомости, пожалуйста, закройте их!";
	let errors = [
		"2 семестр 2017/2018 г.",
		"1 семестр 2018/2019 г.",
		"2 семестр 2018/2019 г.",
		"1 семестр 2022/2023 г.",
	];

	// Закрытие меню ошибок
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Обработчик клика меню ошибок
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	// Контрол со списком ошибок
	const errorControl = (
		<div className="actions">
			<Button
				variant="text"
				aria-controls={open ? "errors" : undefined}
				aria-expanded={open ? "true" : undefined}
				aria-haspopup="true"
				sx={{
					marginRight: "0 !important",
					backgroundColor: "#ffffffcc",
					color: "#FF1744",
					"&:hover": {
						backgroundColor: "#ffffffff",
					},
				}}
				onClick={handleClick}
			>
				Незакрытые ведомости
			</Button>
			<Menu
				id="errors"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					horizontal: "right",
					vertical: "top",
				}}
			>
				{errors.map((value, index) => {
					return (
						<MenuItem
							key={index}
							component={Link}
							to="/main/statements/common"
						>
							{value}
						</MenuItem>
					);
				})}
			</Menu>
		</div>
	);

	const switchTab = (e, newVal) => {
		setSelectedTab(newVal);
	};

	const mainControl = () => {
		switch (selectedTab) {
			case "Список курсов":
				return <CoursesTable />;
			case "Сводные группы":
				return <GroupsTable />;
			default:
				return <></>;
		}
	};

	// Рендер компонента
	return (
		<main id="courses">
			<section>
				<div className="container">
					<ErrorBanner message={message} control={errorControl} />
					<PageHeader header={selectedTab} />
					<Card>
						<CardContent>
							<Tabs
								className="screen"
								value={selectedTab}
								onChange={switchTab}
								variant="scrollable"
								sx={{ marginBottom: "20px" }}
							>
								<Tab
									value="Список курсов"
									label="Список курсов"
								/>
								<Tab
									value="Сводные группы"
									label="Сводные группы"
								/>
							</Tabs>
							{mainControl()}
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	);
}

export default CoursePage;
