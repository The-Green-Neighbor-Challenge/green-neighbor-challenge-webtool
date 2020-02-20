import React, { Component } from 'react';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {Page, Form, Header} from './styles.js';

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({type: 'REGISTRATION_INPUT_ERROR'});
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <Page>
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}
        <Form onSubmit={this.registerUser} className='container'>
          <Header>Register User</Header>
          <TextField
            label='Username'
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleInputChangeFor('username')}
          />
          <TextField
            label='Password'
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChangeFor('password')}
          />
          <input
            className="button-primary"
            type="submit"
            name="submit"
            value="Register"
          />
        </Form>
        <center>
          <button
            type="button"
            className="button-default"
            onClick={() => {this.props.dispatch({type: 'SET_TO_LOGIN_MODE'})}}
          >
            Login
          </button>
        </center>
      </Page>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

