import { Card, CardContent, Button } from "@mui/material"
import {
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@mui/material"
import { useEffect, useState } from "react"
import CollapsibleRow from "./components/collapsibleRow"
import React from "react"
import ErrorBanner from "../../components/error_banner"
import FilterCourses from "./components/filter_courses"
import { useNavigate } from "react-router-dom"
import store from "../../store"
import "./styles.scss"

/** Страница курсов  */
function CoursePage() {
  let [courses, setCourses] = useState([])
  let [cStates, setCStates] = useState([])
  let [globalCollapse, setGlobalCollapse] = useState(true)

  let [disciplines, setDisciplines] = useState([])
  let [coursesList, setCoursesList] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    /**
     * Функция получения данных
     */
    const dataFetch = async () => {
      // Получение данных
      const data = await // Заглушка - локальный JSON
      (await fetch("/data/main_courses.json")).json()

      // Инициализация состояний
      let states = [] // Состояние строк (развёрнуто/свёрнуто, ID строки)
      let disciplines = [] // Автозаполнение для фильтра дисциплин
      let coursesList = [] // Автозаполнение для фильтра курсов

      // Получение состояний
      data.forEach(el => {
        states.push({ id: el.id, is_open: false })

        // Читаем доступные дисциплины
        disciplines.push(el.name)

        // Читаем доступные курсы
        coursesList.push(el.course)
      })

      // Только уникальные
      disciplines = [...new Set(disciplines)]
      coursesList = [...new Set(coursesList)]

      // Установка состояний
      setCStates(states)
      setCourses(data)
      setDisciplines(disciplines)
      setCoursesList(coursesList)
    }

    dataFetch()
  }, [])

  /**
   * Переключение открытости строки
   * @param is_open открытость строки
   * @param id - идентификатор строки
   */
  const toggler = (is_open, id) => {
    let states = [...cStates]
    let state = states.filter(c => {
      return c.id === id
    })
    state[0].is_open = is_open
    setCStates(states)
  }

  /**
   * Переключение открытости всех строк
   */
  const toggleCollapse = () => {
    setGlobalCollapse(!globalCollapse)

    let states = [...cStates]
    states.forEach(c => {
      c.is_open = globalCollapse
    })

    setCStates(states)
  }

  /**
   * Применение фильтров
   * @param value - Фильтры, переданные хуком
   */
  const handleApply = value => {
    console.table(value)
  }

  /**
   * Переход на семестр, содержащий ошибки
   * @param semester
   */
  const errorCallback = semester => {
    store.dispatch({ type: "write", payload: semester })
    navigate("/main/statements")
  }

  // Заглушка - рыбные ошибки
  let message = "У вас есть незакрытые ведомости, пожалуйста, закройте их!"
  let title = "Незакрытые ведомости"
  let errors = [
    "2 семестр 2017/2018 г.",
    "1 семестр 2018/2019 г.",
    "2 семестр 2018/2019 г.",
    "1 семестр 2022/2023 г."
  ]

  // Рендер компонента
  return (
    <main>
      <section>
        <div className="container">
          <ErrorBanner
            message={message}
            errorsTitle={title}
            errors={errors}
            errorCallback={errorCallback}
          />
          <div className="cab-header">
            <div className="header-wrapper">
              <h1>Список курсов</h1>
            </div>
          </div>
          <Card>
            <CardContent>
              <div className="courses-filters">
                <FilterCourses
                  disciplines={disciplines}
                  courses={coursesList}
                  handleApply={handleApply}
                />
                <div className="toggler-wrapper">
                  <Button
                    variant="outlined"
                    sx={{ fontFamily: "Wix Madefor Text" }}
                    onClick={toggleCollapse}
                  >
                    {globalCollapse ? "Развернуть" : "Свернуть"} все дисциплины
                  </Button>
                </div>
              </div>
              <TableContainer>
                <Table
                  sx={{
                    minWidth: 650,
                    borderSpacing: 0,
                    borderCollapse: "collapse"
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "47%" }} colSpan={2}>
                        Дисциплины
                      </TableCell>
                      <TableCell sx={{ width: "12%" }}>Курс</TableCell>
                      <TableCell sx={{ width: "12%" }}>Лекции</TableCell>
                      <TableCell sx={{ width: "12%" }}>Семинары</TableCell>
                      <TableCell sx={{ width: "12%" }}>Лаб. занятия</TableCell>
                      <TableCell sx={{ width: "5%", textAlign: "right" }}>
                        Действия
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((row, index) => {
                      return (
                        <CollapsibleRow
                          row={row}
                          key={index}
                          isOpen={cStates[index].is_open}
                          toggler={toggler}
                          index={index}
                        />
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default CoursePage
