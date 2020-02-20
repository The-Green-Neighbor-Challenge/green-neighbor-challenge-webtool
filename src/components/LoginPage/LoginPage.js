import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {Page, Form, margin, Header} from './styles.js';


class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  } // end login

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <Page>
        {this.props.errors.loginMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.loginMessage}
          </h2>
        )}
        <Form onSubmit={this.login} className='container'>
          <Header>Login</Header>
          <TextField
            label="Username"
            type="text"
            name="username"
            value={this.state.username}
            style={margin}
            onChange={this.handleInputChangeFor('username')}
          />
          <TextField
            label="Password"
            style={margin}
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChangeFor('password')}
          />
          <input
            className="button-primary"
            style={margin}
            type="submit"
            name="submit"
            value="Log In"
          />
        </Form>
        <center>
          <button
            className='button-default'
            type="button"
            onClick={() => {this.props.dispatch({type: 'SET_TO_REGISTER_MODE'})}}
          >
            Register
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

export default connect(mapStateToProps)(LoginPage);
