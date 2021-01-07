import React, { Component } from 'react'
import BorderWrapper from 'react-border-wrapper'

class CommentsComponent extends Component {
    constructor(props) {
        super(props)
    
       this.input=React.createRef()
       this.state={
           list:[],
           isEditButtonClicked: false,
           stateVar2: "Hello"
          }
    }

    edit(){
        //alert("Editing Comment ....");
        this.setState({isEditButtonClicked:true});
    }
    remove(){
        //alert("Removing Comment ....");
        this.props.deleteFromBoard(this.props.index);
    }
    save(){
        this.setState({isEditButtonClicked:false});
        //alert("Value is :" + {this.props.children});
        this.props.updateCommentText(this.refs.newText.value, this.props.index);
    }
    renderNormalText(){
        return(
            <div className= "commentContainer" style={{ display:'inline-block'}}>
                    <BorderWrapper innerPadding ={3} borderWidth={1} borderRadius={2}>
                        <div className= "commentText" >{this.props.index+1} --&gt; {this.props.children}</div>
                    
                    <button className= "button-primary" onClick = {this.edit.bind(this)}>Edit</button>
                    <button className= "button-danger" onClick = {this.remove.bind(this)}>Remove</button>
                    </BorderWrapper>
                    <div> <p></p>  </div>
            </div>
        );
    }
    renderEditableText(){
        return(
            <div className= "commentContainer">
                <p>
                    {this.props.index +1}
                    <textarea ref="newText" defaultValue={this.props.children} value={this.state.value} border ="solid 1px orange;" ></textarea>
                    <button className= "button-success" onClick = {this.save.bind(this)}>Save</button>
                    <button className= "button-danger" onClick = {this.remove.bind(this)}>Remove</button>
                    <br></br>
                </p>
            </div>
        );
    }
    render(){
        if(this.state.isEditButtonClicked){
            return this.renderEditableText();
        }else{
            return this.renderNormalText();
        }
    }

}



export default CommentsComponent;