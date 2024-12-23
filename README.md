# eFIR - Online First Information Report Filing System

A simple and efficient FIR (First Information Report) Filing System designed for managing and storing FIRs in a digital format. This system allows police stations or public users to register, view, and manage FIRs, making the process faster and more organized.

## Tech Stack
- Frontend : ReactJS(HTML, CSS, JavaScript)
- backend : Node.js, Express
- Authentication : jwt(JSON Web Tokens), bcrypt
- Database : MongoDB
- Notifications & OTP verification : nodemailer *(Phone number otp verification feature has not been completed due to limited free tier platforms for it instead email otp verification has been done)*

## Features and Roles
- ### Public User:
  - File an FIR.
  - Check FIR status and case updates.
  - Download FIR details in pdf format.
  - Upload option to upload supporting files along with FIR.
  - Get notifications for every FIR updates.
  - Ask any Query in Contact Us section.
- ## Jurisdiction Admin
  - Get filed FIRs in the particular Juridiction Area.
  - Add update logs and change status of FIRs.
  - Assign FIR cases to other officers.
  - Statistcs to monitor different types of FIR filed and their frequencies over years.
  - Get notifications of updates.
  - Get Queries raised by the public.
  - Add, edit and update announcements section in home page.
- ## Police Officer
  - Get the assigned FIRs.
  - Add update logs and change status of FIRs.
  - Assign assigned FIR cases to other officers.
  - Statistics to monitor different types of FIR filed and their frequencies over years.
  - Get notifications of updates.
  - Get queries raised by the people.

**Note: JurisdicationAdmin Role has been been implemented so that they can assign public user filed FIR to police Officers, they form a bridge between public user and officers . As there may be some FIRs that may be confidential. So JurisdictionAdmin officer can decide which FIRs should be assigned to which officer. Dividing responsibilities between roles ensures that each user has the right amount of access to perform their tasks efficiently without unnecessary distractions**

## General Features
- Special User Accessibiliy bar on top of website which includes:
  - Select Language option : User can translate website to variety of indian languages.
  - Options to increase or decrease Font Size.
  - Option to change Contrasts
- Security and Authentication:
  - Raw user informations are converted to tokens using JWT and are stored in HTTP-Cookie making a safe and user information is not exposed.
  -  At each and every step user verification is done using tokens,
  - Sensitive user data such as password are hashed and stored in database using bcrypt.

