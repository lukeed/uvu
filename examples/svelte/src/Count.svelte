<script>
	export let count = 5;

	function increment() {
		count++;
	}

	function decrement() {
		count--;
	}
</script>

<button id="decr" on:click={decrement}>--</button>
<span>{count}</span>
<button id="incr" on:click={increment}>++</button>
