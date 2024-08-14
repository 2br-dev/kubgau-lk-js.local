import "./index.scss";
import React from "react";
import PropTypes from "prop-types";

KVPair.propTypes = {
	_className: PropTypes.string,
	_value: PropTypes.any,
	_key: PropTypes.string,
};

/**
 * Вывод пары ключ-значение
 * @param {string} _key - Ключ
 * @param {*} _value - Значение
 * @param {string} _className? - Дополнительный класс
 */
function KVPair(props) {
	const extraClass = !props._className ? "" : " " + props._className;

	if (props._value) {
		return (
			<div className={"kv-pair" + extraClass}>
				<div className="key">{props._key}</div>
				<div className="value">{props._value}</div>
			</div>
		);
	}
}

export default KVPair;
