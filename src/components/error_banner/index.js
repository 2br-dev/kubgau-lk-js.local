import "./styles.scss"

function ErrorBanner(props) {
	
	return (
		<div className="banner error screen">
			<div className="message">
				<p>{props.message}</p>
			</div>
			{ props.control }
		</div>
	)
}

export default ErrorBanner
