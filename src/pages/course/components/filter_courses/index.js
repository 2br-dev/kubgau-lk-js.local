import { Autocomplete, Button, TextField } from "@mui/material"
import { useState } from "react"
import "./styles.scss"

/**
 * Форма фильтров страницы курсов
 * @param disciplines Список дисциплин для Autocomplete
 * @param courses Список курсов для Autocomplete
 * @param handleApply Callback, вызываемый при изменении формы
 */
function FilterCourses(props) {
  // Инициализация состояний
  const [selectedDiscipline, setSelectedDiscipline] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchText, setSearchText] = useState("")

  /**
   * Изменение выбранной дисциплины
   * @param event
   * @param value
   */
  const handleDisciplineChange = (event, value) => {
    if (value !== null) {
      setSelectedDiscipline(value)
    } else {
      setSelectedDiscipline("")
    }
    let filters = {
      discipline: value,
      course: selectedCourse,
      search: searchText
    }
    props.handleApply(filters)
  }

  /**
   * Изменение выбранного курса
   * @param event
   * @param value
   */
  const handleCourseChange = (event, value) => {
    if (value !== null) {
      setSelectedCourse(value)
    } else {
      setSelectedCourse("")
    }
    let filters = {
      discipline: selectedDiscipline,
      course: value,
      search: searchText
    }
    props.handleApply(filters)
  }

  /**
   * Изменение текста строки поиска
   */
  const handleSearchTextChange = event => {
    let textbox = event.target
    let value = textbox.value

    setSearchText(value)
    let filters = {
      discipline: selectedDiscipline,
      course: selectedCourse,
      search: value
    }

    props.handleApply(filters)
  }

  /**
   * Сброс формы
   */
  const resetForm = () => {
    setSelectedDiscipline("")
    setSelectedCourse("")
    setSearchText("")
    let filters = {
      discipline: "",
      course: "",
      search: ""
    }
    props.handleApply(filters)
  }

  // Рендер компонента
  return (
    <div className="filters-wrapper">
      <div className="title">
        <h3>Фильтры</h3>
      </div>
      <div className="disciplines">
        <Autocomplete
          disablePortal
          id="disciplines"
          options={props.disciplines}
          value={selectedDiscipline}
          onChange={handleDisciplineChange}
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              placeholder="Все дисциплины"
              size="small"
            />
          )}
        />
      </div>
      <div className="courses">
        <Autocomplete
          disablePortal
          id="courses"
          options={props.courses}
          value={selectedCourse}
          onChange={handleCourseChange}
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Все курсы"
              variant="standard"
              size="small"
            />
          )}
        />
      </div>
      <div className="search">
        <TextField
          variant="standard"
          size="small"
          placeholder="Поиск"
          value={searchText}
          onInput={handleSearchTextChange}
        />
      </div>
      <div className="action">
        <Button variant="outlined" onClick={resetForm}>
          Сброс
        </Button>
      </div>
    </div>
  )
}

export default FilterCourses
