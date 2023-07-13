import React, { Component } from 'react';
import './Register.css';
import Navbar from './Navbar';
import Footer from './Footer';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      password: '',
      confirm_password: '',
      phoneno: '',
      NID: '',
      addr1: '',
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  onClick(e) {
    e.preventDefault();
    const { password, confirm_password } = this.state;
    console.log(password);
    console.log(confirm_password);
    if (password === confirm_password) {
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          password: this.state.password,
          confirm_password: this.state.confirm_password,
          phoneno: this.state.phoneno,
          NID: this.state.NID,
          addr1: this.state.addr1,
        }),
      })
        .then(
          this.setState({
            first_name: '',
            password: '',
            confirm_password: '',
            phoneno: '',
            NID: '',
            addr1: '',
          })
        )
        .catch((e) => console.log('unable to fetch'));
    } else {
      return <h1>Wrong</h1>;
    }
  }
  render() {
    return (
      <div>
        <Navbar />

        <div className="container">
          <div className="signup-form">
            <form action="" method="POST">
              <h2>Citizen Registeration</h2>
              <p className="hint-text">Create your account.</p>
              <div className="form-group">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.onChange}
                      name="first_name"
                      placeholder="First Name"
                      value={this.state.first_name}
                      required="required"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  onChange={this.onChange}
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  required="required"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  onChange={this.onChange}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={this.state.confirm_password}
                  required="required"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onChange}
                  name="phoneno"
                  placeholder="Phone No"
                  value={this.state.phoneno}
                  required="required"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onChange}
                  name="NID"
                  placeholder="NID No"
                  value={this.state.NID}
                  required="required"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onChange}
                  name="addr1"
                  placeholder="Address 1"
                  value={this.state.addr1}
                  required="required"
                />
              </div>

              <div className="form-group">
                <label className="form-check-label">
                  <input type="checkbox" required="required" /> I accept the{' '}
                  <a href="#">Terms of Use</a> &amp;{' '}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-success btn-lg btn-block"
                  onChange={this.onClick}
                >
                  Register Now
                </button>
              </div>
              <div className="text-center" id="bottom">
                Already have an citizen account? <a href="/signin">Sign in</a>
              </div>
              {/* <div className="text-center" id="bottom"> */}
              {/* Hospital administration registration?{' '} */}
              {/* <a href="/administrativeSignUp">Sign Up</a> */}
              {/* </div> */}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
