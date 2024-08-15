import { IconButton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import "./index.scss";
import { CheckRounded } from "@mui/icons-material";
import React from "react";
import PropTypes from "prop-types";

EditLabel.propTypes = {
	val: PropTypes.string,
	onSave: PropTypes.func,
	groupId: PropTypes.number,
};

function EditLabel(props) {
	const [label, setLabel] = useState(props.val);
	const [showEditor, setShowEditor] = useState(false);

	useEffect(() => {
		setLabel(props.val);
	}, [props.val]);

	const handleChange = (e) => {
		setLabel(e.target.value);
	};

	const handleEdit = () => {
		setShowEditor(true);
	};

	const handleSave = () => {
		setShowEditor(false);
		props.onSave(label, props.groupId);
	};

	if (!showEditor) {
		return <span onClick={handleEdit}>{label}</span>;
	} else {
		return (
			<div className="edit-label-wrapper">
				<TextField
					inputRef={(input) => input && input.focus()}
					className="edit-label"
					variant="standard"
					value={label}
					onChange={handleChange}
				/>
				<IconButton onClick={handleSave}>
					<CheckRounded />
				</IconButton>
			</div>
		);
	}
}

export default EditLabel;
