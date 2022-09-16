var jsonData;
var guessedRight;
var ansRevealed = false;
var c = new jsCanvas(document.getElementById("canvDiv"))
var textSizeMod;

var cacheJsonData;

//Open indexedDB
//NOTE Change to jsonTransitData for actual release
const dbName = "jsonTransitData"
var idxReq = indexedDB.open(dbName,2)
var isUpdating = false;

if(window.outerWidth<600){
    textSizeMod = 2.5
}
else{
    textSizeMod = 1
}

// Load data from json
idxReq.onsuccess = function(){
    let db = idxReq.result;

    console.log("Successfully connected", db.objectStoreNames.contains('busJson'))

    /*if (!db.objectStoreNames.contains('busJson')) { // Check for object store
        //idxReq.deleteObjectStore("busJson")
        if(!isUpdating){
            indexedDB.deleteDatabase(dbName)
            alert("Failed to load local routes data. Press OK to clear cached data and retry (No object store!)");
            location.reload();
            return
        }
    //}*/
    if(!isUpdating){
        getTransactData(db)
    }
}

function updateData(db){
    //console.log("bvgfdgv")
    isUpdating = true;
    fetch("https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json").then(r => r.json()
    ).then(function(data){
        //const dataStr = JSON.stringify(data)
        transactData(db,data,"bus")
        //console.log(dataStr.length/2)
        loadComplete(data);
    });
}

// Load data from data.gov.hk
idxReq.onupgradeneeded = function(){
    let db = idxReq.result;
    if (!db.objectStoreNames.contains('busJson')) { // Check for object store
        db.createObjectStore('busJson', {keyPath: 'type'});
    }
    updateData(db)
}

function transactData(db,jsonDataStore,type_){
    let tJson = db.transaction("busJson", "readwrite").objectStore("busJson");

    let datas = {
        type: type_,
        date: new Date(),
        data: jsonDataStore
    };
    
    let t_req = tJson.add(datas);
    
    t_req.onsuccess = function() {
        console.log("Data added", t_req.result);
    };
    
    t_req.onerror = function() {
        console.log("Error: ", t_req.error);
    };
}

function getTransactData(db){
    try{
        var tJson = db.transaction("busJson", "readwrite").objectStore("busJson"); 
    }
    catch(e){
        indexedDB.deleteDatabase(dbName)

        alert("Failed to load local routes data. Press OK to clear cached data and retry");
        location.reload();
        return
    }
    let get_req = tJson.get("bus")

    get_req.onerror = function(){
        indexedDB.deleteDatabase(dbName)

        alert("Failed to load local routes data. Press OK to clear cached data and retry (Failed to load data)");
        location.reload();

    }

    get_req.onsuccess = function(){
        console.log(get_req.result)
        if(get_req.result===undefined){
            indexedDB.deleteDatabase(dbName)

            alert("Failed to load local routes data. Press OK to clear cached data and retry (Data is undefined)");
            location.reload();
        }
        //console.log(get_req.result.date)
        document.getElementById("lastFetch").innerHTML = "Database fetched at: " + get_req.result.date
        loadComplete(get_req.result.data)
    }
}


function loadComplete(d){
    jsonData = d;
    document.getElementById("corrMsg").innerHTML = "Loading completed. Starting the game...";
    console.log("Loading completed");
    //TODO  Temp trigger, implement a more permanent method
    guessRoute();
}

//Dark mode config
if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    c.cele.style.backgroundColor = "black"
}

function randint(a,b){
    return Math.floor(Math.random()*(b - a + 1) ) + a;
}

function guessRoute(){
    routeData = jsonData[randint(0,jsonData.length-1)];
    console.log(routeData)
    //Start the timer
    setTimeout(newStop,2000)
    //Choose route type
    var routeType = randint(0,routeData.rstop.length-1)
    function newStop(){
        if(!(guessedRight || ansRevealed)){
            setTimeout(newStop,2000);
        }
        let rstops = routeData.rstop;
        //Check for empty rstops (usually in CTB/NWFB)
        while(rstops[routeType].features.length==0){
            routeType = randint(0,routeData.rstop.length-1)
        }
        const curStopName = rstops[routeType].features[randint(0,rstops[routeType].features.length-1)].properties.stopNameC
        c.can2d.font = (randint(25,75)/textSizeMod) + "px sans-serif";
        if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
            c.can2d.fillStyle = "white"
        }
        let angel = randint(0,360)
        let x = randint(0,c.can2d.canvas.width-25)
        let y = randint(0,c.can2d.canvas.height)
        console.log(x + "," + y + "-" + angel)
        c.drawTextAtAngel(curStopName,x,y,angel)
        document.getElementById("stopNames").innerHTML += "<br>" + curStopName
    }
}

function checkCorrectRoute(){
    guessedRight = document.getElementById("routeName").value.toUpperCase()==routeData.routeNameC;
    if(guessedRight){
        document.getElementById("corrMsg").innerHTML = "Correct! Refresh this page for new route (question)";
        document.getElementById("corrMsg").style.color = "Green";
    }
    else{
        document.getElementById("corrMsg").innerHTML = "Wrong!";
        document.getElementById("corrMsg").style.color = "Red";
    }
}
document.getElementById("routeName").onkeyup = function(evt){
    if(evt.key=="Enter"){
        checkCorrectRoute()
    }
}

function showAns(){
    alert("The answer is " + routeData.routeNameC)
    ansRevealed = true
    document.getElementById("corrMsg").innerHTML = "Refresh this page for new route (question) "
}

function isLetter(ch) {
    return ch.length === 1 && ch.match(/[a-z]/i);
}

function showSuffix(){
    if(isLetter(routeData.routeNameC.slice(routeData.routeNameC.length-1))){
        document.getElementById("hintMsg").innerHTML += "Suffix (Last character): " + routeData.routeNameC.slice(routeData.routeNameC.length-1) + "<br>"
    }
    else{
        document.getElementById("hintMsg").innerHTML += "No suffix " + "<br>"
    }
    document.getElementById("showSuffix").style.display = "none"
}
function showPrefix(){
    if(isLetter(routeData.routeNameC.slice(0))){
        document.getElementById("hintMsg").innerHTML += "Prefix (Last character): " + routeData.routeNameC.slice(0) + "<br>"
    }
    else{
        document.getElementById("hintMsg").innerHTML += "No Prefix " + "<br>"
    }
    document.getElementById("showPrefix").style.display = "none"
}

function showCodeLen(){
    document.getElementById("hintMsg").innerHTML += " Route Length:" + routeData.routeNameC.length + "<br>"
    document.getElementById("showCodeLen").style.display = "none"
}

function deleteDatabaseAndReload(){
    indexedDB.deleteDatabase(dbName)

    location.reload();
}
