var jsonData;
var guessedRight;
var ansRevealed = false;
var c = new jsCanvas(document.getElementById("canvDiv"))
var textSizeMod
if(window.outerWidth<600){
    textSizeMod = 2.5
}
else{
    textSizeMod = 1
}
fetch("https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json").then(r => r.json()).then(function(data){
    jsonData = data;
    document.getElementById("corrMsg").innerHTML = "Loading completed. Starting the game...";
    console.log("Loading completed")
    //TODO  Temp trigger, implement a more permanent method
    guessRoute()
})

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
    guessedRight = document.getElementById("routeName").value==routeData.routeNameC;
    if(guessedRight){
        document.getElementById("corrMsg").innerHTML = "Correct! Refresh this page for new route";
        document.getElementById("corrMsg").style.color = "Green";
    }
    else{
        document.getElementById("corrMsg").innerHTML = "Wrong!";
        document.getElementById("corrMsg").style.color = "Red";
    }
}

function showAns(){
    alert("The answer is " + routeData.routeNameC)
    ansRevealed = true
}