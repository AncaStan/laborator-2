import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Table from "./Table";
import "./App.css";

class PatientsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            patients: [],
            filteredData: []
        };
    }

    componentDidMount() {
        this.fetchPatients();
    }

    fetchPatients = () => {
        axios.get("https://hapi.fhir.org/baseDstu3/Patient?_pretty=true&_count=50").then((response) => {
            let patients = response.data.entry;
            let filteredPatients = [];

            for(let i = 0; i < patients.length; i++) {
                let patientObj = {id: "-", fullname: "-", birthDate: "-", gender: "-"};

                if(patients[i].resource) {
                    if(patients[i].resource.id) {
                        patientObj.id = patients[i].resource.id;
                    }

                    if(patients[i].resource.gender) {
                        patientObj.gender = patients[i].resource.gender;
                    }

                    if(patients[i].resource.birthDate) {
                        patientObj.birthDate = patients[i].resource.birthDate;
                    }

                    if(patients[i].resource.name && patients[i].resource.name.length > 0) {
                        let patientName = "-";

                        if(patients[i].resource.name[0].family) {
                            patientName = patients[i].resource.name[0].family;
                        }
                        if(patients[i].resource.name[0].given && patients[i].resource.name[0].given.length > 0) {
                            patientName = patientName + " " + patients[i].resource.name[0].given[0];
                        }

                        patientObj.fullname = patientName;
                    }
                }

                filteredPatients.push(patientObj);
            }

            this.setState({patients: filteredPatients, filteredData: filteredPatients});
        }).catch((error) => {
            console.log("Patients page error: " + error);
        })
    };

    handleClick = (patientId) => {
        this.props.history.push({pathname: "/patient-details", state: {patientId: parseInt(patientId)}});
    };

    handleChange = (event) => {
        let searchText = event.target.value;
        this.setState(prevState => {
            const filteredData = prevState.patients.filter(patient => {
                return patient.id.startsWith(searchText);
            });
      
            return {searchText, filteredData};
          });
    };

    render() {
        let columns = ["PATIENT ID", "FULL NAME", "BIRTHDATE", "GENDER", ""];

        return (
            <div className="page-container">
                <p className="page-title"><i className="icon fas fa-users"></i>Patients</p>
                <div>
                    <input className="input-container" placeholder="PATIENT ID" value={this.state.value} onChange={(event) => this.handleChange(event)}></input>
                    <Table items={this.state.filteredData} columns={columns} handleClick={this.handleClick}/>
                </div>
            </div>
        )
    }
}

export default withRouter(PatientsPage)