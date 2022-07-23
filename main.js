var jsonData;
var guessedRight;
fetch("https://static.data.gov.hk/td/routes-fares-geojson/JSON_BUS.json").then(r => r.json()).then(function(data){
    jsonData = data;
    document.getElementById("corrMsg").innerHTML = "Loading completed. Starting the game...";
    console.log("Loading completed")
    //TODO  Temp trigger, implement a more permanent method
    guessRoute()
})

function randint(a,b){
    return Math.floor(Math.random()*(b - a + 1) ) + a;
}


function guessRoute(){
    routeData = jsonData[randint(0,jsonData.length-1)];
    console.log(routeData)
    setTimeout(newStop,2000)
    var routeType = randint(0,routeData.rstop.length-1)
    function newStop(){
        if(!guessedRight){
            setTimeout(newStop,2000);
        }
        let rstops = routeData.rstop;
        //Check for empty rstops (usually in CTB/NWFB)
        while(rstops[routeType].features.length==0){
            routeType = randint(0,routeData.rstop.length-1)
        }
        document.getElementById("stopNames").innerHTML += "<br>" + rstops[routeType].features[randint(0,rstops[routeType].features.length-1)].properties.stopNameC
    }
}

function checkCorrectRoute(){
    guessedRight = document.getElementById("routeName").value==routeData.routeNameC;
    if(guessedRight){
        document.getElementById("corrMsg").innerHTML = "Correct!";
        document.getElementById("corrMsg").style.color = "Green";
    }
    else{
        document.getElementById("corrMsg").innerHTML = "Wrong!";
        document.getElementById("corrMsg").style.color = "Red";
    }
}