import React from "react";
import PageHeader from "../../components/pageHeader";

function SessionSuspendRequest() {
	return (
		<main>
			<section>
				<div className="container">
					<PageHeader
						backLink={true}
						subheader="Утверждение заявки на прерывание сессии"
					/>
				</div>
			</section>
		</main>
	);
}

export default SessionSuspendRequest;
