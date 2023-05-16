/*
Placeholder for data object in the documet context
*/
let data;



/*
Listen for html events in the document context after the DOM content is loaded 
*/
document.addEventListener("DOMContentLoaded", function(){
    console.log("DOM content has loaded");
    document.getElementById('remote-read').addEventListener('change', (event)=>readRemote(event.target.value));
    document.getElementById('local-read').addEventListener('change', (event)=>readLocal(event.target.files[0]));
    document.getElementById('local-write').addEventListener('change', (event)=>writeLocal(event.target.value));

    document.getElementById('textview-plot').addEventListener('change', (event)=>checkPlot(event,"textView"));
    document.getElementById('outline-plot').addEventListener('change', (event)=>checkPlot(event,"outline"));
    document.getElementById('SVG-plot').addEventListener('change', (event)=>checkPlot(event,"SVG"));
});




/*
Read data to a web-browser from remote URL: ex. https://get.geojs.io/v1/ip/country.json
*/
async function readRemote(URL){
    console.log(URL);
    try{
        data = await fetch(URL).then((response)=>response.json())
        console.log(data);
    }catch(e){
        console.warn(e.message);
    }finally{
        plotData(data);
    }

}




/*
Read data to a web-browser from local FILE: 
*/
async function readLocal(file){
    console.log(file);
    try{
        data = await new Promise(
            (pass, fail)=>{
                const reader = new FileReader();
                reader.onload = ()=>pass(JSON.parse(reader.result));
                reader.onerror = ()=>{
                    reader.abort();
                    fail(new DOMException("File read error."));
                }
                reader.readAsText(file);
            }
        );
        console.log(data)
    }catch(e){
        console.warn(e.message);
    }finally{
        plotData(data);
    }

}



/*
Write data from a web-browser to local DOWNLOAD: ~/Downloads
*/
function writeLocal(name='file.txt',
                    content=document.getElementById('textView').textContent){
    console.log(name);
    const a = document.createElement("a");
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
    a.text = 'blob'
    a.click(); 
}



function checkPlot(event,plotID){
    let checked = event.target.checked;
    if(checked){
        document.getElementById(plotID).hidden = false;
        // document.getElementById(plotID).style.visibility = 'visible'
        // document.getElementById(plotID).removeAttribute("hidden")
        // document.getElementById(plotID).style.display = 'block';
        // document.getElementById(plotID).style.display = 'inline';
    }else{
        document.getElementById(plotID).hidden = true;
        // document.getElementById(plotID).setAttribute("hidden","");
        // document.getElementById(plotID).style.visibility = 'hidden'
        // document.getElementById(plotID).style.display = 'none';
    }
}



/*
Plot data using each of the selected methods 
*/
function plotData(data, plot=undefined){
    plot = document.getElementById('textView');
    if(!plot.hidden){
        plot.innerHTML = '';
        plot.textContent = JSON.stringify(data);
    }
    
    plot = document.getElementById('outline');
    if(!plot.hidden){
        plot.innerHTML = '';
        traverseData(data);
    }
}




/*
Recursively traverse object=data
*/
function traverseData(data, level=0, ID='outline'){
    for(let item in data) {
        let root = document.getElementById(ID);
        let li = document.createElement('li');
        li.innerHTML = item;
        root.appendChild(li);
        if (!!data[item] && typeof(data[item])=="object") {
            let new_ID = `${ID}/${item}`;
            let ul = document.createElement('ul');
            ul.id = new_ID;
            root.appendChild(ul);
            traverseData(data[item], level+1, new_ID);
        }
    }
}

