import React from "react";
import PreviosType from "./PreviosType";
import DragNDrop from "./units/DragNDrop";
import Table from "./units/Table";
import Scum from "./units/Scum";
import Data from "./data/scenes.json";

class Scene extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            number: 0, 
            show: "",
            next: this.nextShow.bind(this),
            startInfo: {control: this.props.control, up: this.props.up, next: this.nextShow.bind(this)}
        };
    }
    render()
    {
        return <div
            style={{gridTemplateColumns: this.state.cols, gridTemplateRows: this.state.rows, gridArea: "main-window"}}>
                {this.state.show}
        </div>
    }
    componentDidMount()
    {
        this.types = {
            "previos": (data, start)=>{return <PreviosType data={data} start={start}/>},
            "dragNDrop": (data, start)=>{return <DragNDrop data={data} start={start}/>},
            "list": (data, start)=>{return <Table data={data} start={start}/>},
            "scum":(data, start)=>{return <Scum data={data} start={start}/>}
        };
        this.showScene();
    }
    showScene()
    {
        this.setState({show: null}, ()=>{
            this.setState({show: this.types[Data[this.state.number].type](Data[this.state.number], this.state.startInfo)})
        });
    }
    nextShow()
    {
        this.setState({number: this.state.number + 1}, ()=>{this.showScene()});
    }
}
export default Scene;