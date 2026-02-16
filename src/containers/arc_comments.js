import React, { Component } from 'react'
import BorderWrapper from 'react-border-wrapper'

class Arc_CommentsComponent extends Component {
    constructor(props) {
        super(props)
    
       this.input=React.createRef()
       this.state={
           list:[],
           stateVar2: "Hello"
          }
    }

    remove(){
        //alert("Removing Comment ....");
        this.props.deleteFromArcBoard(this.props.index);
    }
    renderNormalText(){
        return(
            <div className= "commentContainer" style={{ display:'inline-block'}}>
                    <BorderWrapper innerPadding ={3} borderWidth={1} borderRadius={2}>
                        <div className= "commentText" >{this.props.index+1} &gt; {this.props.children}</div>
                    
                    <button className= "button-danger" onClick = {this.remove.bind(this)}>Remove</button>
                    </BorderWrapper>
                    <div> <p></p>  </div>
            </div>
        );
    }
    render(){
        return this.renderNormalText();
    }

}



export default Arc_CommentsComponent;