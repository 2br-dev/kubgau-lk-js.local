import { ChevronLeftRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import InfoPanel from "../../components/info_panel";
import { InfoClass } from "../../components/info_panel/interfaces";
import { useState, useEffect } from "react";
import { Box, Tabs, Tab, Checkbox, FormControlLabel } from "@mui/material";
import StatementEntry from "./components/statement-entry";
import React from "react";
import { useParams } from "react-router-dom";

/**
 * Список ведомостей
 */
function StatementsPage() {
	const [panelOpened, setPanelOpened] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [openOnly, setOpenOnly] = useState(false);
	const navigate = useNavigate();

	// Тип ведомости, указанный в URL, сюда же по хорошему нужно передать ID ведомости
	const { type } = useParams();
	const location = useLocation();

	// Отработка кнопки "Назад"
	const back = () => {
		navigate(-1);
	};

	/**
	 * Установка состояния панели
	 * @param {Boolean} value Состояние панели (открыта - true, закрыта - false)
	 * @param {string} id Идентификатор панели для сохранения в localStorage
	 */
	const setter = (value, id) => {
		let state = {
			panelId: id,
			opened: value,
		};

		let stateString = JSON.stringify(state);
		localStorage.setItem("panelState", stateString);
		setPanelOpened(value);
	};

	/**
	 * Фильтрация основных данных
	 * @param {*} data Данные для фильтрации
	 * @param {*} typeId Выбранная вкладка
	 * @returns
	 */
	const filterMainData = (data, tabValue, openFilter) => {
		let output = data.filter(
			(discipline) => discipline.controlTypeId === tabValue,
		);

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
	};

	/**
	 * Фильтрация данных по практике
	 * @param {*} data Данные для фильтрации
	 * @param {*} typeId Выбранная вкладка
	 * @returns
	 */
	const filterPracticeData = (data, typeId) => {
		let newData;
		switch (typeId) {
			case 0:
				newData = data.map((discipline) => {
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
				break;
			case 1:
				newData = data.map((discipline) => {
					return {
						sessionDisciplineId: discipline.sessionDisciplineId,
						disciplineName: discipline.disciplineName,
						chairName: discipline.chairName,
						controlTypeId: discipline.controlTypeId,
						details: discipline.details.filter((d) => {
							return d.closingDate !== null;
						}),
					};
				});
				break;
			default:
				newData = [];
				break;
		}

		return newData;
	};

	/**
	 * Монтирование компонента
	 */
	useEffect(() => {
		setTabValue(0);
		/**
		 * Получение данных при загрузке компонента
		 */
		const dataFetch = () => {
			const url =
				type === "common"
					? "/data/employeeStatements.json"
					: "/data/employeePracticeStatements.json";

			fetch(url)
				.then((res) => res.json())
				.then((responseData) => {
					setData(responseData.disciplines);
					switch (type) {
						case "common":
							setFilteredData(
								filterMainData(
									responseData.disciplines,
									0,
									tabValue,
								),
							);
							break;
						case "practice":
							setFilteredData(
								filterPracticeData(
									responseData.disciplines,
									0,
									tabValue,
								),
							);
							break;
						default:
							setFilteredData(responseData.disciplines);
							break;
					}
				})
				.catch((err) => console.error(err));
		};

		// Состояние информационной панели
		let stateString = localStorage.getItem("panelState");

		// Чтение состояния информационной панели из localStorage
		if (stateString) {
			let state = JSON.parse(stateString);
			setter(state.opened, state.panelId);
		} else {
			setter(true, "statement-page-info");
		}

		// Вызов функции получения данных
		dataFetch();
		// eslint-disable-next-line
	}, [location, type]);

	useEffect(() => {
		switch (type) {
			case "common":
				setFilteredData(filterMainData(data, tabValue, openOnly));
				break;
			case "practice":
				setFilteredData(filterPracticeData(data, tabValue, openOnly));
				break;
			default:
				setFilteredData(data);
		}
		// eslint-disable-next-line
	}, [tabValue, openOnly]);

	/**
	 * Обработчик переключения вкладок
	 * @param event Событие
	 * @param newValue Новый индекс вкладки
	 */
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	// Отображаемые вкладки
	const tabs = () => {
		switch (type) {
			case "common":
				return [
					<Tab key={1} label="Зачёты" value={0} />,
					<Tab key={2} label="Курсовые работы" value={1} />,
					<Tab key={3} label="Экзамены" value={2} />,
				];
			case "practice":
				return [
					<Tab key={1} label="Открытые" value={0} />,
					<Tab key={2} label="Закрытые" value={1} />,
				];
			default:
				return <></>;
		}
	};

	const handleChangeOpen = (e) => {
		setOpenOnly(e.target.checked);
		setFilteredData(filterMainData(data, tabValue, e.target.checked));
	};

	// Фильтр на открытые ведомости
	const openFilters = () => {
		if (type === "common") {
			return (
				<FormControlLabel
					className="open-only"
					control={<Checkbox />}
					label="Только открытые"
					checked={openOnly}
					onChange={handleChangeOpen}
				/>
			);
		}
		return <></>;
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
						open={panelOpened}
						type={InfoClass.INFO}
						setter={setter}
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
								{tabs()}
							</Tabs>
							{openFilters()}
						</Box>
						<Box sx={{ marginTop: "1vmax" }}>
							<StatementEntry
								data={filteredData}
								type={type}
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
