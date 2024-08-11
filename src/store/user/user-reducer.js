const initialState = {
	fullname: "",
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, action };
		case "LOGOUT":
			return { ...state, action };
		default:
			return state;
	}
};

export default userReducer;
