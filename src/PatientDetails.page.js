import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./App.css";

class PatientDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            encouters: "",
            carePlan: "",
            appointment: ""
        };

        this.patientId = this.props.history.location.state.patientId;
    }

    componentDidMount() {
        this.fetchEncounters();
        this.fetchCarePlan();
        this.fetchAppointment();
    }

    fetchEncounters = () => {
        axios.get(`http://hapi.fhir.org/baseDstu3/Encounter?_pretty=true&patient=${this.patientId}`).then((response) => {
            console.log("encounters");
            console.log(response.data);
        }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    fetchCarePlan = () => {
        axios.get(`http://hapi.fhir.org/baseDstu3/CarePlan?_pretty=true&patient=${this.patientId}`).then((response) => {
            console.log("care plan");
            console.log(response.data);
        }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    fetchAppointment = () => {
        axios.get(`http://hapi.fhir.org/baseDstu3/Appointment?_pretty=true&patient=${this.patientId}`).then((response) => {
            console.log("appointment");
            console.log(response.data);
        }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    render() {
        return (
            <div className="page-container">
                <p className="page-title"><i className="icon fas fa-file-medical-alt"></i>Patient Details</p>
                <div>
                    <p>Encounters: </p>
                    <p>CarePlan: </p>
                    <p>Appointment: </p>
                </div>
            </div>
        )
    }
}

export default withRouter(PatientDetailsPage)