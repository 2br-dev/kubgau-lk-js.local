import React, { useEffect, useState } from "react";
import PageHeader from "../../components/pageHeader";
import {
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	MenuItem,
	IconButton,
	Snackbar,
} from "@mui/material";
import { CheckRounded, EditRounded } from "@mui/icons-material";

function GroupCurators() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [availableEmployees, setAvailableEmployees] = useState([]);
	const [ownOnly, setOwnOnly] = useState(false);
	const [snackBarOpen, setSnackbarOpen] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("/data/curators.json")
			.then((res) => res.json())
			.then((response) => {
				response.data.forEach((i) => (i.mode = "view"));

				setData(response.data);
				setAvailableEmployees(response.availableEmployees);
				setFilteredData(response.data);
			});
	}, []);

	const handleOwnFilterChange = (e, newVal) => {
		setOwnOnly(newVal);
		let _filteredData = [...data];
		if (newVal === true) {
			_filteredData = data.filter((i) => i.fromDifferentChair === false);
		}
		setFilteredData(_filteredData);
	};

	const suffix = (
		<FormControlLabel
			sx={{ userSelect: "none" }}
			control={
				<Checkbox value={ownOnly} onChange={handleOwnFilterChange} />
			}
			label="Только свои"
		/>
	);

	const handleChangeCurator = (e, child) => {
		let _filteredData = [...filteredData];
		let item = _filteredData[e.target.name];
		item.jobId = e.target.value;
		item.curatorFullName = child.props.children;
		setFilteredData(_filteredData);
	};

	const curatorControl = (item, index) => {
		if (item.mode === "view") {
			return <>{item.curatorFullName}</>;
		} else {
			return (
				<Select
					size="small"
					variant="standard"
					fullWidth
					name={index}
					value={item.jobId || ""}
					onChange={handleChangeCurator}
					MenuProps={{
						style: {
							maxHeight: 400,
						},
					}}
				>
					{availableEmployees.map((e, i) => {
						return (
							<MenuItem key={i} value={e.jobId}>
								{e.fullName}
							</MenuItem>
						);
					})}
				</Select>
			);
		}
	};

	const setMode = (e) => {
		const index = parseInt(e.currentTarget.dataset.id);
		const _filteredData = [...filteredData];
		let item = _filteredData[index];
		if (item.mode === "edit") {
			setMessage("Данные успешно сохранены!");
			setSnackbarOpen(true);

			setTimeout(() => {
				setSnackbarOpen(false);
			}, 2000);
		}
		item.mode = item.mode === "view" ? "edit" : "view";
		setFilteredData(_filteredData);
	};

	const curatorActionControl = (item, index) => {
		const icon = item.mode === "view" ? <EditRounded /> : <CheckRounded />;

		if (!item.fromDifferentChair) {
			return (
				<IconButton size="small" data-id={index} onClick={setMode}>
					{icon}
				</IconButton>
			);
		}
	};

	const tableBody = () => {
		return filteredData.map((item, index) => (
			<TableRow key={index} hover>
				<TableCell>{index + 1}</TableCell>
				<TableCell>{item.groupName}</TableCell>
				<TableCell>{curatorControl(item, index)}</TableCell>
				<TableCell>{item.chairName}</TableCell>
				<TableCell className="screen" sx={{ textAlign: "right" }}>
					{curatorActionControl(item, index)}
				</TableCell>
			</TableRow>
		));
	};

	const curatorsTable = (
		<TableContainer>
			<Table className="simple-table">
				<TableHead>
					<TableRow>
						<TableCell>№</TableCell>
						<TableCell>Группа</TableCell>
						<TableCell>Куратор</TableCell>
						<TableCell>Кафедра</TableCell>
						<TableCell
							className="screen"
							sx={{ textAlign: "right" }}
						>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>{tableBody()}</TableBody>
			</Table>
		</TableContainer>
	);

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header="Кураторы групп"
						backLink={true}
						suffix={suffix}
					/>
					<Card>
						<CardContent>{curatorsTable}</CardContent>
					</Card>
				</div>
			</section>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				open={snackBarOpen}
				message={message}
			/>
		</main>
	);
}

export default GroupCurators;
