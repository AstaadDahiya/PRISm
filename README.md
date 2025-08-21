# PRISm: Predictive Readmission Intelligence System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com)

**PRISm** is a full-stack, AI-powered healthcare application designed to proactively reduce hospital readmissions. It leverages predictive analytics to identify at-risk patients post-discharge and provides clinicians with actionable insights and tools to coordinate effective follow-up care.

---

## 📋 Table of Contents

* [Problem Statement](#problem-statement)
* [Core Features](#core-features)
* [Innovative Features](#innovative-features)
* [Tech Stack](#tech-stack)
* [System Architecture](#system-architecture)
* [Algorithmic Motifs](#algorithmic-motifs)
* [Getting Started](#getting-started)
* [License](#license)

---

## 🎯 Problem Statement

Hospital readmissions are a significant driver of healthcare costs and are often linked to poor patient outcomes. Many readmissions are preventable but occur due to failures in post-discharge care coordination, patient non-adherence, and an inability to identify high-risk individuals before a crisis occurs. PRISm addresses this by shifting the paradigm from reactive to **pre-emptive care**.

---

## ✨ Core Features

### Clinician Portal (Web App)
* **Real-Time Risk Dashboard:** A centralized view of all discharged patients, automatically stratified by a predictive risk score (High, Moderate, Low).
* **Patient-Specific Risk Profile:** Drills down into *why* a patient is at risk, visualizing contributions from clinical data, Social Determinants of Health (SDOH), and behavioral factors.
* **Intervention Recommendation Engine:** Suggests evidence-based, prioritized interventions tailored to a patient's specific risk drivers.
* **Care Coordination Hub:** A HIPAA-compliant messaging tool for the entire care team (physicians, nurses, social workers) to collaborate on a patient's plan.

### Patient Portal (PWA)
* **Simplified Care Plan:** An easy-to-follow daily checklist of tasks (medications, appointments, self-monitoring).
* **Symptom Reporting:** A simple, one-tap daily check-in to report well-being, which dynamically informs the risk model.
* **Secure Messaging:** Direct communication with the assigned care manager for questions and support.

---

## 🚀 Innovative Features

What sets PRISm apart from traditional risk calculators:

1.  **AI-Powered Discharge Scribe:** Uses speech-to-text and a generative model to listen to the live discharge conversation and automatically generate a simplified, actionable care plan for the patient's app. This closes the loop between clinician instruction and patient comprehension.
2.  **Dynamic Risk Scoring:** The patient's risk score is not static. It updates in near real-time based on data from consumer **wearables** (activity levels, sleep) and **patient-reported outcomes**, allowing for the earliest possible detection of a negative trend.
3.  **Resource-Aware Scheduling:** The intervention engine is integrated with staff scheduling systems, suggesting actions that are not only clinically appropriate but also logistically feasible for the care team.

---

## 🛠️ Tech Stack

* **Frontend:** React, Tailwind CSS, Recharts
* **Backend:** Google Firebase
    * **Authentication:** Firebase Auth
    * **Database:** Firestore (NoSQL)
    * **Serverless Logic:** Cloud Functions (TypeScript)
* **APIs & Integrations:**
    * **EHR Data:** FHIR (Fast Healthcare Interoperability Resources)
    * **Wearables:** Apple HealthKit & Google Fit APIs
    * **AI Scribe:** Google Speech-to-Text & Gemini

---

## 🏗️ System Architecture

PRISm is built on a serverless, event-driven architecture using Firebase. Data from various sources (EHR, wearables) triggers Cloud Functions that execute the risk model, update the Firestore database, and send real-time updates to the clinician and patient frontends. This ensures scalability and low operational overhead.

```mermaid
graph TD
    A[EHR via FHIR] --> B{Cloud Function: Ingest & Predict};
    C[Wearable APIs] --> B;
    D[Patient App] --> B;
    B -- Writes Risk Score & Plan --> E[Firestore Database];
    E -- Real-time Updates --> F[Clinician Dashboard];
    E -- Real-time Updates --> D;
    G[AI Scribe] -- Populates Checklist --> B;

