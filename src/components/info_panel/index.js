import { Button } from "@mui/material";
import { InfoClass } from "./interfaces";
import { ErrorRounded, InfoRounded, WarningRounded } from "@mui/icons-material";
import React from "react";
import "./styles.scss";
import PropTypes from "prop-types";

InfoPanel.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	setter: PropTypes.func,
	open: PropTypes.bool,
	id: PropTypes.number,
	type: InfoClass,
	message: PropTypes.string,
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
	let title = props.title ? (
		<span className="panel-header">{props.title}</span>
	) : null;
	let subtitle = props.subtitle !== null ? props.subtitle : null;
	let color = "inherit";
	let icon;

	// Установка видимости панели по клику на кнопке
	const setPanelOpen = () => {
		// Небольшая задержка для waves-анимаций
		setTimeout(() => {
			props.setter?.(!props.open, props.id);
		}, 300);
	};

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

	let iconDisplay = !props.open ? "inline" : "none";
	let panelDisplay = props.open ? "block" : "none";

	return (
		<>
			<h1 className={color}>
				<InfoRounded
					sx={{ display: iconDisplay }}
					onClick={setPanelOpen}
				/>
				<div>
					{title}
					<span className="subtitle">{subtitle}</span>
				</div>
			</h1>
			<div
				className={"info-panel " + props.type}
				style={{ display: panelDisplay }}
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
