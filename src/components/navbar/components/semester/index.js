import { useState, useEffect } from "react"
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded"
import store from "../../../../store"
import Autocomplete from "@mui/material/Autocomplete"
import { TextField } from "@mui/material"
import "./styles.scss"

const Semester = () => {

	let [semester, setSemester] = useState(
		localStorage.getItem("currentSemester") || "Выберите семестр"
	)
	let [menuItems, setMenuItems] = useState([])
	let searchInput

	useEffect(() => {
		fetch("/data/semesters.json")
			.then(res => res.json())
			.then(response => {
				setMenuItems(response)
			})
			.catch(error => {
				setMenuItems([])
				console.error("Error:", error)
			})
	}, [])

	const handleChange = () => {
		setSemester(store.getState()[0].name)
		localStorage.setItem("currentSemester", store.getState()[0].name)
	}

	const handleInputChange = (e, value) => {
		store.dispatch({ type: "write", payload: value })
	}

	useEffect(() => {
		return () => {
			unsubscribe()
		}
	})

	const unsubscribe = store.subscribe(handleChange)

	return (
		<div className="semester">
			<div>
				<Autocomplete
					className="semesters"
					disablePortal
					options={menuItems}
					id="selectSemester"
					value={semester}
					disableClearable
					blurOnSelect
					sx={{
						width: '210px',
						fontFamily: "Wix Madefor Text"
					}}
					onChange={handleInputChange}
					renderInput={params => (
						<TextField
							{...params}
							inputRef={searchInput}
							variant="standard"
							InputProps={{
								...params.InputProps,
								disableUnderline: true,
								startAdornment: (
									<CalendarMonthRoundedIcon sx={{ marginRight: "10px" }} className="semester-icon" />
								)
							}}
						/>
					)}
				/>
			</div>
		</div>
	)
}

export default Semester
