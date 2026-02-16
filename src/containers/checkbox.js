import React, { Component } from 'react'
import BorderWrapper from 'react-border-wrapper'

class AllowDuplicates extends Component {
    constructor(props) {
        super(props)
       this.input=React.createRef();
       var allowDup = localStorage.getItem('allowDuplicates');
       if( allowDup == true || allowDup == "true"){
            this.state={isCheckBoxChecked: false};
       }else{
            this.state={isCheckBoxChecked: true};
       }
       
       //console.log("Allow Duplicates in checkbox compolnent _ Constructor: "+allowDup + " checkboxChecked" + this.state.isCheckBoxChecked) ;
    }

    componentDidMount(){
        var allowDup = window.localStorage.getItem('allowDuplicates');
        //console.log("allowDup in compd did mount checkbox component:" + allowDup);
        if(allowDup == null){
            return false;
        }else{
            this.setState({isCheckBoxChecked: !allowDup})
        }
        //console.log("Allow Duplicates in checkbox compolnent _ Component Did mount: "+allowDup + " checkboxChecked" + this.state.isCheckBoxChecked) ;
    }
    
    handleCheckbox(){
        var stateVal = this.state.isCheckBoxChecked;
        this.setState({isCheckBoxChecked: !stateVal});
        localStorage.setItem('allowDuplicates',stateVal);
        const allowDup = localStorage.getItem('allowDuplicates');
        //console.log("Allow Duplicates in checkbox compolnent _ handleCheckbox: "+allowDup + " checkboxChecked" + this.state.isCheckBoxChecked) ;
    }

    render(){
        var msg;
        const allowDup = localStorage.getItem('allowDuplicates');
        if( allowDup == true || allowDup == "true"){  // If this condition is not there code is not working
            this.state={isCheckBoxChecked: false};    // isCheckBoxChecked value is becoming false automatically eventhough it is true in componentDidMount
        }else{
            this.state={isCheckBoxChecked: true};
        }
        var allowDupState = this.state.isCheckBoxChecked;
        //console.log("Allow Duplicates in checkbox compolnent _ Render: "+allowDup + " checkboxChecked" + this.state.isCheckBoxChecked) ;
        if(this.state.isCheckBoxChecked){
            msg = "Duplicates are not allowed";
        }else{
            msg = "Allowing Duplicates";
        }
        //console.log("In Render method of checkbox : checkbox "+  this.state.isCheckBoxChecked + "  allowDup: " +  allowDup);
        return(
            <div>
                <BorderWrapper innerPadding ={3} borderWidth={2} borderRadius={2}>
                    <input type= "checkbox" onChange = {this.handleCheckbox.bind(this)} defaultChecked= {allowDupState}/>
                    <h3>{msg}</h3>
                </BorderWrapper>
            </div>
        );
    }

}

export default AllowDuplicates;