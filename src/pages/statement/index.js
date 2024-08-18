import PageHeader from "../../components/pageHeader";
import "./index.scss";
import StatementData from "./components/statement-data/";
import StatementTable from "./components/statement-table";
import React from "react";

/**
 * Страница ведомости
 */
function Statement() {
	// DOM
	return (
		<>
			<main id="statement">
				<section>
					<div className="container">
						<PageHeader
							header="Программирование"
							backLink={true}
							subheader="Редактирование ведомости"
						/>
					</div>
					<div className="container" style={{ marginBottom: "40px" }}>
						<StatementData />
						<StatementTable />
					</div>
				</section>
			</main>
		</>
	);
}

export default Statement;
