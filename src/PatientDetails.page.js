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
        axios.get(`https://hapi.fhir.org/baseDstu3/Encounter?_pretty=true&patient=${this.patientId}`).then((response) => {
            let encounters = response.data;
            if(encounters.reason && encounters.reason.length > 0) {
                this.setState({...this.state, encounters: encounters.reason[0].text});
            }
        }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    fetchCarePlan = () => {
        axios.get(`https://hapi.fhir.org/baseDstu3/CarePlan?_pretty=true&patient=${this.patientId}`).then((response) => {
        let carePlan = response.data;
        let category = "no category";
        let activities = [];

        if(carePlan.category && carePlan.category.length > 0) {
            if(carePlan.category.coding && carePlan.category.coding.length > 0) {
                if(carePlan.category.coding[0].display) {
                    category = carePlan.category.coding[0].display;
                }
            }
        }

        if(carePlan.activity && carePlan.activity.length > 0) {
            for(let i = 0; i < carePlan.activity.length; i++) {
                let step = carePlan.activity[i];
                if(step.detail && step.detail.code && step.detail.code.coding && step.detail.code.coding.length > 0 && step.detail.code.coding[0].display) {
                    activities.push(step.detail.code.coding[0].display);
                }
            }
        }

        this.setState({...this.state, carePlan: {category, activities}});
    }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    fetchAppointment = () => {
        axios.get(`https://hapi.fhir.org/baseDstu3/Appointment?_pretty=true&patient=${this.patientId}`).then((response) => {
            let appointment = response.data;
            let description = "no description";
            let participants = [];

            if(appointment.description) {
                description = appointment.description;
            }

            if(appointment.participant && appointment.participant.length > 0) {
                for(let i = 0; i < appointment.participant.length; i++) {
                    let participant = appointment.participant[i];
                    if(participant.actor && participant.actor.display) {
                        participants.push(participant.actor.display);
                    }
                }
            }

            this.setState({...this.state, appointment: {description, participants}});
    }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    }

    render() {
        return (
            <div className="page-container">
                <p className="page-title"><i className="icon fas fa-file-medical-alt"></i>Patient Details</p>
                <div>
                    <p>{"Encounters: " + this.state.encounters}</p>
                    <p>{"CarePlan:" + "" }</p>
                    <p>Appointment: </p>
                </div>
            </div>
        )
    }
}

export default withRouter(PatientDetailsPage)