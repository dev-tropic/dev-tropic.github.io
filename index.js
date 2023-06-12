/*
Placeholder for data object in the document context
*/
let data;




/*
Listen for html events in the document context after the DOM content is loaded 
*/
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('container').reset()

    const update = document.getElementById('update-button');
    update.mode = (method,ID)=>{ update.method=method; update.element=document.getElementById(ID); }
    update.addEventListener('click', ()=>update.method(update.element));

    document.getElementById('remote-read-radio').addEventListener('click', ()=>update.mode(readRemote, 'remote-read'));
    document.getElementById('local-read-radio').addEventListener('click', ()=>update.mode(readLocal,'local-read'));
    document.getElementById('local-write-radio').addEventListener('click', ()=>update.mode(writeLocal,'local-write'));

    document.getElementById('textview-plot').addEventListener('change', (event)=>checkPlot(event,"textView"));
    document.getElementById('table-plot').addEventListener('change', (event)=>checkPlot(event,"table"));
});




/*
Read data to a web-browser from remote URL: ex. https://get.geojs.io/v1/ip/country.json
*/
const readRemote = async (element)=>{
    let URL = element.value
    // console.log(URL);
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
Read data to a web-browser from local file
*/
const readLocal = async (element)=>{
    let file = element.files[0]
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
Write the current content from the document 'textView' to a local DOWNLOAD directory: ~/Downloads
*/
const writeLocal = (name='file.txt',
                    content=document.getElementById('textView').textContent)=>{
    const a = document.createElement("a");
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    a.href = window.URL.createObjectURL(blob);
    a.download = name;
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
    plot = document.getElementById('textView');
    if(!plot.hidden){
        plot.innerHTML = '';
        plot.textContent = JSON.stringify(data);
    }
    
    plot = document.getElementById('table');
    if(!plot.hidden){
        plot.innerHTML = '';
        table(data,'table');
    }
}




/*
Plot a table view of data attributes in the container 'table'
*/
const table = (data, ID='table')=>{
    new Traverse(data);
    const container = document.getElementById(ID);
    container.innerText = 'See the Table plot in the browser console (CTRL+SHIFT+I)'
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



