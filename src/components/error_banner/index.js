import "./styles.scss";
import React from "react";
import PropTypes from "prop-types";

ErrorBanner.propTypes = {
	message: PropTypes.string,
	control: PropTypes.object,
};

function ErrorBanner(props) {
	return (
		<div className="banner error screen">
			<div className="message">
				<p>{props.message}</p>
			</div>
			{props.control}
		</div>
	);
}

export default ErrorBanner;
