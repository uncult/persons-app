import React, { Component } from 'react';

class Person extends Component {
    constructor(props){
      super(props);
      this.state = {
        data: props.data
      };
    }
  
    render(){
        let data = this.state.data;

        return (
        <div>
           {data.name}
        </div>
        );
    }
}
export default Person;