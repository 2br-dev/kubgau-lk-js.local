import { Card, CardContent, Tabs, Tab } from "@mui/material";
import PageHeader from "../../components/pageHeader";
import { useState, useEffect } from "react";


function Subgroups(){

	const [ groups, setGroups ] = useState([]);
	const [ group, setGroup ] = useState({});
	const [ groupId, setGroupId ] = useState(0);

	useEffect(() => {
		fetch('/data/subgroups.json')
			.then(response => response.json())
			.then(groups => {
				setGroups(groups.subgroups);
				setGroup(groups.subgroups[0]);
			})
	}, [])

	const switchGroup = (e, newVal) => {
		setGroupId(newVal);
		setGroup(groups[newVal]);
	}


	return (
		<main id="subgroups">
			<section>
				<div className="container">
					<PageHeader header="Программирование" backLink={true} subheader="Управление подгруппами" />
					<Card>
						<CardContent>
							<div className="subgroup-header">
								<Tabs value={groupId} onChange={switchGroup}>
									{groups.map((g, index) => (
										<Tab value={index} key={index} label={ g.name } />
									))}
								</Tabs>
							</div>
							<div className="subgroup-content">
								{
									group.students.map((student, index) => (
										<div key={index}>
											{ student.name }
										</div>
									))
								}
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>
	)
}

export default Subgroups;