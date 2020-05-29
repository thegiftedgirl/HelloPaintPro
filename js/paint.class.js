import Point from './point.model.js';
import { TOOL_BRUSH,TOOL_RECTANGLE, TOOL_CIRCLE, TOOL_LINE, 
    TOOL_PENCIL, TOOL_TRIANGLE, TOOL_PAINT_BUCKET, TOOL_ERASER } from './tool.js';
import { getMouseCoordsOnCanvas, findDistance }  from './utility.js';


    export default class Paint {



    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext("2d");
    }
    set activeTool(tool){
        this.tool = tool;
    }

    set lineWidth(linewidth){
        this._lineWidth = linewidth;
        this.context.lineWidth = this._lineWidth;
    }
    set brushSize(brushsize){
        this._brushSize = brushsize;
    }

    init(){
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){
    this.savedData = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)

        this.canvas.onmousemove= e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPosition = getMouseCoordsOnCanvas(e, this.canvas);

        if(this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH){
            this.context.beginPath();
            this.context.moveTo(this.startPosition.x, this.startPosition.y);
        }
    }
    onMouseMove(e){
        this.currentPosition = getMouseCoordsOnCanvas(e, this.canvas);
        console.log(this.currentPosition);
        
        switch(this.tool){
            case TOOL_LINE:
            case TOOL_RECTANGLE:
            case TOOL_CIRCLE:
            case TOOL_TRIANGLE:
                this.drawShape();
                break;
            case TOOL_PENCIL:
                this.drawFreeLine(this._lineWidth);
                break;
            case TOOL_BRUSH:
                this.drawFreeLine(this._brushSize);
               
                default:
                break;
        }
    }
    onMouseUp(e){

        this.canvas.onmousemove = null;
        document.onmouseup = null; 
    }

    drawShape(){
        this.context.putImageData(this.savedData, 0, 0);

        this.context.beginPath();

        if(this.tool == TOOL_LINE){
            this.context.moveTo(this.startPosition.x, this.startPosition.y);
            this.context.lineTo(this.currentPosition.x, this.currentPosition.y);
        }else if(this.tool == TOOL_RECTANGLE){
            this.context.rect(this.startPosition.x, this.startPosition.y, this.currentPosition.x - this.startPosition.x, this.currentPosition.y - this.startPosition.y);
        }else if(this.tool == TOOL_CIRCLE){
            let distance = findDistance(this.startPosition, this.currentPosition);
            this.context.arc(this.startPosition.x, this.startPosition.y, distance, 0, 2 * Math.PI, false);
        
        }else if(this.tool == TOOL_TRIANGLE){
            this.context.moveTo(this.startPosition.x + (this.currentPosition.x - this.startPosition.x)/ 2, this.startPosition.y);
            this.context.lineTo(this.startPosition.x, this.currentPosition.y);
            this.context.lineTo(this.currentPosition.x, this.currentPosition.y);
            this.context.closePath();
        }
        this.context.stroke();
    }
    drawFreeLine(lineWidth){
        this.context.lineWidth = lineWidth;
        this.context.lineTo(this.currentPosition.x, this.currentPosition.y);
        this.context.stroke();

    };
}
