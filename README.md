# PharmaTrack

PharmaTrack is a pharmacy management system developed as a college team project. The aim of this project is to simplify pharmacy operations by providing a system to manage medicine inventory, customer records, billing, and reports in an organized way.

The system helps pharmacists keep track of medicine availability, monitor stock levels, manage customer purchases, and maintain billing records efficiently.

## Project Objective

The main objective of PharmaTrack is to improve the efficiency and accuracy of pharmacy operations through basic automation. The system helps reduce manual work involved in inventory management and billing while maintaining organized records of medicines and transactions.

It also helps pharmacies monitor stock availability and avoid issues such as stock shortages or expired medicines.

## Key Features

PharmaTrack is divided into several modules that handle different pharmacy operations.

### 1. Inventory Module

This module manages the medicine inventory of the pharmacy. It maintains records of all medicines available in the store and allows categorization based on type, manufacturer, and expiry date.

Pharmacists can add medicines manually or upload distributor CSV files to update the inventory. The system also monitors stock levels and highlights medicines that are low in stock or approaching their expiration date.

### 2. Customer Module

The customer module stores customer information including contact details, purchase history, and medicine requirements.

It helps pharmacies keep track of regular customers and maintain records of recurring medicine purchases, which can improve customer service and retention.

### 3. Counter (Billing) Module

The counter module handles the billing and checkout process. It allows pharmacists to generate invoices, apply discounts, and process customer purchases.

Whenever a medicine is sold, the system automatically updates the inventory to maintain accurate stock records.

### 4. Bill History Module

This module maintains a record of all past billing transactions.

Pharmacists can view previous bills, reprint invoices if required, and check transaction details for verification or refund management.

### 5. Reports Module

The reporting module generates different types of reports to help pharmacy owners analyze business performance.

Available reports include:

* Sales reports
* Purchase reports
* Expiry reports
* Customer purchase reports

These reports help in identifying sales trends, monitoring medicine demand, and managing inventory more effectively.

### 6. Alerts Module

The alert system notifies pharmacists about important inventory updates.

Types of alerts include:

* Low stock alerts when medicine quantity falls below a defined level
* Expiration alerts for medicines that are nearing their expiry date

These alerts help pharmacies avoid stock shortages and prevent the sale of expired medicines.

## Tech Stack

PharmaTrack was developed using a combination of web technologies to build both the frontend interface and backend functionality. The user interface was built using **HTML, CSS, JavaScript, and Bootstrap**, which were used to design a responsive and user-friendly layout for the application. For the backend, **Node.js** along with the **Express.js** framework was used to handle the server-side logic and manage application routes. The project also utilizes **MongoDB** for storing data such as medicine records, customer information, and transaction details, although the database integration is currently basic and can be further improved in future versions.


## Installation

1. Clone the repository

git clone https://github.com/pallavi3101/PharmaTrack.git

2. Navigate to the project folder

cd PharmaTrack

3. Install dependencies

npm install

4. Start the server

npm start

## Project Type

This project was developed as a **college team project** to understand how full-stack applications can be used to solve real-world problems such as pharmacy inventory management and billing systems.

## Future Improvements

Some possible improvements for the system include:

* Improving the user interface for better usability
* Enhancing database integration and performance
* Adding authentication and user roles
* Implementing barcode scanning for medicines
* Adding advanced analytics and reporting features

## Author

Pallavi
https://github.com/pallavi3101
