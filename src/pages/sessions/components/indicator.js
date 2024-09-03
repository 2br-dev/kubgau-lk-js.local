import { Tooltip } from "@mui/material";
import {
	CircleRounded,
	CheckRounded,
	CachedRounded,
} from "@mui/icons-material";
import React from "react";

const warningMessage = () => {
	return (
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
	);
};

function indicator(item) {
	switch (true) {
		case item.approveStatus === 1:
			return (
				<Tooltip placement="top-start" title={warningMessage()}>
					<CircleRounded sx={{ color: "#FDD835" }} />
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
