import { useState } from "react"
import {
	TableRow,
	TableCell,
	Menu,
	MenuItem,
	IconButton,
	Collapse
} from "@mui/material"
import { EView } from "../detailsBlock/interfaces"
import { ExpandMore, MoreVertRounded } from "@mui/icons-material"
import progressControl from "../../../../components/progressControl"
import DetailsBlock from "../detailsBlock"
import React from "react"
import { Grid } from "@mui/material"
import "./styles.scss"
import { Link } from "react-router-dom";

/**
 * Сворачиваемая строка таблицы
 * @param row Вхождение курса
 * @param index Индекс курса
 * @param toggler Функция, отрабатывающая переключение видимости строки
 * @returns React.Node
 */
function CollapsibleRow(props) {
	
	const { row } = props
	const [anchorEl, setAnchorEl] = useState(null)
	const menuOpen = Boolean(anchorEl)

	// Отображение меню курса
	const handleMenuOpen = e => {
		setAnchorEl(e.currentTarget)
	}

	// Скрытие меню курса
	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	// Переключение видимости строки
	const toggleRow = e => {
		let path = Array.from(e.nativeEvent.composedPath())
		let links = path.filter(el => {
			let element = el
			return (
				element.tagName === "A" ||
				element.tagName === "BUTTON" ||
				element.id === "more-menu"
			)
		})
		if (links.length === 0) {
			// Callback
			props.toggler(!props.isOpen, row.id)
		}
	}

	let lectionControl = progressControl(
		row.lections?.current,
		row.lections?.total
	) // Лекции в дочерней таблице
	let seminarControl = progressControl(
		row.seminars?.current,
		row.seminars?.total
	) // Семинары в дочерней таблице
	let labControl = progressControl(row.labs?.current, row.labs?.total) //  Лабораторные работы в дочерней таблице

	// Положение стрелочки
	let transform = props.isOpen ? "rotate(180deg)" : "rotate(0deg)"

	return (
		<>
			<TableRow hover onClick={toggleRow} sx={{ cursor: "pointer" }}>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					<ExpandMore
						sx={{ transition: "transform .4s", transform: transform }}
					/>
				</TableCell>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					{row.name}
				</TableCell>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					{row.course}
				</TableCell>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					{lectionControl}
				</TableCell>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					{seminarControl}
				</TableCell>
				<TableCell sx={{ borderBottom: 0, fontSize: "clamp(16px, 3vw, 18px)" }}>
					{labControl}
				</TableCell>
				<TableCell
					sx={{
						borderBottom: 0,
						fontSize: "clamp(16px, 3vw, 18px)",
						textAlign: "right"
					}}
				>
					<IconButton
						aria-label="Действия"
						aria-controls={menuOpen ? "more-menu" : undefined}
						aria-haspopup={true}
						aria-expanded={menuOpen ? "true" : undefined}
						onClick={handleMenuOpen}
					>
						<MoreVertRounded />
					</IconButton>
					<Menu
						id="more-menu"
						anchorEl={anchorEl}
						open={menuOpen}
						onClose={handleMenuClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right"
						}}
						transformOrigin={{
							horizontal: "right",
							vertical: "top"
						}}
					>
						<MenuItem>Список тем</MenuItem>
						<MenuItem>
							<Link to='/main/journal'>Журнал</Link>
						</MenuItem>
						<MenuItem>
							<Link to='/main/subgroups'>Подгруппы</Link>
						</MenuItem>
						<MenuItem>Пропуски студентов</MenuItem>
					</Menu>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell colSpan={7} sx={{ padding: 0 }}>
					<Collapse in={props.isOpen} timeout="auto" unmountOnExit>
						<div className="details">
							<Grid container spacing={4}>
								<DetailsBlock
									view={EView.CARD}
									data={row.lections}
									title="Лекции"
								/>
								<DetailsBlock
									view={EView.TABLE}
									data={row.seminars}
									title="Семинары"
								/>
								<DetailsBlock
									view={EView.TABLE}
									data={row.labs}
									title="Лабораторные работы"
								/>
							</Grid>
						</div>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	)
}

export default CollapsibleRow
