import { ChevronLeftRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InfoPanel from "../../components/info_panel";
import { InfoClass } from "../../components/info_panel/interfaces";
import { useState, useEffect, useCallback } from "react";
import { Box, Tabs, Tab, Checkbox, FormControlLabel } from "@mui/material";
import StatementEntry from "./components/statement-entry";
import React from "react";

/**
 * Список ведомостей
 */
function StatementsPage() {
	const [tabValue, setTabValue] = useState(0);
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [openOnly, setOpenOnly] = useState(false);
	const navigate = useNavigate();

	// Тип ведомости, указанный в URL, сюда же по хорошему нужно передать ID ведомости

	// Отработка кнопки "Назад"
	const back = () => {
		navigate(-1);
	};

	/**
	 * Установка состояния панели
	 * @param {Boolean} value Состояние панели (открыта - true, закрыта - false)
	 * @param {string} id Идентификатор панели для сохранения в localStorage
	 */

	/**
	 * Фильтрация основных данных
	 * @param {*} data Данные для фильтрации
	 * @param {*} typeId Выбранная вкладка
	 * @returns
	 */
	const filterMainData = useCallback(
		(data, tab_value, openFilter) => {
			if (!tab_value) tab_value = tabValue;
			let output = data.filter((discipline) => {
				return discipline.controlTypeId === tab_value;
			});

			if (openFilter) {
				output = output.map((discipline) => {
					return {
						sessionDisciplineId: discipline.sessionDisciplineId,
						disciplineName: discipline.disciplineName,
						chairName: discipline.chairName,
						controlTypeId: discipline.controlTypeId,
						details: discipline.details.filter((d) => {
							return d.closingDate === null;
						}),
					};
				});
			}

			return output;
		},
		[tabValue],
	);

	/**
	 * Монтирование компонента
	 */
	useEffect(() => {
		fetch("/data/employeeStatements.json")
			.then((res) => res.json())
			.then((response) => {
				setData(response.disciplines);
				setFilteredData(filterMainData(response.disciplines));
			});
	}, [filterMainData]);

	useEffect(() => {
		setFilteredData(filterMainData(data, tabValue, openOnly));
	}, [tabValue, openOnly, filterMainData, data]);

	/**
	 * Обработчик переключения вкладок
	 * @param event Событие
	 * @param newValue Новый индекс вкладки
	 */
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleChangeOpen = (e) => {
		setOpenOnly(e.target.checked);
		setFilteredData(filterMainData(data, tabValue, e.target.checked));
	};

	// Рендер компонента
	return (
		<main id="statements">
			<section>
				<div className="container">
					<div className="back-link screen">
						<a href="#!" onClick={back} className="icon-block">
							<ChevronLeftRounded />
							Назад
						</a>
						<span>Мои ведомости</span>
					</div>
					<InfoPanel
						id="statements-page-info"
						title="Внимание! (Из кодекса корпоративной этики Кубанского ГАУ)"
						message="Коррупцией считается злоупотребление служебным положением, дача взятки, получение взятки, злоупотребление полномочиями, коммерческий подкуп либо иное незаконное использование физическим лицом своего должностного положения вопреки законным интересам общества и государства в целях получения выгоды в виде денег, ценностей, иного имущества или услуг имущественного характера, иных имущественных прав для себя или для третьих лиц либо незаконное предоставление такой выгоды указанному лицу другими физическими лицами, а также совершение указанных деяний от имени или в интересах юридического лица. К коррупционным деяниям относятся следующие преступления: злоупотребление должностными полномочиями (ст. 285 УК РФ), дача взятки (ст. 291 УК РФ), получение взятки (ст. 290 УК РФ), посредничество во взяточничестве (ст. 291.1 УК РФ), мелкое взяточничество (ст. 291.2 УК РФ), злоупотребление полномочиями (ст. 201 УК РФ), коммерческий подкуп (ст. 204 УК РФ), а также иные деяния, попадающие под понятия «коррупция», указанное выше. За указанные преступления предусмотрено наказание вплоть до лишения свободы на срок до пятнадцати лет со штрафом в размере до семидесятикратной суммы взятки и с лишением права занимать определенные должности или заниматься определенной деятельностью на срок до пятнадцати лет."
						type={InfoClass.INFO}
					/>
					<Box sx={{ width: "100%", marginTop: "2vmax" }}>
						<Box
							sx={{ borderBottom: 1, borderColor: "divider" }}
							className="tabs-wrapper"
						>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
							>
								<Tab label="Зачёты" value={0} />
								<Tab label="Курсовые работы" value={1} />
								<Tab label="Экзамены" value={2} />
							</Tabs>
							<FormControlLabel
								className="open-only"
								control={<Checkbox />}
								label="Только открытые"
								checked={openOnly}
								onChange={handleChangeOpen}
							/>
						</Box>
						<Box sx={{ marginTop: "1vmax" }}>
							<StatementEntry
								data={filteredData}
								statementType={tabValue}
							/>
						</Box>
					</Box>
				</div>
			</section>
		</main>
	);
}

export default StatementsPage;
