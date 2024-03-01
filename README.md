# Patient Health Monitoring System

The Patient Health Monitoring System is a platform that enables doctors, patients and pharmacy to access various functionalities. With a primary focus on scheduling, canceling, and updating appointments, the system also facilitates the input of examination results and a comprehensive review of these findings. Each of three roles - doctor, patient and pharmacy - has access of specific functionalities, creating an environment for efficient health managment.

## Patient
![Screenshot 2024-01-22 152145](https://github.com/Mujo78/patient-health-monitoring-system/assets/96636536/57d7d4ec-f40e-4949-8d66-73d4767509ca)

## Doctor
![Screenshot 2024-01-22 154217](https://github.com/Mujo78/patient-health-monitoring-system/assets/96636536/eb7ae856-568d-48ef-b961-0244f35534aa)

## Pharmacy
![Screenshot 2024-01-22 152814](https://github.com/Mujo78/patient-health-monitoring-system/assets/96636536/ba6f2089-1a2a-4a4a-91f7-c40b53accd85)

## Table of Contents
- [Patient Health Monitoring System](#patient-health-monitoring-system)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Schema Diagram](#schema-diagram)

## Project Overview

This project represents a conceptual solution for a specific hospital, with a primary focus on patient appointment scheduling with a chosen doctor at a selected time. Based on this central focus, other functionalities have been developed, aligning with the identified requirements.

### User Roles
There are three distinct user roles within the system:

1. **Patient:** After a successful registration, the patient will have full control over their profile and the ability to manage scheduled appointments.
2. **Doctor:** Enters examination results, reviews statistics about patients, and accesses their data (example: examination history of a specific patient)
3. **Pharmacy:** In this system version, the pharmacy has the capability to veiw various statistics about medications and add new ones.

### Main flow
▶️ The patient chooses department from the hospital, and doctor from the chosen department  
▶️ The patient schedules an appointment - The appointment is available, and the patient can undergo the examination at the chosen time  
▶️ During the examination, the doctor enters results (OPTIONAL: The doctor can choose a medication available in the pharmacy, and this medication becomes part of the results)  
▶️ The doctor saves the results  
▶️ The patient receives a notification within the app about the results  
▶️ Reviewing the results (OPTIONAL: If a pharmacy medication is prescribed, the patient can view its details)  

## Features

### Common Features
- [x] Profile - Edit informations, profile picture
- [X] User authentication and authorization (JWT)
- [x] Forgot password
- [x] Change Password
- [x] Push notifications

### Patient
- [x] Patient dashboard
- [x] My Appointments - Appointment Overview/Edit/Cancel (If it's possible)
- [x] Book appointment
- [x] Medical staff - Hospital Overview (Department details: doctors, contacts...)
- [x] Medicine Overview - Medicine from Pharmacy
- [x] Registration
- [x] Email notifications
- [x] Settings preferences
- [x] Deactivating account

### Doctor
- [x] Doctor dashboard
- [x] My Appointments - Appointment Edit/Cancel
- [x] My Department - Department details, statistics
- [x] My Patients - Patient data overview, appointment results history

### Pharmacy
- [x] Pharmacy dashboard
- [x] Medicine Overview with Editing form
- [x] Add a New medicine

## Technologies
+ MongoDB Atlas
+ Express.js
+ React.js (with TypeScript)
+ Node.js
+ TailwindCSS
+ Flowbite
+ Socket.io
+ Redux
+ Nodemailer
+ JWT Authentication

## Schema Diagram
![Screenshot_2](https://github.com/Mujo78/patient-health-monitoring-system/assets/96636536/bd28b36f-e666-4233-bd7a-2f9ad08af311)


