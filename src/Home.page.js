import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";

class HomePage extends Component {
    
    handleClick = (pathname) => {
        this.props.history.push(pathname);
    };

    render() {
        return (
            <div className="page-container">
                <p className="page-title">Welcome to e-Health - Laboratory 2 -</p>
                <div className="menu-container">
                    <button className="option-container blue" onClick={() => this.handleClick("/patients")}>
                        <i className="icon fas fa-users"></i>Patients
                    </button>
                    <button className="option-container red" onClick={() => this.handleClick("/medication")}>
                        <i className="icon fas fa-capsules"></i>Medication
                    </button>
                </div>
            </div>
        );
    }
}

export default withRouter(HomePage);