import React from "react";
import { List, ListItemButton } from "@mui/material";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

SectionList.propTypes = {
	items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function SectionList(props) {
	return (
		<List>
			{props.items.map((item, index) => (
				<ListItemButton
					sx={{ borderTop: "1px solid #ccc" }}
					component={Link}
					to={item.url}
					key={index}
				>
					{item.title}
				</ListItemButton>
			))}
		</List>
	);
}

export default SectionList;
