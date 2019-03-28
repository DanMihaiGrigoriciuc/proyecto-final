import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom'

class Signup extends Component {
  constructor(props){
    super(props);
    this.state = { username: '', password: '' };
    this.service = new AuthService();
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
  
    this.service.signup(username, password)
    .then( response => {
        console.log(response)
        this.setState({
            username: "", 
            password: "",
        });
        //  this.props.getUser(response)
    })
    .catch( error => console.log(error.response) )
  }
  
  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }
      
  
  render(){
    return(
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label>Username:</label><br></br>
          <input type="text" name="username" value={this.state.username} onChange={ e => this.handleChange(e)}/><br></br>
          
          <label>Password:</label><br></br>
          <textarea name="password" value={this.state.password} onChange={ e => this.handleChange(e)} /><br></br>
          
          <input type="submit" value="Signup" />
        </form>
  
        <p>Already have account? 
            <Link to={"/"}> Login</Link>
        </p>
  
      </div>
    )
  }

}

export default Signup;