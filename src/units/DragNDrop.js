import React from "react";
import TextUnits from "./TextUnits"

class DragNDrop extends React.Component
{
    elements = [];
    dragElement = null;
    oldParent = null; 
    constructor(props)
    {
        super(props);
        this.state = {
            dragField : null,
            dropFields: null,
            pointerDown: this.pointDown.bind(this),
            pointerMove: this.pointMove.bind(this),
            pointerUp: this.pointUp.bind(this),
            condition: true
        }
        
    }
    render()
    {
        return <div className="Grid" style={{gridTemplateColumns: `${this.props.data.fields.length}fr 1fr`, gap: "20px", minHeight: "500px"}}>
            {this.state.dropFields}
            {this.state.dragField}
        </div>
    }
    componentDidMount()
    {
        this.setState({
            dragField: this.getDragField(), 
            dropFields: this.initDropFields()
        });  
        this.props.start.control.current.state.mount([{click: this.startCheck.bind(this), text: "Проверить"}]);
        this.props.start.up.current.state.update("FlexCenter");
        this.props.start.up.current.state.set(<TextUnits textValue={this.props.data.taskText}/>);
    }
    initDropFields()
    {
        return <div className="Grid" style={{gridColumnStart: "1", gridColumnEnd: "2", gridTemplateColumns: `repeat(${this.props.data.fields.length}, 1fr)`}}>
            {this.props.data.fields.map((field, index) =>(
            <div key={index} className="Grid" style={{gridTemplateRows: "auto 10fr"}} >
                <div className="FullBlock">{field}</div>
                <div className="Banner FlexInsideUp Drops" data-type="dropField" data-field={field}></div>
            </div>))}
        </div>
    }
    getDragField()
    {
        return (<div className="Banner FlexInsideUp" data-type="dropField" id="dragField"
                style={{gridColumnStart: "2", gridColumnEnd: "3", background: "#f4f4f4"}}>
                    {this.props.data.words.map((element, index) => (
                        <div 
                            key={index} 
                            style= {{margin:'2px', fontSize: "1rem", padding:"5px"}} 
                            className="Banner Pointer"            
                            onPointerDown={this.state.pointerDown}
                            data-type = "element" data-field={element[1]}>{element[0]}       
                        </div>))}
        </div>)
    }   
    pointDown(e)
    {
        if(this.state.condition){
            e.preventDefault();
            this.dragElement = e.target;
            this.oldParent = this.dragElement.parentNode;
            this.dragElement.style.position = "absolute";
            this.dragElement.style.maxWidth = "20vw";
            document.body.appendChild(this.dragElement);
            document.body.addEventListener("pointermove", this.state.pointerMove);
            this.dragElement.style.left = (e.pageX - this.dragElement.getBoundingClientRect().width / 2) + "px";
            this.dragElement.style.top = (e.pageY - this.dragElement.getBoundingClientRect().height / 2) + "px";
            document.body.addEventListener("pointerup", this.state.pointerUp);
        }
    }
    pointMove(e)
    {
        e.preventDefault();
        this.dragElement.style.left = (e.pageX - this.dragElement.getBoundingClientRect().width / 2) + "px";
        this.dragElement.style.top = (e.pageY - this.dragElement.getBoundingClientRect().height / 2) + "px";
    }
    pointUp(e)
    {
        document.body.removeEventListener("pointermove", this.state.pointerMove);
        document.body.removeEventListener("pointerup", this.state.pointerUp);
        this.dragElement.style.display = "none";
        let find = false;
        for(let finded of document.elementsFromPoint(e.pageX, e.pageY))
        {
            if(finded.dataset.type == "dropField")
            {
                finded.appendChild(this.dragElement);
                find = true;
                break;
            }
            else if(finded.dataset.type == "element")
            {
                finded.parentNode.appendChild(this.dragElement);
                find = true;
                break;
            }
        }
        if(!find)
        {
            this.oldParent.appendChild(this.dragElement);
        }
        this.dragElement.style.display = "";
        this.dragElement.style.position = "";
        this.dragElement.style.maxWidth = "";
        this.dragElement = null;
        this.oldParent = null;

    }
    initElements(element)
    {
        this.elements.push(<div className="Banner">{element.text}</div>);
    }
    startCheck()
    {
        if(document.getElementById("dragField").childNodes.length > 0)
        {
            this.props.start.up.current.state.set(<TextUnits textValue={{"text_1": ["Перетащи все элементы!"]}}/>, true, 2000);
        }
        else
        {
            let mistakes = 0;
            let drops = document.getElementsByClassName("Drops");
            let wrong = [];
            for(let field of drops)
            {
                for(let child of field.childNodes)
                {
                    if(child.dataset.field !== field.dataset.field)
                    {
                        mistakes++;
                        wrong.push(child);
                    }
                }
            }
            this.setState({condition: false});
            wrong.forEach(elem => {
                for(let d of drops)
                {
                    if(d.dataset.field === elem.dataset.field)
                    {
                        d.appendChild(elem);
                    }
                }
            });
            this.pointsUpdate(mistakes);
        }
    }
    pointsUpdate(mistakes)
    {
        let points;
        if(mistakes > 0 && mistakes <= 3)
        {
            points = 8;
        }
        else if(mistakes == 0)
        {
            points = 10;
        }
        else
        {
            points = 0;
        }
        this.props.start.up.current.state.pointsUpdate(points);
        this.props.start.up.current.state.set(<TextUnits textValue={{"text_1": [`Ты набрал ${points} очков!`]}}/>, true, 2000);
        this.props.start.control.current.state.mount([{click: this.props.start.next, text: "Дальше"}]);
    }
}
export default DragNDrop;