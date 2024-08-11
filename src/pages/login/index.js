import React from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import store from "../../store";
import "./styles.scss";

/** Страница входа */
function LoginScreen() {
	const [login, setLogin] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [snackOpen, setSnackOpen] = useState(false);
	const [messageType, setMessageType] = useState("success");

	/** Процедура входа */
	const Do_login = () => {
		if (login !== "admin") {
			// Заглушка для ошибки входа
			setMessage("Неверная пара логин/пароль!");
			setMessageType("error");
			setSnackOpen(true);
		} else {
			// Заглушка для успешного входа
			setMessage("Добро пожаловать, Татьяна Анатольевна!");
			setMessageType("success");
			setSnackOpen(true);

			// Нужно заменить на актуальные данные
			let user = {
				login: login,
				fullname: "Татьяна Анатольевна",
				shortName: "Крамаренко А.В",
				role: "admin",
			};

			// Сохранение пользователя в localStorage
			localStorage.setItem("loggedUser", JSON.stringify(user));

			// Сохранение пользователя в store
			store.dispatch({
				type: "SET_USER",
				payload: user,
			});

			// Переходим на главную страницу после отображения приветствия
			setTimeout(() => {
				navigate("/main/courses");
			}, 800);
		}
	};

	/** Рендер компонента */
	return (
		<div className="login-screen">
			<Card className="login-card">
				<CardContent sx={{ padding: "30px" }}>
					<h1>Вход</h1>
					<div className="field">
						<TextField
							value={login}
							sx={{ width: 280 }}
							name="login"
							label="Логин"
							onChange={(e) => setLogin(e.target.value)}
						/>
					</div>
					<div className="field">
						<TextField
							value={password}
							sx={{ width: 280 }}
							name="password"
							label="Пароль"
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="field">
						<Button onClick={Do_login} variant="contained">
							Войти
						</Button>
					</div>
				</CardContent>
				<Snackbar
					open={snackOpen}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
				>
					<Alert severity={messageType}>{message}</Alert>
				</Snackbar>
			</Card>
		</div>
	);
}

export default LoginScreen;
