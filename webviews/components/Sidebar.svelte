<script>
    import { onMount } from "svelte";
    import GiForestCamp from 'svelte-icons/gi/GiForestCamp.svelte'
    let sherpaConfig = {
        journeys:[]
    };
    
    onMount(()=>{
        tsvscode.postMessage({
            type: "mount",
        });
        window.addEventListener("message",(event)=>{
            const message = event.data;
            sherpaConfig = message.sherpaConfig;
            console.log({sherpaConfig});
            switch(message.type) {
                case 'readSherpaConfig':
                    break;
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
    
    {#each sherpaConfig.journeys as journey}
	<p>{journey.metadata.title}</p>
    {/each}
</div>
