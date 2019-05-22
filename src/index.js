import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter as Router } from "react-router-dom";
import './index.css';

import HomePage from "./Home.page";
import PatientsPage from "./Patients.page";
import PatientDetailsPage from "./PatientDetails.page";
import MedicationPage from "./Medication.page";

const routes = (
    <Router>
        <div>
            <Route exact path="/" component={HomePage}/>
            <Route path="/patients" component={PatientsPage}/>
            <Route path="/patient-details" component={PatientDetailsPage}/>
            <Route path="/medication" component={MedicationPage}/>
        </div>
    </Router>
)

ReactDOM.render(routes, document.getElementById('root'));
