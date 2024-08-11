import { 
	FormControl, 
	Switch, 
	Button,
	Card, 
	CardContent, 
	Tabs, 
	Tab, 
	TableContainer, 
	Table, 
	TableHead, 
	TableBody, 
	TableRow, 
	TableCell, 
	Checkbox,
	FormLabel,
	ToggleButtonGroup,
	ToggleButton,
	Snackbar,
	IconButton} from "@mui/material";
import PageHeader from "../../components/pageHeader";
import { useState, useEffect, useRef, useCallback } from "react";
import styled from "@emotion/styled";
import ErrorBanner from '../../components/error_banner';
import './index.scss';
import { PrintRounded, ClearRounded, SaveRounded } from "@mui/icons-material";


/**
 * @returns Страница управления подгруппами
 */
function Subgroups(){

	const [ groups, setGroups ] = useState([]);
	const [ group, setGroup ] = useState([]);
	const [ groupId, setGroupId ] = useState(0);
	const [ filteredGroup, setFilteredGroup ] = useState([]);
	const currentTeacher = JSON.parse(localStorage.getItem('loggedUser'));
	const [ haveUnattached, setHaveUnattached ] = useState(false);
	const initialized = useRef(false);
	const [ filterVal, setFilterVal ] = useState('all');
	const [ snackbarOpen, setSnackbarOpen ] = useState(false);
	const [ snackbarMessage, setSnackbarMessage ] = useState('');

	// Стилизованный переключатель
	const StyledSwitch = styled(Switch)(({ theme }) => ({
		"& .MuiSwitch-switchBase": {
			"&.Mui-checked": {
			color: "#fff",
			"& + .MuiSwitch-track": {
				backgroundColor: "#00BFA5",
				opacity: 1
			}
			}
		},
		"& .MuiSwitch-track": {
			backgroundColor: "#FF1744",
			opacity: 1,
			"&::before, &::after": {
			content: '""',
			position: "absolute",
			top: "50%",
			transform: "translateY(-50%)",
			width: 16,
			height: 16,
			backgroundSize: "contain"
			}
		},
		"& .MuiSwitch-thumb": {
			backgroundColor: "#D9D9D9"
		}
	}))

	// Получение начальных данных
	useEffect(() => {
		if(!initialized.current){
			initialized.current = true;
			// Загрузка списка групп
			fetch('/data/subgroups.json')
				.then(response => response.json())
				.then(groups => {
					setGroups(groups.subgroups);
				})

			// Загрузка студентов первой группы
			fetch('/data/subgroup1.json')
				.then(res => res.json())
				.then(students => {
					setGroup(students);
					setFilteredGroup(students, 'all')

					// Проверяем нераспределённые
					let unAttached = students.filter(s => {
						return s.teacher === currentTeacher.shortName && s.state === false;
					})

					setHaveUnattached(unAttached.length > 0);
				});
		}
	}, [currentTeacher.shortName])

	// Фильтр групп
	const filter = useCallback((students) => {
		switch(filterVal){
			case 'unattached': return students.filter(s => s.teacher === currentTeacher.shortName && s.state === false);
			case 'own': return students.filter(s => s.teacher === currentTeacher.shortName);
			default: return students;
		}
	}, [ filterVal, currentTeacher.shortName ])

	// Callback для простановки фильтров
	useEffect(() => {
		setFilteredGroup(filter(group));
	}, [ filterVal, group, filter ])

	// Печать групп
	const printGroups = () => {
		window.print();
	}

	// Переключение вкладки
	const switchGroup = (e, newVal) => {
		setGroupId(newVal);
		let url = e.target.dataset['url'];
		
		// Подгрузка студентов выбранной группы
		fetch(`/data/${url}`)
			.then(res => res.json())
			.then(students =>{
				setGroup(students)
				setFilteredGroup(filter(students))

				let unAttached = students.filter(s => {
					return s.teacher === currentTeacher.shortName && s.state === false;
				});
				setHaveUnattached(unAttached.length > 0);
			} )
	}

	// Сброс
	const reset = () => {
		let url = groups[groupId].url;
		fetch(`/data/${url}`)
			.then(res => res.json())
			.then(students => {
				setGroup(students);
				setFilteredGroup(filter(students));

				// Проверяем нераспределённые
				let unAttached = students.filter(s => {
					return s.teacher === currentTeacher.shortName && s.state === false;
				})

				setHaveUnattached(unAttached.length > 0);
			})
	}

	// Колонка с распределением/преподавателем
	const groupVal = (student) => {
		let teacher = student.teacher;
		if (teacher === currentTeacher.shortName) {
			let checked = student.state === true;
			return <StyledSwitch checked={checked}></StyledSwitch>
		}else{
			return teacher;
		}
	}

	// Переключение распределения
	const toggleAttach = e => {
		let newGroup = [...filteredGroup];
		let studentId = parseInt(e.currentTarget.dataset['id']);
		let student = newGroup[studentId];
		if(student.teacher === currentTeacher.shortName){
			student.state = !student.state;
		}
		setFilteredGroup(filter(newGroup));

		// Проверяем нераспределённые
		let unAttached = group.filter(s => {
			return s.teacher === currentTeacher.shortName && s.state === false;
		})

		setHaveUnattached(unAttached.length > 0);

		if(unAttached.length === 0){
			setFilterVal("all");
		}
	}

	// Отобразить нераспределённых
	const toggleNonAttached = (e, newVal) => {
		setFilterVal(newVal ? "unattached" : "all")
	}

	// Контрол в банере с ошибкой
	const filterControl = <FormControl className="non-attach-wrapper">
		<FormLabel sx={{userSelect: 'none', color: '#333', "&.Mui-focused": {color: 'red'}}} htmlFor="non-attached">Нераспределённые</FormLabel>
		<Checkbox  inputProps={{ 'aria-label': 'controlled' }} value="unattached" sx={{"&.Mui-checked": {color: 'red'}}} checked={filterVal === 'unattached'} onChange={toggleNonAttached} id="non-attached"/>
	</FormControl>

	const warning = () => {
		if(haveUnattached){
			return <ErrorBanner message="У группы есть нераспределённые студенты!" control={ filterControl } />
		}else{
			return null;
		}
	}

	// Подзаголовок для печати
	const printSubheader = () => {
		if(groups[groupId]){
			return <h2 className="print" style={{marginTop: 0}}>{ groups[groupId].name }</h2>
		}
		return <></>;
	}

	// Набор фильтров
	const filtersControl = 
	<>
		<ToggleButtonGroup className="filters desktop screen">
			<ToggleButton size="small" value="all" selected={filterVal === "all"} onClick={() =>
			setFilterVal("all")
			}>Все</ToggleButton>
			<ToggleButton size="small" value="unattached" selected={filterVal === "unattached"} onClick={() => {
				setFilterVal("unattached");
			}} >Нераспределённые</ToggleButton>
			<ToggleButton size="small" value="own" selected={filterVal === "own"} onClick={() => {
				setFilterVal("own")
			}}>Только свои</ToggleButton>
		</ToggleButtonGroup>
		<ToggleButtonGroup orientation="vertical" sx={{width: '100%'}} className="filters screen mobile" >
			<ToggleButton size="small" value="all" selected={filterVal === "all"} onClick={() =>
			setFilterVal("all")
			}>Все</ToggleButton>
			<ToggleButton size="small" value="unattached" selected={filterVal === "unattached"} onClick={() => {
				setFilterVal("unattached");
			}} >Нераспределённые</ToggleButton>
			<ToggleButton size="small" value="own" selected={filterVal === "own"} onClick={() => {
				setFilterVal("own")
			}}>Только свои</ToggleButton>
		</ToggleButtonGroup>
	</>

	// Сохранение
	const save = () => {
		setSnackbarMessage("Готово!");
		setSnackbarOpen(true);

		setTimeout(() => {
			setSnackbarOpen(false);
		}, 2000);
	}

	// DOM
	return (
		<>
			<main id="subgroups">
				<section>
					<div className="container">
						<PageHeader header="Программирование" backLink={true} subheader="Управление подгруппами" suffix={ filtersControl } />
						<Card>
							<CardContent>
								{ warning() }
								<div className="subgroup-header">
									<Tabs variant="scrollable" className="screen" value={groupId} onChange={switchGroup}>

										{groups.map((g, index) => (
											<Tab data-url={g.url} value={index} key={index} label={ g.name } />
										))}
									</Tabs>
									{ printSubheader() }
								</div>
								<div className="subgroup-content">
									<TableContainer>
										<Table className="simple-table">
											<TableHead>
												<TableRow>
													<TableCell>ФИО</TableCell>
													<TableCell className="print">Распределён</TableCell>
													<TableCell className="print">Преподаватель</TableCell>
													<TableCell className="screen" sx={{textAlign: 'right'}}>Группа/Распределение</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{filteredGroup.map((student, index) => (
													<TableRow sx={{userSelect: 'none'}} data-id={index} onClick={ toggleAttach } key={index} hover>
														<TableCell>{student.name}</TableCell>
														<TableCell className="print">{student.state ? "Да" : "Нет"}</TableCell>
														<TableCell className="print">{student.teacher}</TableCell>
														<TableCell className="screen" sx={{textAlign: 'right'}}>{ groupVal(student) }</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</CardContent>
						</Card>
						<div className="card-actions-wrapper screen desktop">
							<div className="left-side">
								<Button onClick={ printGroups } variant="outlined">Печать</Button>
							</div>
							<div className="right-side">
								<Button variant="outlined" onClick={ reset }>Сброс</Button>
								<Button variant="contained" onClick={ save }>Сохранить</Button>
							</div>
						</div>
						<div className="card-actions-wrapper mobile">
							<IconButton onClick={ printGroups }><PrintRounded /></IconButton>
							<IconButton onClick={ reset }><ClearRounded /></IconButton>
							<IconButton onClick={ save }><SaveRounded /></IconButton>
						</div>
					</div>
				</section>
			</main>
			<Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} message={snackbarMessage} />
		</>
	)
}

export default Subgroups;