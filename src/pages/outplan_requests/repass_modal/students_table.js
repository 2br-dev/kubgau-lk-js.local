import React from "react";
import {
	TableContainer,
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	IconButton,
} from "@mui/material";
import { DeleteRounded } from "@mui/icons-material";
import PropTypes from "prop-types";

StudentsTable.propTypes = {
	students: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func.isRequired,
};

function StudentsTable(props) {
	const handleDelete = (e) => {
		const id = parseInt(e.currentTarget.dataset.id);
		props.onDelete(id);
	};

	return (
		<TableContainer sx={{ height: 300 }}>
			<Table className="simple-table" size="small">
				<TableHead>
					<TableRow>
						<TableCell>ФИО студента</TableCell>
						<TableCell sx={{ textAlign: "right" }}>
							Действия
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.students.map((s, sindex) => {
						return (
							<TableRow key={sindex}>
								<TableCell>{s.value}</TableCell>
								<TableCell
									sx={{
										textAlign: "right",
									}}
								>
									<IconButton
										data-id={s.key}
										onClick={handleDelete}
									>
										<DeleteRounded />
									</IconButton>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default StudentsTable;
