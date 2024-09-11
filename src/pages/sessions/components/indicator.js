import { Tooltip } from "@mui/material";
import {
	CircleRounded,
	CheckRounded,
	CachedRounded,
} from "@mui/icons-material";
import React from "react";

const warningMessage = (target) => {
	return (
		<>
			<strong>Отправлена на утверждение в {target}</strong>
			<ul style={{ paddingLeft: "0", margin: 0, listStyle: "none" }}>
				<li>
					<CheckRounded sx={{ height: ".5em" }} />
					Основная информация заполнена
				</li>
				<li>
					<CheckRounded sx={{ height: ".5em" }} />
					Расписание заполнено
				</li>
				<li>
					<CachedRounded sx={{ height: ".5em" }} />
					Ожидает утверждения
				</li>
			</ul>
		</>
	);
};
// FDD835
function indicator(item) {
	switch (true) {
		case item.approveStatus === 0:
			return (
				<Tooltip
					placement="top-start"
					title="Не отправлена на утверждение"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 1:
			return (
				<Tooltip placement="top-start" title={warningMessage("УМУ")}>
					<CircleRounded sx={{ color: "#FDD835" }} />
				</Tooltip>
			);
		case item.approveStatus === 2:
			return (
				<Tooltip
					placement="top-start"
					title={warningMessage("диспетчерскую")}
				>
					<CircleRounded sx={{ color: "#FDD835" }} />
				</Tooltip>
			);
		case item.approveStatus === 3:
			return (
				<Tooltip
					placement="top-start"
					title="Возвращено для внесения изменеий по решению диспетчерской"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 4:
			return (
				<Tooltip
					placement="top-start"
					title="Запрос на прерывание отправлен в УМУ"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 5:
			return (
				<Tooltip
					placement="top-start"
					title="Запрос на прерывание отправлен в диспетчерскую"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 6:
			return (
				<Tooltip
					placement="top-start"
					title="Запрос на прерывание отправлен в диспетчерскую и УМУ"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 7:
			return (
				<Tooltip
					placement="top-start"
					title="Возвращено для внесения изменеий по решению УМУ"
				>
					<CircleRounded sx={{ color: "#FF1744" }} />
				</Tooltip>
			);
		case item.approveStatus === 100:
			return (
				<Tooltip placement="top-start" title="Сессия утверждена">
					<CircleRounded sx={{ color: "#00BFA5" }} />
				</Tooltip>
			);
		default:
			return (
				<Tooltip placement="top-start" title="Нет доступных сессий">
					<CircleRounded sx={{ color: "#E2E2E2" }} />
				</Tooltip>
			);
	}
}

export default indicator;
