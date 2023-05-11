/* Javascript prototype */
document.addEventListener("DOMContentLoaded", function(){
    console.log("DOM content has loaded");
    document.getElementById('remote-read').addEventListener('change', (event)=>remoteRead(event.target.value));
    document.getElementById('local-read').addEventListener('change', (event)=>localRead(event.target.files[0]));
    document.getElementById('local-write').addEventListener('change', (event)=>localWrite(event.target.value));
});




/*
Read data to a web-browser from remote URL: ex. https://get.geojs.io/v1/ip/country.json
*/
async function remoteRead(URL){
    console.log(URL);
    let produce;
    try{
        produce = await fetch(URL)
                       .then((response)=>response.json())
                       .then((json)=>JSON.stringify(json));
        console.log(produce);
    }catch(e){
        produce = e.message;
        console.warn(produce);
    }finally{
        document.getElementById('textView').textContent = produce;
    }

}


/*
Read data to a web-browser from local FILE: 
*/
async function localRead(file){
    console.log(file);
    let produce;
    try{
        produce = await new Promise(
            (pass, fail)=>{
                const reader = new FileReader();
                reader.onload = ()=>pass(reader.result);
                reader.onerror = ()=>{
                    reader.abort();
                    fail(new DOMException("File read error."));
                }
                reader.readAsText(file);
            }
        );
        console.log(produce)
    }catch(e){
        produce = e.message
        console.warn(produce);
    }finally{
        document.getElementById('textView').textContent = produce;
    }

}



/*
Write data from a web-browser to local DOWNLOAD: ~/Downloads
*/
function localWrite(name='file.txt',
                    content=document.getElementById('textView').textContent){
    console.log(name);
    const a = document.createElement("a");
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.text = 'blob'
    a.click(); 
}



