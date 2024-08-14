const studentAbsent = (student, dayIndex) => {
	if (student) {
		if (student.lessons) {
			const day = student.lessons[dayIndex];
			if (!day) return "";
			let certificates = student.certificatesOfSkipping
				.map((s) => {
					return {
						from: s.fromDate,
						to: s.toDate,
					};
				})
				.flat();
			const date = day.lessonDate;

			const aliby = certificates.map((s) => {
				let from = new Date(s.from);
				let to = new Date(s.to);
				let current = new Date(date);

				return current >= from && current <= to;
			})[0];

			if (day.attended) {
				// Пропуск
				return aliby ? "soft-absent" : "absent";
			}

			return "";
		}
	}
};

export default studentAbsent;
