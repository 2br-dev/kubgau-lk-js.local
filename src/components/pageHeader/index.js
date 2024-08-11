import { useNavigate } from "react-router-dom";
import { ChevronLeftRounded } from "@mui/icons-material";
import './index.scss';

/**
 * @param {string} header - Заголовок страницы
 * @param {string} subheader - Подзаголовок окна
 * @param {React.Element} prefix - Контрол в заголовке
 * @param {React.Element} suffix - Контрол справа от заголовка
 * @param {boolean} backLink - Кнопка "назад"
 * @returns 
 */
function PageHeader(props){

	const navigate = useNavigate();

	const back = () => {
		navigate(-1);
	}

	const headerControl = () => {
		if(typeof props.header === "string"){
			return <h1>{props.header}</h1>;
		}else{
			return props.header;
		}
	}

	const backLink = () => {
		if(props.backLink){
			return(
				<div className="back-link screen">
					<a href="#!" onClick={back} className="icon-block">
						<ChevronLeftRounded />
						Назад
					</a>
					<span>{props.subheader}</span>
				</div>
			)
		}

		return <></>;
	}
	
	return (
		<div className="cab-header">
			<div className="header-wrapper">
				{ backLink() }
				<div className="header-control">
					{ headerControl() }
					{ props.suffix }
				</div>
			</div>
		</div>
	)
}

export default PageHeader;