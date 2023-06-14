/*
Placeholder for data object in the document context
*/
let data;




class Task{

    constructor(ID='task-button'){
        this.site = document.getElementById(ID);
        this.site.addEventListener('click', ()=>this.activity(this.ID));
    }

    update(activity, ID){
        this.activity = activity;
        this.ID = ID;
        this.site.value = `${this.activity.name}()`
    }
}




/*
Listen for html events in the document context after the DOM content is loaded 
*/
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('container').reset()
    const task = new Task('task-button');

    console.log( document.getElementById('local-read') )
    
    document.getElementById('local-read-radio').addEventListener('click', ()=>task.update(readLocal, 'local-read'));
    document.getElementById('remote-read-radio').addEventListener('click', ()=>task.update(readRemote, 'remote-read'));
    document.getElementById('textarea-write-radio').addEventListener('click', ()=>task.update(saveFrom_textarea, 'textarea'));
    document.getElementById('local-write-radio').addEventListener('click', ()=>task.update(saveFrom_data, data));

    document.getElementById('textarea-checkbox').addEventListener('change', (event)=>checkPlot(event,"textarea"));
    document.getElementById('table-checkbox').addEventListener('change', (event)=>checkPlot(event,"table"));
});




/*
Read data and plot data from a remote URL: ex. https://get.geojs.io/v1/ip/country.json
*/
const readRemote = async (ID)=>{
    const URL =  document.getElementById(ID).value;
    try{
        data = await fetch(URL).then((response)=>response.json())
    }catch(e){
        console.warn(e.message);
    }finally{
        plotData(data);
    }

}




/*
Read and plot data from a local file 
*/
const readLocal = async (ID)=>{
    const file = document.getElementById(ID).files[0];
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
    }catch(e){
        console.warn(e.message);
    }finally{
        plotData(data);
    }

}



/*
Get the current content from the 'textarea' element and write it locally
*/
const saveFrom_textarea = (ID)=>{
    const text = document.getElementById(ID).value;
    writeLocal(text);
}




/*
Stringify the current data and write it locally
*/
const saveFrom_data = (data)=>{
    const json = JSON.stringify(data);
    writeLocal(json);
}



/*
Write the current content to a local DOWNLOAD directory: ~/Downloads
*/
const writeLocal = (content)=>{
    const a = document.createElement("a");
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'file.txt';
    a.text = 'blob'
    a.click(); 
}




/*
Toggle plot visibility based on checked state of bound legend element
*/
const checkPlot = (event, ID)=>{
    document.getElementById(ID).hidden = (event.target.checked) ? false : true;
}




/*
Plot data in each of the !hidden containers 
*/
const plotData = (data)=>{
    plot = document.getElementById('textarea');
    if(!plot.hidden){
        plot.innerHTML = '';
        plot.value = JSON.stringify(data);
    }
    
    plot = document.getElementById('table');
    if(!plot.hidden){
        plot.innerHTML = '';
        table(data,'table');
    }
}




/*
Plot a table view of data attributes in the 'table' container
*/
const table = (data, ID='table')=>{
    new Traverse(data);
    const container = document.getElementById(ID);
    container.innerText = 'See the browser console (F12, CTRL+SHIFT+I, CTRL+SHIFT+K)'
}




/*
Recursively traverse object and record attributes
*/
class Traverse{
    
    constructor(data=undefined){
        this.records = [];
        this.edges = this.traverse(data);
        console.log('ALL NODES'); console.table(this.records);
        console.log('ROOT NODES'); console.table(this.edges);
    }

    traverse(data=[], depth=0, edges=[]){
        for(let key in data){
            let value = data[key];
            let node = this.records.length;
            let record = {'NODE': node
                         ,'KEY': key
                         ,'TYPE': (typeof value)
                         ,'DEPTH': depth
                        }
            this.records.push(record);
            edges.push(record);
            record.VALUE = (record.TYPE==='object') ? this.traverse(value,depth+1) : value;
        }
        return edges;
    }
}



