import { Button } from "@mui/material";
import { InfoClass } from "./interfaces";
import { ErrorRounded, InfoRounded, WarningRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import "./styles.scss";
import PropTypes from "prop-types";

InfoPanel.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.any,
	id: PropTypes.string,
	type: PropTypes.string,
	message: PropTypes.any,
};

/**
 * Информационная панель
 * @param id: Идентификатор панели (для сохранения статуса в localStorage)
 * @param title? Заголовок панели
 * @param subtitle?  Подзаголовок панели
 * @param message Текст панели
 * @param open? Открыта
 * @param Тип панели / Инфо|Предупреждение|Ошибка
 */
function InfoPanel(props) {
	const [open, setOpen] = useState(false);

	let title = props.title ? (
		<span className="panel-header">{props.title}</span>
	) : null;
	let subtitle = props.subtitle !== null ? props.subtitle : null;
	let color = "inherit";
	let icon;
	let titleIcon;
	let iconDisplay = !open ? "inline" : "none";

	// Установка видимости панели по клику на кнопке
	const setPanelOpen = () => {
		// Небольшая задержка для waves-анимаций
		setTimeout(() => {
			const states =
				JSON.parse(localStorage.getItem("panelStates")) || [];

			let state = {
				panelId: props.id,
				opened: !open,
			};

			setOpen(!open);

			const storageStates = states.filter((s) => s.panelId !== props.id);
			storageStates.push(state);
			localStorage.setItem("panelStates", JSON.stringify(storageStates));
		}, 300);
	};

	useEffect(() => {
		// Состояние информационной панели
		const storagePanels =
			JSON.parse(localStorage.getItem("panelStates")) || [];

		const storagePanel = storagePanels.filter(
			(p) => p.panelId === props.id,
		)[0];

		let openVal = storagePanel ? storagePanel.opened : true;
		setOpen(openVal);
	}, []);

	// Тип панели (INFO | WARNING | ERROR)
	switch (props.type) {
		case InfoClass.INFO:
			color = "info";
			icon = <InfoRounded />;
			break;
		case InfoClass.WARNING:
			color = "warning";
			icon = <WarningRounded />;
			break;
		case InfoClass.ERROR:
			color = "error";
			icon = <ErrorRounded />;
			break;
		default:
			color = "inherit";
			icon = <></>;
	}

	const panelDisplay = () => {
		return open ? "block" : "none";
	};

	switch (props.type) {
		case InfoClass.INFO:
			color = "info";
			titleIcon = (
				<InfoRounded
					sx={{ display: iconDisplay }}
					onClick={setPanelOpen}
				/>
			);
			break;
		case InfoClass.WARNING:
			color = "warning";
			titleIcon = (
				<WarningRounded
					sx={{ display: iconDisplay }}
					onClick={setPanelOpen}
				/>
			);
			break;
		case InfoClass.ERROR:
			color = "error";
			titleIcon = (
				<ErrorRounded
					sx={{ display: iconDisplay }}
					onClick={setPanelOpen}
				/>
			);
			break;
		default:
			color = "inherit";
			titleIcon = <></>;
	}

	return (
		<>
			<h1 className={color}>
				{titleIcon}
				<div>
					{title}
					<span className="subtitle">{subtitle}</span>
				</div>
			</h1>
			<div
				className={"info-panel " + props.type}
				style={{ display: panelDisplay() }}
			>
				<div className="panel-head">
					<div className="icon-wrapper">{icon}</div>
					<div className="action-wrapper">
						<Button
							variant="outlined"
							color={color}
							onClick={setPanelOpen}
						>
							Ознакомлен, больше не показывать
						</Button>
					</div>
				</div>
				{title}
				<div>{props.message}</div>
			</div>
		</>
	);
}

export default InfoPanel;
