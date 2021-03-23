<script>
    import { onMount } from "svelte";
    import GiCampingTent from 'svelte-icons/gi/GiCampingTent.svelte'
    
    let sherpaConfig = "{}";
    
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
<div class="svg-vsicon" >
    <GiCampingTent ></GiCampingTent>
</div>
<div>{JSON.parse(sherpaConfig)}</div>
<button on:click={()=>{
    tsvscode.postMessage({
        type: "onInfo",
        value: "Jaa Naa"
    })
}}>
Click me
</button>