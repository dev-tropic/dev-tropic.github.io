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



/*
Plot data using each of the selected methods 
*/
function plotData(data){
    // document.getElementById('textView').textContent = JSON.stringify(data);
    traverseData(data);
}




/*
Recursively traverse object=data
*/
function traverseData(data, level=0, path='outline'){
    for(let item in data) {
        let root = document.getElementById(path);
        let li = document.createElement('li');
        li.innerHTML = item;
        root.appendChild(li);
        if (!!data[item] && typeof(data[item])=="object") {
            let new_path = `${path}/${item}`;
            let ul = document.createElement('ul');
            ul.id = new_path;
            root.appendChild(ul);
            traverseData(data[item], level+1, new_path);
        }
    }
}

