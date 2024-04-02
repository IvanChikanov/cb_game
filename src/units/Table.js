import React from "react";
import TextUnits from "./TextUnits";
import List from "./List";
import Input from "./Input";
class ListTable extends React.Component
{
    constructor(props)
    {
        super(props);
        this.listsArray = new Map();
        this.createList = this.getList.bind(this);
        this.state = 
        {
            lArr: []
        }
    }
    componentDidMount()
    {
        this.props.start.up.current.state.set(<TextUnits textValue={this.props.data.taskText}/>);
        this.props.start.control.current.state.mount([{click: this.check.bind(this), text: "Проверить"}]);
    }
    render()
    {
        return <table className="FullBlock"><tbody>
            {this.props.data.table.map((row, index)=>{
                return <tr key={index}>{row.map((cell, index_2)=>
                    {return <td style={{background: "white", color: "var(--textColor)", padding: "1vh"}} key={index + "_" + index_2}>  
                        {cell.includes("check")? this.createList(cell, index + "_" + index_2): cell}
                    </td>})}
                </tr>})}
            </tbody></table>
    }
    getList(cell, key)
    {
        
        let cellName = cell.split("_");      
        let buff = React.createRef();
        let jsx;
        switch(cellName[1])
        {
            case "list":
                jsx = <List index={cellName[2]} listArr={this.props.data.list} ref={buff}/>
                break;
            case "input":
                jsx = <Input index ={cellName[2]} listArr={this.props.data.list} ref={buff}/>;
                break;
        }  
        if(!this.listsArray.has(key))
        {
            this.listsArray.set(key, buff);
        }
        return jsx;
    }
    check()
    {
        let message = {text_1: []}
        let mistakes = 0;
        let points = true;
        for(let oneList of this.listsArray.keys())
        {

            if(this.listsArray.get(oneList).current.state.result == null)
            {
                message.text_1.push("Выбери все ответы!");
                this.props.start.up.current.state.set(<TextUnits textValue={message}/>, true, 2000);
                points = false;
                break;
            }
            else if(this.listsArray.get(oneList).current.state.result == 0)
            {
                mistakes = mistakes + 1;
            }
        }
        if(points)
        {
            if(mistakes == 0)
            {
                points = 5;
            }
            else if(mistakes == 1)
            {
                points = 4;
            }
            else
            {
                points = 0;
            }
            message.text_1.push(`Ты набрал ${points} очков!`);
            this.props.start.up.current.state.set(<TextUnits textValue={message}/>, true, 2000);
            this.listsArray.forEach((value, key, map)=>{
                value.current.state.end();
            });
            this.props.start.up.current.state.pointsUpdate(points);
            this.props.start.control.current.state.mount([{click: this.props.start.next, text: "Дальше"}]);
        }
    }
}
export default ListTable;