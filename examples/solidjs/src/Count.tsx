import { createSignal, Component } from 'solid-js'

export type CountProps = { count?: number };

export const Count: Component<CountProps> = (props) => {
	const [value, setValue] = createSignal(props.count ?? 5);

	return <>
		<button onClick={() => setValue(v => v - 1)}>--</button>
		<span>{value()}</span>
		<button onClick={() => setValue(v => v + 1)}>++</button>
	</>
}
