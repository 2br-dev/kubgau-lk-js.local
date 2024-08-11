const initialState = {
	name: "Выберите семестр",
};

const semesterReducer = (state = initialState, action) => {
	switch (action.type) {
		case "write":
			return { ...state, name: action.payload };
		default:
			return state;
	}
};

export default semesterReducer;
