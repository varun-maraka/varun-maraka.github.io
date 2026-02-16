import React, { Component } from 'react';
import CommentsComponent from './comments';
import Arc_CommentsComponent from './arc_comments';

class Board extends Component {
    constructor(props) {
        super(props)
    
       this.input=React.createRef();
       this.state={
        comments:[],
        archived_comments:[]
        }
    }

    componentDidMount() {
        const list = window.localStorage.getItem('comments');
        const arc_list = window.localStorage.getItem('archived_comments');
        const parsedList = JSON.parse(list);
        const arc_list_parsed = JSON.parse(arc_list);
        if(list == null ){
            //return false
        }else{
            this.setState({
                comments: parsedList
            })
        }
        if(arc_list == null){

        }else{
            this.setState({
                archived_comments : arc_list_parsed
            })
        }
    }

    removeComment(i){
        //var arr = this.state.comments;
        //arr.splice(i,1);
        //this.setState({comments: arr});

        let list=JSON.parse(localStorage.getItem('comments'));
        let text = list[i];
        list.splice(i,1);
        this.setState({comments: list});
        localStorage.setItem("comments",JSON.stringify(list));

        if(localStorage.getItem('archived_comments')==null){
            const list=[];
            list.push(text);
            localStorage.setItem("archived_comments",JSON.stringify(list))
        }
        else{
            const list=JSON.parse(localStorage.getItem('archived_comments'));
            list.push(text);
            this.setState({archived_comments:list});
            localStorage.setItem("archived_comments",JSON.stringify(list));
        }
        this.setState({
            archived_comments:JSON.parse(localStorage.getItem('archived_comments'))
        });


    }
    updateComment(newText, i){
        //var arr = this.state.comments;
        //arr[i] = newText;
        //this.setState({comments: arr});

        let list=JSON.parse(localStorage.getItem('comments'));
        list[i] = newText;
        this.setState({comments:list});
        localStorage.setItem("comments",JSON.stringify(list));
    }
    eachComment(text, i){
        return (<div style={{ display:'inline-block'}}>
                <CommentsComponent key={i} index={i} updateCommentText = {this.updateComment.bind(this)} deleteFromBoard = {this.removeComment.bind(this)}>
                   {text}  
                </CommentsComponent>
                &nbsp; &nbsp;
                </div>
            );
    }

    eachArchiveComment(text, i){
        return (<div style={{ display:'inline-block'}}>
                <Arc_CommentsComponent key={i} index={i} deleteFromArcBoard = {this.removeFromArchive.bind(this)}>
                   {text}  
                </Arc_CommentsComponent>
                &nbsp; &nbsp;
                </div>
            );
    }

    removeFromArchive(i){ 
        let list=JSON.parse(localStorage.getItem('archived_comments'));
        list.splice(i,1);
        this.setState({archived_comments: list});
        localStorage.setItem("archived_comments",JSON.stringify(list));
    }
    addNewComment(text){
        //var arr = this.state.comments;
        //arr.push(text);
        //this.setState({comments:arr});

        //console.log("Allow Duplicates in Board compolnent _ AddNewComment: "+localStorage.getItem('allowDuplicates')) ;
        if(localStorage.getItem('comments')==null){
            const list=[];
            list.push(text);
            localStorage.setItem("comments",JSON.stringify(list))
        }
        else{
            const list=JSON.parse(localStorage.getItem('comments'));
            const allowDup = localStorage.getItem('allowDuplicates');
            var found=false;
            if(allowDup === "false" || allowDup == "false" || allowDup == false){
                found = list.some(e1 => e1 === text);
                console.log("Inside allowDup");
            } else{ found = false}
            //console.log("In add new:"+allowDup + "found =" +found)
            if (!found) {
                list.push(text);
                this.setState({comments:list});
                localStorage.setItem("comments",JSON.stringify(list));
            }
        }
        this.setState({
            comments:JSON.parse(localStorage.getItem('comments'))
        });
    }
    render(){
        return(
            <div>
                <button onClick= {this.addNewComment.bind(this,'Default Text')}className= "button-info create">Add New</button>
                <p/>
                <div  className= "board" >
                {
                    this.state.comments.map(this.eachComment.bind(this))
                }
                </div> 
                <hr/><hr/> <b><h2>Archive</h2></b> <p/>
                <div className= "board">
                {
                    this.state.archived_comments.map(this.eachArchiveComment.bind(this))
                }

                </div>
            </div>
        );
    }

}

export default Board;