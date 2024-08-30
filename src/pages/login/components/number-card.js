import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

NumberCard.propTypes = {
	value: PropTypes.number,
	title: PropTypes.string,
	url: PropTypes.string,
	color: PropTypes.string,
	icon: PropTypes.string,
};

/**
 * Карточка с номером
 * @param {number} value Значение, отображаемое в карточке
 * @param {string} title Подпись, отображаемая рядом с цифрой
 * @param {string} url URL, куда должен происходить переход по клику на карточке
 * @param {string} color Цвет карточки
 * @param {string} icon Иконка карточки
 * @returns
 */
function NumberCard(props) {
	const navigate = useNavigate();

	const openUrl = () => {
		navigate(props.url);
	};

	return (
		<Card
			onClick={openUrl}
			sx={{
				backgroundImage: `url(${props.icon})`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "top 10px right 10px",
				backgroundColor: props.color,
				cursor: "pointer",
				":hover": {
					boxShadow: "0 2px 15px -6px rgba(0, 0, 0, .4) !important",
				},
			}}
		>
			<CardContent
				sx={{
					display: "flex",
					alignItems: "center",
					paddingLeft: "30px",
					paddingRight: "80px",
				}}
			>
				<div
					style={{
						fontSize: "56px",
						fontWeight: "bold",
						marginRight: "20px",
						lineHeight: "1em",
					}}
				>
					{props.value}
				</div>
				<div style={{ fontSize: "16px" }}>{props.title}</div>
			</CardContent>
		</Card>
	);
}

export default NumberCard;
