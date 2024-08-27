const toDate = (dateStr) => {
	if (dateStr !== null) {
		if (dateStr.indexOf(".") >= 0) {
			const dateArr = dateStr.split(".");
			return new Date(dateArr[1] + "/" + dateArr[0] + "/" + dateArr[2]);
		} else {
			return new Date(dateStr);
		}
	}
	return null;
};

const formatRange = (from, to) => {
	const monthes = [
		"янв",
		"фев",
		"мар",
		"апр",
		"мая",
		"июн",
		"июл",
		"авг",
		"сен",
		"окт",
		"ноя",
		"дек",
	];

	const start = toDate(from);
	const end = toDate(to);

	const startIsCorrect = from !== null;
	const endIsCorrect = to !== null;
	let output = "";

	if (startIsCorrect && endIsCorrect) {
		const ds = start.getDate();
		const de = end.getDate();

		const ms = start.getMonth();
		const me = end.getMonth();

		const ys = start.getFullYear();
		const ye = end.getFullYear();

		output += ds.toString();

		if (ms !== me) {
			output += " " + monthes[ms];
		}

		if (ys !== ye) {
			output += " " + ye.toString() + " г.";
		}

		output += ` – ${de} ${monthes[me]} ${ye} г.`;
	}

	return output;
};

export default formatRange;
