# eFIR - Online First Information Report Filing System 

A simple and efficient FIR (First Information Report) Filing System designed for managing and storing FIRs in a digital format. This system allows police stations or public users to register, view, and manage FIRs, making the process faster and more organized.
[Video Demonstration](https://youtu.be/lNCQHijM3G8)

## Tech Stack 🧑‍💻
- Frontend : ReactJS(HTML, CSS, JavaScript)
- backend : Node.js, Express
- Authentication : jwt(JSON Web Tokens), bcrypt
- Database : MongoDB
- Notifications & OTP verification : twilio

## Features and Roles
- ### Public User:  
  - File an FIR.
  - Check FIR status and case updates.
  - Download FIR details in pdf format.
  - Upload option to upload supporting files along with FIR.
  - Get notifications for every FIR updates.
  - Ask any Query in Contact Us section.
- ## Jurisdiction Admin: 👮
  - Get filed FIRs in the particular Juridiction Area.
  - Add update logs and change status of FIRs.
  - Assign FIR cases to other officers.
  - Statistcs to monitor different types of FIR filed and their frequencies over years.
  - Get notifications of updates.
  - Get Queries raised by the public.
  - Add, edit and update announcements section in home page.
- ## Police Officer: 👮
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

## Installation Guide
- ### Prerequisites
  - Before you begin, ensure you have the following installed on your machine:
    - [Node.js](https://nodejs.org/) (version 14 or later)
    - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for database.
      - After creating MongoDB Atlas account make sure in mongoDB Atlas you allow access to all IP address networks and make a 'eFIR' named Database.
    - [Git](https://git-scm.com/)
    - [npm](https://www.npmjs.com/) for managing dependencies
  
  ### Step by Step Installation 🚀

  #### 1. Clone the repository
  ```bash
  git clone https://github.com/yourusername/fir-filing-system.git
  cd eFIR
  npm install
  ```
  #### 2. Install Frontend and Backend dependencies
  ```bash
  npm install express body-parser axios bcrypt chart.js cookie-parser cors date-fns dotenv formidable gridfs-stream jsonwebtoken jspdf jspdf-autotable jwt-decode mongodb mongoose multer nodemailer react react-chartjs-2 react-dom react-router-dom

  npm install --save-dev @eslint/js @types/react @types/react-dom @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals vite

  ```
  #### 3. Setup Environmental Variables
  ##### Create a .env file in the backend directory and add the following variables according to your account:
  ```makefile
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.ctybb.mongodb.net/eFIR?retryWrites=true&w=majority&  appName=Cluster0
  DB_PASSWORD=<password>
  JWT_SECRET=<supersecuresecret>
  ```
  ### 4. Run the Frontend server
  ```bash
  npm run dev
  ```
  ### 5. Run the Backend server
  ```bash
  cd src
  node Server.js
  ```
  ## Conclusion
  ###### Thank You for Reading! I hope you like my project and if you want to make any changes or modify ,this project is open for contributions. 😊
  ----
  🚀 End of README


