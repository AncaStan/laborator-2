import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Table from "./Table";
import "./App.css";

class MedicationPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            medication: []
        };
    }

    fetchMedication = () => {
        axios.get("https://hapi.fhir.org/baseDstu3/Medication?_pretty=true&_count=50").then((response) => {
            let medication = response.data.entry;
            let filteredMedication = [];

            for(let i = 0; i < medication.length; i++) {
                let medicationObj = {};

                if(medication[i].resource) {
                    if(medication[i].resource.id) {
                        medicationObj.id = medication[i].resource.id;
                    }

                    medicationObj.isAntibiotic = "false";
                    if(medication[i].resource.extension && medication[i].resource.extension.length > 0) {
                        if(medication[i].resource.extension[0].url && medication[i].resource.extension[0].url === "isAntibiotic") {
                            medicationObj.isAntibiotic = "true";
                        }
                    }

                    medicationObj.name = "-";
                    if(medication[i].resource.code && medication[i].resource.code.coding.length > 0) {
                        let name = medication[i].resource.code.coding.filter((elem) => Object.keys(elem).includes("display"));
                        if(name.length > 0) {
                            medicationObj.name = name[0].display;
                        }
                    }
                }

                filteredMedication.push(medicationObj)
            }

            this.setState({medication: filteredMedication});
        }).catch((error) => {
            console.log("Medication page error: " + error);
        })
    };

    componentWillMount() {
        this.fetchMedication();
    }

    render() {
        let columns = ["MEDICATION ID", "NAME", "ANTIBIOTIC"];

        return (
            <div className="page-container">
                <p className="page-title"><i className="icon fas fa-capsules"></i>Medication</p>
                <div><Table items={this.state.medication} columns={columns}/></div>
            </div>
        )
    }
}

export default withRouter(MedicationPage)