import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
} from "@mui/material";
import { QueryBuilderRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

TableBlock.propTypes = {
	title: PropTypes.string,
	data: PropTypes.any,
};

/**
 * Табличный блок контента дочерней таблицы
 * @prop title Заголовок блока
 * @prop data Данные для отображения
 **/
function TableBlock(props) {
	// Рендер компонента
	return (
		<div className="details-block">
			<h2>{props.title}</h2>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Группа</TableCell>
						<TableCell>Время</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.data?.list.map((el, index) => {
						// Вывод данных в таблицу
						let groupData = el;

						let element = (
							<TableRow key={index} hover>
								<TableCell>
									<Link
										style={{ color: "#2C65D3" }}
										to="/main/groups?statementid=12"
									>
										{groupData.group}
									</Link>
								</TableCell>
								<TableCell>
									<div className="icon-block">
										<QueryBuilderRounded />
										{groupData.current} / {groupData.total}
									</div>
								</TableCell>
							</TableRow>
						);
						return element;
					})}
				</TableBody>
			</Table>
		</div>
	);
}

export default TableBlock;
