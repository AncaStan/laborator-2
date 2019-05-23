import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "./App.css";

class PatientDetailsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            encounters: "",
            carePlan: "",
            appointment: "",
            isEncounters: false,
            isCarePlan: false,
            isAppointment: false
        };

        this.patientId = this.props.history.location.state.patientId;
    }

    componentDidMount() {
        this.fetchEncounters();
        this.fetchCarePlan();
        this.fetchAppointment();
    }

    fetchEncounters = () => {
        axios.get(`https://hapi.fhir.org/baseDstu3/Encounter?_include=Encounter:patient&_pretty=true&patient=${this.patientId}`).then((response) => {
            let data = response.data;
            let encounters = "no encounters";

            if(data.reason && data.reason.length > 0) {
                if(data.reason[0].text) {
                    encounters = data.reason[0].text;
                }
            }

            this.setState({...this.state, encounters, isEncounters: true});
        }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    };

    fetchCarePlan = () => {
        axios.get(`https://hapi.fhir.org/baseDstu3/CarePlan?_include=CarePlan:patient&_pretty=true&patient=${this.patientId}`).then((response) => {
        let data = response.data;
        let carePlan = {};

        if(data.category && data.category.length > 0) {
            if(data.category.coding && data.category.coding.length > 0) {
                if(data.category.coding[0].display) {
                    carePlan.category = data.category.coding[0].display;
                }
            }
        }

        if(data.activity && data.activity.length > 0) {
            carePlan.activities = [];
            for(let i = 0; i < data.activity.length; i++) {
                let step = data.activity[i];
                if(step.detail && step.detail.code && step.detail.code.coding && step.detail.code.coding.length > 0 && step.detail.code.coding[0].display) {
                    carePlan.activities.push(step.detail.code.coding[0].display);
                }
            }
        }

        this.setState({...this.state, carePlan, isCarePlan: true});
    }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    };

    fetchAppointment = () => {
        axios.get(`https://hapi.fhir.org/baseDstu3/Appointment?_include=Appointment:patient&_pretty=true&patient=${this.patientId}`).then((response) => {
            let data = response.data;
            let appointment = {};

            if(data.description) {
                appointment.description = data.description;
            }

            if(data.participant && data.participant.length > 0) {
                appointment.participants = [];
                for(let i = 0; i < data.participant.length; i++) {
                    let participant = data.participant[i];
                    if(participant.actor && participant.actor.display) {
                        appointment.participants.push(participant.actor.display);
                    }
                }
            }

            this.setState({...this.state, appointment, isAppointment: true});
    }).catch((error) => {
            console.log("Patients page error: " + error);
        });
    };

    displayCarePlan = () => {
        let carePlan = "no care plan";

        if(this.state.carePlan.category) {
            carePlan = this.state.carePlan.category;
        }
        if(this.state.carePlan.activities && this.state.carePlan.activities.length > 0) {
            for(let i = 0; i < this.state.carePlan.activities.length; i++) {
                carePlan = carePlan + "|" + this.state.carePlan.activities[i];
            }
        }

        return carePlan;
    };

    displayAppointment = () => {
      let appointment = "no appointment";

        if(this.state.appointment.description) {
            appointment = this.state.appointment.description;
        }
        if(this.state.appointment.participants && this.state.appointment.participants.length > 0) {
            for(let i = 0; i < this.state.appointment.participants.length; i++) {
                appointment = appointment + "|" + this.state.appointment.participants[i];
            }
        }

        return appointment;

    };

    render() {
        return (
            <div className="page-container">
                <p className="page-title"><i className="icon fas fa-file-medical-alt"></i>Patient Details</p>
                {this.state.isEncounters && this.state.isCarePlan && this.state.isAppointment &&
                <div className="details-container">
                    {this.state.encounters && <p>{"ENCOUNTERS: " + this.state.encounters}</p>}
                    {this.state.carePlan && <p>{"CARE PLAN: " + this.displayCarePlan()}</p>}
                    {this.state.appointment && <p>{"APPOINTMENT: " + this.displayAppointment()}</p>}
                </div>
                }
            </div>
        )
    }
}

export default withRouter(PatientDetailsPage)