import React,{Component} from 'react'
import {BrowserRouter as Router,Route,Link,NavLink,Switch } from 'react-router-dom'
import Main from '../main'

export default class Routers extends Component{

  constructor(props){
    super(props)
    console.log(this)
  }



  render(){

    return(
      <Router >


            <Route exact path="/" component={Main}/>
            <Route path="/details" component={Main}/>


      </Router>
    )
  }
}
