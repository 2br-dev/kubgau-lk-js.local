import { ChevronLeftRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import InfoPanel from "../../components/info_panel";
import { InfoClass } from "../../components/info_panel/interfaces";
import { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import StatementEntry from "./components/statement-entry";
import React from "react";
import { useParams } from "react-router-dom";

/**
 * Список ведомостей
 */
function StatementsPage() {
	const [panelOpened, setPanelOpened] = useState(false);
	const [tabValue, setTabValue] = useState(0);
	const [data, setData] = useState(null);
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

	// Заглушка – перечень локальных JSON
	const main_sources = [
		"/data/statements_tests.json",
		"/data/statements_courses.json",
		"/data/statements_exams.json",
	];

	const practice_sources = [
		"/data/practice_open.json",
		"/data/practice_close.json",
	];

	/**
	 * Получение данных
	 * @param {number} tabIndex Индекс выбранной вкладки
	 */
	const dataFetch = (tabIndex) => {
		let sourceIndex = tabIndex === undefined ? tabValue : tabIndex;
		let source;

		if (type === "common") {
			source = main_sources[sourceIndex];
		} else {
			source = practice_sources[sourceIndex];
		}

		fetch(source)
			.then((res) => res.json())
			.then((data) => setData(data))
			.catch((err) => console.error(err));
	};

	/**
	 * Монтирование компонента
	 */
	useEffect(() => {
		/**
		 * Получение данных при загрузке компонента
		 */
		const dataFetch = () => {
			let source =
				type === "common"
					? "/data/statements_tests.json"
					: "/data/practice_open.json";

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
	}, [location, type]);

	/**
	 * Обработчик переключения вкладок
	 * @param event Событие
	 * @param newValue Новый индекс вкладки
	 */
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
		dataFetch(newValue);
	};

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
						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
							>
								{tabs()}
							</Tabs>
						</Box>
						<Box sx={{ marginTop: "1vmax" }}>
							<StatementEntry data={data} type={type} />
						</Box>
					</Box>
				</div>
			</section>
		</main>
	);
}

export default StatementsPage;
