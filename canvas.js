class jsCanvas{
    constructor(element){
        this.cele = document.createElement("canvas")
        this.cele.setAttribute("id","___can___")
        this.cele.style.width = "100%"
        this.cele.style.height = "100%"
        //this.cele.style.display = ""
        element.appendChild(this.cele)
        this.parent = element;
        //this.cele.style.backgroundColor = "green"
        this.canvasEle = this.cele
        this.can2d = this.cele.getContext("2d");
        this.canvas_offset = [this.can2d.canvas.offsetLeft,this.can2d.canvas.offsetTop]
        this.prevX,this.prevY = 0
        this.isClicking  = false

        this.undoStack = []

        //console.log(this.canvas_offset[0])

        this.can2d.canvas.width = window.innerWidth - this.canvas_offset[0];
        this.can2d.canvas.height = window.innerHeight - this.canvas_offset[1];

        this.isFreeDraw = false;


        ////////// EVENT LISTENER /////////
        
        /*
        this.cursorStart = e => this.moveCursor(e)
        this.cursorMoving = e => this.cursorMove(e)
        this.cursorEnd = e => this.stopCursorMove(e)
        window.addEventListener("mousedown",this.cursorStart)
        window.addEventListener("mousemove",this.cursorMoving)
        window.addEventListener('mouseup', this.cursorEnd) 
            
        this.cursorStartM = e => this.moveCursorM(e)
        this.cursorMovingM = e => this.cursorMoveM(e)
        this.cursorEndM = e => this.stopCursorMoveM(e)
        window.addEventListener('touchstart',this.cursorStartM)
        window.addEventListener("touchmove",this.cursorMoveingM)
        window.addEventListener('touchend', this.cursorEndM)
        /* */
    }

    set isFreeDraw(val){
        if(val){
            this.cursorStart = e => this.moveCursor(e)
            this.cursorMoving = e => this.cursorMove(e)
            this.cursorEnd = e => this.stopCursorMove(e)
            window.addEventListener("mousedown",this.cursorStart)
            window.addEventListener("mousemove",this.cursorMoving)
            window.addEventListener('mouseup', this.cursorEnd) 
                
            this.cursorStartM = e => this.moveCursorM(e)
            this.cursorMovingM = e => this.cursorMoveM(e)
            this.cursorEndM = e => this.stopCursorMoveM(e)
            window.addEventListener('touchstart',this.cursorStartM)
            window.addEventListener("touchmove",this.cursorMoveingM)
            window.addEventListener('touchend', this.cursorEndM)
        }
        else{
            window.removeEventListener("mousedown",this.cursorStart)
            window.removeEventListener("mousemove",this.cursorMoving)
            window.removeEventListener('mouseup', this.cursorEnd) 
                
            window.removeEventListener('touchstart',this.cursorStartM)
            window.removeEventListener("touchmove",this.cursorMoveingM)
            window.removeEventListener('touchend', this.cursorEndM)
        }
    }

    moveCursor(e){
        this.prevX = e.clientX - this.canvas_offset[0]
        this.prevY = e.clientY - this.canvas_offset[1]
        this.isClicking = true
    }

    cursorMove(e){
            if(this.isClicking){
                this.can2d.beginPath()
                this.can2d.moveTo(this.prevX,this.prevY)
                this.can2d.lineTo(e.clientX - this.canvas_offset[0],e.clientY - this.canvas_offset[1])
                this.can2d.lineWidth = 5;
                this.can2d.lineCap = 'round';
                this.can2d.stroke()
                this.prevX = e.clientX - this.canvas_offset[0]
                this.prevY = e.clientY - this.canvas_offset[1]
            }
        
    }
    stopCursorMove(){
        /*myGameArea.x = false;
        myGameArea.y = false;*/
        this.isClicking = false
    }


    moveCursorM(e){
        this.prevX = e.changedTouches[0].clientX - this.canvas_offset[0]
        this.prevY = e.changedTouches[0].clientY - this.canvas_offset[1]
        this.isClicking = true
    }

    cursorMoveM(e){
            if(this.isClicking){
                this.can2d.beginPath()
                this.can2d.moveTo(prevX,prevY)
                this.can2d.lineTo(e.changedTouches[0].clientX - this.canvas_offset[0],e.changedTouches[0].clientY - this.canvas_offset[1])
                this.can2d.lineWidth = 5;
                this.can2d.lineCap = 'round';
                this.can2d.stroke()
                this.prevX = e.changedTouches[0].clientX - this.canvas_offset[0]
                this.prevY = e.changedTouches[0].clientY - this.canvas_offset[1]
            }
        
    }

    clearCanvas(){
        this.can2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setCursorDown(fun){
        this.cursorStart = fun
        this.parent.addEventListener("mousedown",this.cursorStart)

        this.cursorStartM = fun
        this.parent.addEventListener("touchstart",this.cursorStartM,{passive: true})
    }

    setCursorMove(fun){
        this.cursorMoving = fun
        this.parent.addEventListener("mousemove",this.cursorMoving)

        this.cursorMovingM = fun
        this.parent.addEventListener("touchmove",this.cursorMovingM,{passive: true})
    }
    setCursorUp(fun){
        this.cursorEnd = fun
        this.parent.addEventListener("mouseup",this.cursorEnd)

        this.cursorEndM = fun
        this.parent.addEventListener("touchend",this.cursorEndM,{passive: true})
    }

    /*set Can2d(c){
        //this.can2d = this.can2d[c]
        //return
    }
    get Can2d(){
        return this.can2d
    }*/

    getXOffset(xval){
        return xval - this.canvas_offset[0]
    }
    getYOffset(yval){
        return yval - this.canvas_offset[1]
    }
    setOffsetCanvas(){
        this.canvas_offset = [this.can2d.canvas.offsetLeft,this.can2d.canvas.offsetTop]
    }   
    setOffsetElement(){
        this.canvas_offset = [this.cele.offsetLeft,this.cele.offsetTop]
    }
    setOffsetParent(){
        this.canvas_offset = [this.parent.offsetLeft,this.parent.offsetTop]
    }


    startGraphicUpdate(){
        this.savedImgData = this.can2d.getImageData(0, 0, this.can2d.canvas.width, this.can2d.canvas.height);
    }
    finishGraphicUpdate(){
        this.can2d.putImageData(this.savedImgData,0,0)
    }

    addImgStack(){
        this.undoStack.push(this.can2d.getImageData(0, 0, this.can2d.canvas.width, this.can2d.canvas.height));
    }
    undo(){
        this.can2d.putImageData(this.undoStack.pop(),0,0)
        //In future: check if pop() returns undefined to prevent Error
    }

    drawTextAtAngel(text,x,y,a){
        this.can2d.save();
        this.can2d.translate(x, y);
        this.can2d.rotate(Math.PI/(360/a));
        this.can2d.textAlign = "center";
        this.can2d.fillText(text, x, 0);
        this.can2d.restore();
    }
}




function start(){
    //testCan.can2d.fillStyle = "#FF0000";
    //testCan.can2d.fillRect(0, 0, 150, 75);

    testCan.setCursorDown(function(e){
        //alert("yes")
    })
}
//var testCan = new jsCanvas(document.getElementById("can"));
//testCan.isFreeDraw = true
//start()

