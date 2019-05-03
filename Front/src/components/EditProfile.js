import React from 'react';
import { Redirect } from 'react-router';
import {register} from './UserFunctions';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function validate(register) {
    // we are going to store errors for all fields
    // in a signle array
    const errors = [];
  
    if (register.name.length < 5 || register.name.length > 20) {
      errors.push("Name must be between 5 and 20 characters");
    }
  
    if (register.password !== register.confPass) {
      errors.push("Password did not match confirmation");
    }
  
    return errors;
  }


export default class EditUser extends React.Component {

    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfPass = this.onChangeConfPass.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            confPass: '',
            errors: [], 
            wrong: '',
            newName: "",
            login:''
        }
    }

    componentDidMount(){
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        this.setState({
            login : decoded._id,
        })
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }
    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }
    onChangeConfPass(e) {
        this.setState({
            confPass: e.target.value
        });
    }
    onSubmit(e) {
        e.preventDefault();
        console.log(`name is ${this.state.name} , email is ${this.state.email}, password is ${this.state.password}, confpass is ${this.state.confPass}`);
        
        const user = {
            id: this.state.login,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
        }
        const errors = validate(register);
        if (errors.length > 0) {
            this.setState({ errors });
            return;
        }
        else
        {
            axios.post('http://localhost:4242/users/edit', user)
            .then((response) => {
            if(response.data.message === "Successful")
            {
                localStorage.setItem('usertoken', response.data.token)
                console.log(response.data.token);
                this.setState({
                    newName: response.data.editName,
                    wrong: '',
                    fireRedirect: true
                });
                console.log(this.state.newName);
            }
            else
            {
                this.setState({
                    wrong: response.data.message
                });
                console.log(response.data);
            }
            })
            .catch((error) => {
            console.error(error);
            });


            this.setState({
            name: '',
            email: '',
            password: '',
            confPass: ''
            })
        } 
    }


    render(){
        const { errors } = this.state;
        return (
            <div className="container">
                <h3 style={{marginTop: 30, marginLeft: 50}} >Edit your Profile information :</h3>
                <p>{this.state.wrong}</p>
                <div style={{marginTop: 50, marginLeft: 300, marginRight:300}}>
                    <form onSubmit={this.onSubmit}>
                        {errors.map(error => (
                        <p key={error}>Error: {error}</p>
                            ))}  
                        <div className="form-group">
                            <label>Name:  </label>
                            <input type="text" className="form-control" value={this.state.name} onChange={this.onChangeName}/>
                        </div>
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="email" className="form-control" value={this.state.email} onChange={this.onChangeEmail}/>
                        </div>
                        <div className="form-group">
                            <label>Password: </label>
                            <input type="password" className="form-control" value={this.state.password} onChange={this.onChangePassword}/>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password: </label>
                            <input type="password" className="form-control" value={this.state.confPass} onChange={this.onChangeConfPass}/>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Edit" className="btn btn-primary"/>
                        </div>
                    </form>
                </div>
                {this.state.fireRedirect && <Redirect to={'/' + this.state.newName + '/profile'} push={true} />}
            </div>
        )
    }
}