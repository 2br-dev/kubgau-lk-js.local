import KVPair from "../../../../components/kv_pair";
import { Grid, Link } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

StatementData.propTypes = {
	startDate: PropTypes.string,
	closeDate: PropTypes.string,
	eventDate: PropTypes.string,
	deadline: PropTypes.string,
	eventTime: PropTypes.string,
	group: PropTypes.string,
	number: PropTypes.number,
	type: PropTypes.string,
	subtype: PropTypes.string,
	state: PropTypes.string,
	unit: PropTypes.string,
	hours: PropTypes.string,
	doc: PropTypes.string,
	examDate: PropTypes.string,
};

function StatementData(props) {
	return (
		<>
			<Grid container className="screen">
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair _key="дата выдачи" _value={props.startDate} />
					<KVPair _key="дата закрытия" _value={props.closeDate} />
					<KVPair _key="дедлайн закрытия" _value={props.deadline} />
					<KVPair _key="дата проведения" _value={props.eventDate} />
					<KVPair _key="время проведения" _value={props.eventTime} />
				</Grid>
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair
						_key="группа"
						_value={<Link href="/main/group">{props.group}</Link>}
					/>
					<KVPair _key="номер ведомости" _value={props.number} />
					<KVPair _key="тип ведомости" _value={props.type} />
					<KVPair _key="вид ведомости" _value={props.subtype} />
				</Grid>
				<Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
					<KVPair _key="статус" _value={props.state} />
					<KVPair _key="зачётная единица" _value={props.unit} />
					<KVPair _key="кол-во часов" _value={props.hours} />
					<KVPair
						_className="screen"
						_key="скан документа"
						_value={
							<>
								<Link href={"/" + props.doc}>Посмотреть</Link> |{" "}
								<Link>Удалить</Link>
							</>
						}
					/>
				</Grid>
			</Grid>
			<div className="statement-data print">
				<KVPair
					_key="группа"
					_value={<Link href="/main/group">{props.group}</Link>}
				/>
				<KVPair _key="номер ведомости" _value={props.number} />
				<KVPair _key="тип ведомости" _value={props.type} />
				<KVPair _key="вид ведомости" _value={props.subtype} />
				<KVPair _key="статус" _value={props.state} />
				<KVPair _key="зачётная единица" _value={props.unit} />
				<KVPair _key="кол-во часов" _value={props.hours} />
				<KVPair _key="дата выдачи" _value={props.startDate} />
				<KVPair _key="дата закрытия" _value={props.closeDate} />
				<KVPair _key="дедлайн закрытия" _value={props.deadline} />
				<KVPair _key="дата экзамена" _value={props.examDate} />
			</div>
		</>
	);
}

export default StatementData;
