import { Button, Card, CardContent, CardActions } from "@mui/material";
import { QueryBuilderRounded } from "@mui/icons-material";
import React from "react";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

function CardBlock(props) {
	const navigate = useNavigate();

	const openDetailsPage = () => {
		navigate("/main/groups");
	};

	return (
		<>
			<div className="details-block">
				<h2>{props.title}</h2>
				<Card>
					<CardContent>
						<div className="groups-wrapper">
							{props.data?.list.map((el, index) => {
								let groupName = el.toString();
								let element = (
									<div className="group" key={index}>
										{groupName}
									</div>
								);
								return element;
							})}
						</div>
					</CardContent>
					<CardActions>
						<div className="card-action">
							<div className="time-wrapper">
								<div className="icon-block">
									<QueryBuilderRounded />
									{props.data.current} / {props.data.total}
								</div>
							</div>
							<div className="action-wrapper">
								<Button
									variant="text"
									onClick={openDetailsPage}
								>
									Открыть
								</Button>
							</div>
						</div>
					</CardActions>
				</Card>
			</div>
		</>
	);
}

export default CardBlock;
