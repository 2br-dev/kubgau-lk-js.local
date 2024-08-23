import React from "react";
import { Tabs, Tab, Card, CardContent } from "@mui/material/";
import { useState, useEffect } from "react";
import PageHeader from "../../components/pageHeader";
import PracticeTable from "./practice-table";

function PracticeStatements() {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		// Получение данных
		fetch("/data/employeePracticeStatements.json")
			.then((res) => res.json())
			.then((response) => {
				setData(response.practices);
				setFilteredData(filterData(response.practices));
			})
			.catch((err) => console.error(err));
	}, []);

	const handleTabChange = (e, newVal) => {
		setTabValue(newVal);
		setFilteredData(filterData(data, newVal));
	};

	/**
	 * Фильтрация данных по практике
	 * @param {*} data Данные для фильтрации
	 * @param {*} typeId Выбранная вкладка
	 * @returns
	 */
	const filterData = (data, typeId) => {
		let newData;
		if (typeId === undefined) typeId = 0;
		switch (typeId) {
			case 0:
				newData = data.map((p) => {
					return {
						courseName: p.courseName,
						groupId: p.groupId,
						groupName: p.groupName,
						practiceId: p.practiceId,
						practiceKind: p.practiceKind,
						practiceType: p.practiceType,
						statements: p.statements.filter((s) => {
							return s.closingDate === null;
						}),
					};
				});
				break;
			case 1:
				newData = data.map((p) => {
					return {
						courseName: p.courseName,
						groupId: p.groupId,
						groupName: p.groupName,
						practiceId: p.practiceId,
						practiceKind: p.practiceKind,
						practiceType: p.practiceType,
						statements: p.statements.filter((s) => {
							return s.closingDate !== null;
						}),
					};
				});
				break;
			default:
				newData = [];
				break;
		}

		return newData;
	};

	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						header="Ведомости по практикам"
						subheader=""
						backLink={true}
					/>
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						sx={{ marginBottom: "1vmax" }}
					>
						<Tab label="Открытые" value={0} />
						<Tab label="Закрытые" value={1} />
					</Tabs>

					{filteredData.map((s, index) => {
						return (
							<Card key={index}>
								<CardContent>
									<h2>{s.courseName}</h2>
									<p>{s.practiceType}</p>
									<PracticeTable data={s.statements} />
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>
		</main>
	);
}

export default PracticeStatements;
