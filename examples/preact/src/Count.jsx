import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter(props) {
	const { count=5 } = props;
	const [value, setValue] = useState(count);

	return (
		<>
			<button id="decr" onClick={() => setValue(value - 1)}>--</button>
			<span>{value}</span>
			<button id="incr" onClick={() => setValue(value + 1)}>++</button>
		</>
	);
}
