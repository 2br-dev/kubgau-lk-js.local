import "./index.scss";

/**
 * Вывод пары ключ-значение
 * @param {string} _key - Ключ
 * @param {*} _value - Значение
 */
function KVPair(props) {
	if (props._value) {
		return (
			<div className="kv-pair">
				<div className="key">{props._key}</div>
				<div className="value">{props._value}</div>
			</div>
		);
	}
}

export default KVPair;
