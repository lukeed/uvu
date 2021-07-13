<script>
    type CountResult = number
    export let count: CountResult = 5;

    function increment(): void {
        count++;
    }

    function decrement(): void {
        count--;
    }
</script>

<button id="decr" on:click={decrement}>--</button>
<span>{count}</span>
<button id="incr" on:click={increment}>++</button>
