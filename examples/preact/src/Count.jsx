import { h, Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { act } from 'preact/test-utils';

export default function Counter(props) {
	const { count=5 } = props;
	const [value, setValue] = useState(count);

	function decrement(ev) {
		console.log('INSIDE DECREMENT');
		setValue(value - 1);
	}

	return (
		<>
			<button id="decr" onClick={decrement}>--</button>
			<span>{count}</span>
			<button id="incr" onClick={() => setValue(value + 1)}>++</button>
		</>
	);
}
