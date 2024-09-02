import React from "react";
import PropTypes from "prop-types";
import {
	FormControlLabel,
	Checkbox,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tabs,
	Tab,
} from "@mui/material";
import { useEffect, useState } from "react";

UMUFilters.propTypes = {
	onFacultyChange: PropTypes.func.isRequired,
	onRequestsChange: PropTypes.func.isRequired,
	faculty: PropTypes.string.isRequired,
	requestsOnly: PropTypes.bool,
	umuTab: PropTypes.number,
	onTabChange: PropTypes.func,
	faculties: PropTypes.arrayOf(PropTypes.object),
};

function UMUFilters(props) {
	const [requestsCount, setRequestsCount] = useState(0);

	useEffect(() => {
		fetch("/data/outplanRequests.json")
			.then((res) => res.json())
			.then((response) => {
				let count = 0;
				response.data.forEach((f) => {
					count += f.passings.filter(
						(p) => p.approvalStatus === 1,
					).length;
				});
				setRequestsCount(count);
			});
	});

	const handleRequestChange = (e) => {
		props.onRequestsChange(e.target.checked);
	};

	const handleFacultyChange = (e) => {
		props.onFacultyChange(e.target.value);
	};

	const handleTabChange = (e, newVal) => {
		props.onTabChange(newVal);
	};

	const filterControls = () => {
		if (props.umuTab === 0) {
			return (
				<div
					className="filters"
					style={{
						display: "flex",
						alignItems: "center",
						flexWrap: "wrap",
						marginBottom: "20px",
						maxWidth: "100%",
					}}
				>
					<FormControlLabel
						sx={{
							userSelect: "none",
							maxWidth: "100%",
							"& .MuiTypography-root": {
								maxWidth: "calc(100%)",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							},
						}}
						control={
							<Checkbox
								checked={props.requestsOnly}
								onChange={handleRequestChange}
							/>
						}
						label="Только заявки на утверждение"
					/>
					<FormControl
						variant="standard"
						sx={{
							minWidth: "200px",
							transform: "translateY(-8px)",
						}}
					>
						<InputLabel>Выберите факультет</InputLabel>
						<Select
							value={props.faculty}
							onChange={handleFacultyChange}
							MenuProps={{
								style: {
									maxHeight: 400,
								},
								transformOrigin: {
									horizontal: "right",
									vertical: "top",
								},
								anchorOrigin: {
									horizontal: "right",
									vertical: "bottom",
								},
							}}
						>
							{props.faculties.map((f, index) => (
								<MenuItem key={index} value={f.key}>
									{f.value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			);
		}

		return <></>;
	};

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				alignItems: "flex-start",
				justifyContent: "space-between",
			}}
		>
			<div className="tabs">
				<Tabs
					value={props.umuTab}
					onChange={handleTabChange}
					variant="scrollable"
					sx={{ marginBottom: "20px" }}
				>
					<Tab value={0} label="Секции факультетов" />
					<Tab
						value={1}
						label={
							<span
								style={{
									display: "flex",
									alignItems: "baseLine",
								}}
							>
								<span>Заявки на внеплановые сессии</span>
								<span
									style={{
										backgroundColor:
											props.umuTab === 1
												? "#1976d2"
												: "#00000099",
										color: "#fff",
										display: "inline-block",
										height: "1.4em",
										aspectRatio: "1 / 1",
										borderRadius: "50%",
										marginLeft: "5px",
										textAlign: "center",
									}}
								>
									{requestsCount}
								</span>
							</span>
						}
					/>
				</Tabs>
			</div>
			{filterControls()}
		</div>
	);
}

export default UMUFilters;
