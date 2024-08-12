import { ChevronLeftRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InfoPanel from "../../components/info_panel";
import { InfoClass } from "../../components/info_panel/interfaces";
import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import StatementEntry from "./components/statement-entry";
import React from "react";

/**
 * Страница ведомостей
 */
function StatementsPage() {
	const [panelOpened, setPanelOpened] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [data, setData] = useState(null);
	const navigate = useNavigate();

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

	// Заглушка – перечень локальных JSON
	const sources = [
		"/data/statements_tests.json",
		"/data/statements_courses.json",
		"/data/statements_exams.json",
	];

	/**
	 * Получение данных
	 * @param {number} tabIndex Индекс выбранной вкладки
	 */
	const dataFetch = (tabIndex) => {
		let sourceIndex = tabIndex === undefined ? tabValue : tabIndex;

		let source = sources[sourceIndex];

		fetch(source)
			.then((res) => res.json())
			.then((data) => setData(data));
	};

	/**
	 * Монтирование компонента
	 */
	useEffect(() => {
		/**
		 * Получение данных при загрузке компонента
		 */
		const dataFetch = () => {
			let source = "/data/statements_tests.json";

			fetch(source)
				.then((res) => res.json())
				.then((data) => setData(data));
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
	}, []);

	/**
	 * Обработчик переключения вкладок
	 * @param event Событие
	 * @param newValue Новый индекс вкладки
	 */
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
		dataFetch(newValue);
	};

	// Рендер компонента
	return (
		<main>
			<section>
				<div className="container">
					<a href="#!" onClick={back} className="icon-block">
						<ChevronLeftRounded /> Назад
					</a>
					<InfoPanel
						id="statements-page-info"
						title="Внимание! (Из кодекса корпоративной этики Кубанского ГАУ)"
						message="Коррупцией считается злоупотребление служебным положением, дача взятки, получение взятки, злоупотребление полномочиями, коммерческий подкуп либо иное незаконное использование физическим лицом своего должностного положения вопреки законным интересам общества и государства в целях получения выгоды в виде денег, ценностей, иного имущества или услуг имущественного характера, иных имущественных прав для себя или для третьих лиц либо незаконное предоставление такой выгоды указанному лицу другими физическими лицами, а также совершение указанных деяний от имени или в интересах юридического лица. К коррупционным деяниям относятся следующие преступления: злоупотребление должностными полномочиями (ст. 285 УК РФ), дача взятки (ст. 291 УК РФ), получение взятки (ст. 290 УК РФ), посредничество во взяточничестве (ст. 291.1 УК РФ), мелкое взяточничество (ст. 291.2 УК РФ), злоупотребление полномочиями (ст. 201 УК РФ), коммерческий подкуп (ст. 204 УК РФ), а также иные деяния, попадающие под понятия «коррупция», указанное выше. За указанные преступления предусмотрено наказание вплоть до лишения свободы на срок до пятнадцати лет со штрафом в размере до семидесятикратной суммы взятки и с лишением права занимать определенные должности или заниматься определенной деятельностью на срок до пятнадцати лет."
						open={panelOpened}
						type={InfoClass.INFO}
						setter={setter}
					/>
					<Box sx={{ width: "100%", marginTop: "2vmax" }}>
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
						</Box>
						<Box sx={{ marginTop: "1vmax" }}>
							<StatementEntry data={data} />
						</Box>
					</Box>
				</div>
			</section>
		</main>
	);
}

export default StatementsPage;
