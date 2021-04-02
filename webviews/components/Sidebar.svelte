<script>
    import { onMount } from "svelte";
    import GiCampingTent from 'svelte-icons/gi/GiCampingTent.svelte'
    import MdAdd from 'svelte-icons/md/MdAdd.svelte'
    import GiForestCamp from 'svelte-icons/gi/GiForestCamp.svelte'
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
    .sherpa-c-1 {
        display: flex;
        align-items: center;
    }
    .sherpa-icon {
        flex: 1 0 0;
    }
    .sherpa-journeys {
        flex: 3 0 0;
    }
</style>
<div class="sherpa-c-1">
    
    <div class="sherpa-icon svg-vsicon"
    ><GiForestCamp ></GiForestCamp></div>
    <div class="sherpa-journeys">Code Journeys</div>
</div>
<div>
    
</div>
<!-- <div class="svg-vsicon" on:click={()=>{
    tsvscode.postMessage({
        type: "command",
        value: "recordJourney"
    })
}}>

</div> -->
