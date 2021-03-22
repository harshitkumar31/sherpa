<script>
    import { onMount } from "svelte";
    
    
    let sherpaConfig = {};
    
    onMount(()=>{
        window.addEventListener("message",(event)=>{
            const message = event.data;
            sherpaConfig = JSON.parse(message.sherpaConfig);
            switch(message.type) {
                default:
                break;
            }
        });
    });
</script>
<style>
    
</style>
<div>
    
    <div>{JSON.stringify(sherpaConfig)}</div>
    
</div>
<button on:click={()=>{
    tsvscode.postMessage({
        type: "onInfo",
        value: "Jaa Naa"
    })
}}>
Click me
</button>