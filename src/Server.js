import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import { MongoClient, GridFSBucket,ObjectId } from 'mongodb';
import { Readable } from 'stream';
import cookieParser from 'cookie-parser';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import axios from 'axios';
import path from 'path';
import { data } from 'react-router-dom';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const serviceSid = process.env.serviceSid; // Twilio Verify service SID
const client2 = twilio(accountSid, authToken);


// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173', // Specify the frontend URL explicitly
    credentials: true, // Allow credentials (cookies) to be sent
    optionSuccessStatus:200
  };
  
  app.use(cors(corsOptions));




// Connect to MongoDB (specify the database 'eFIR')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create MongoDB connection and GridFS bucket
let gridfsBucket;
const client = new MongoClient(process.env.MONGO_URI);
client.connect().then(() => {
  const db = client.db(); // Use default database specified in MONGO_URI
  gridfsBucket = new GridFSBucket(db, { bucketName: 'fileUploads' });
  console.log('Connected to GridFS bucket');
}).catch(err => console.log('Error connecting to MongoDB:', err));

// Define storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Utility function to generate a random 6-character alphanumeric ID
const generateUserID = () => {
    return Math.random().toString(36).substr(2, 6);
};

// Define Mongoose Schema and Model for Users
const userSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role:{type:String,required:true},
    Notifications:{type:[{message: { type: String, required: true },
    timestamp: { type: Date, required: true }}]}
});
const FirSchema = new mongoose.Schema({
    FIR_ID: { type: String, required: true },
    AccountName: { type: String, required: true },
    AccountID: { type: String, required: true },
    FullName: { type: String, required: true },
    ContactNumber: { type: String, required: true },
    Email: { type: String },
    ResidentialAddress: { type: String, required: true },
    IncidentDetails: { type: String, required: true },
    TypeOfComplaint: { type: String, required: true },
    JurisdictionArea:{type:String,required:true},
    SupportingFiles: { type: [String] },
    Comments: { type: String },
    StatusOfFir: { type: String },
    DateFiled: { type: String },
    LastUpdatedDate: { type: String },
    CurrrentlyAssignedOfficer:{type:String},
    UpdateLogs:{type:[{
        message: { type: String, required: true },
        timestamp: { type: Date, required: true }
    }]}
});
const AnnouncementSchema=new mongoose.Schema({
    AnnouncementTitle:{type:String},
    AnnouncementDetail:{type:String},
})
const MessageSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String},
    phoneNumber:{type:String,required:true},
    subject:{type:String,required:true},
    message:{type:String,required:true},
    SubmitedDate: { type: String,required:true },
})
const AdminSchema=new mongoose.Schema({
    AdminID:{type:String,required:true},
    Username:{type:String,required:true},
    Password:{type:String,required:true},
    Fullname:{type:String,required:true},
    Email:{type:String,required:true},
    ContactNumber:{type:String,required:true},
    Role:{type:String,required:true},
    JurisdictionArea:{type:String,required:true},
    Notifications:{type:[{message: { type: String, required: true },
        timestamp: { type: Date, required: true }}]}
})
const Message=mongoose.model('contactusmessages',MessageSchema)
const Announcement=mongoose.model('Announcements',AnnouncementSchema);
const User = mongoose.model('Users', userSchema);
const Fir = mongoose.model('FIR', FirSchema);
const Admin=mongoose.model('admin',AdminSchema);

// Upload FIR route using GridFS
app.post('/uploadFIR', upload.array('files', 10), async (req, res) => {
    try {
        const { AccountName, AccountID, FullName, ContactNumber, Email, ResidentialAddress, IncidentDetails, TypeOfComplaint, Comments, StatusOfFir, DateFiled, LastUpdatedDate, JurisdictionArea } = req.body;

        // Validate required fields
        if (!AccountName || !AccountID || !FullName || !ContactNumber || !ResidentialAddress || !IncidentDetails || !TypeOfComplaint || !JurisdictionArea) {
            window.alert('All required fields must be filled!')
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        let fileIDs = [];

        // Handle uploaded files with GridFS
        if (req.files) {
            // Use Promise.all to handle asynchronous file uploads
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
                        contentType: file.mimetype,
                    });

                    const readableFileStream = Readable.from(file.buffer);
                    readableFileStream.pipe(uploadStream);

                    uploadStream.on('finish', () => {
                        console.log("hello");
                        fileIDs.push(uploadStream.id.toString()); // Store file's GridFS ID
                        resolve(); // Resolve the promise when the upload is complete
                    });

                    uploadStream.on('error', (err) => {
                        console.error('Error uploading file to GridFS:', err);
                        reject(err); // Reject the promise on error
                    });
                });
            });

            // Wait for all files to upload before continuing
            await Promise.all(uploadPromises);
        }



        // Create a new FIR document
        const newFIR = new Fir({
            FIR_ID: generateUserID(), // Generate FIR ID
            AccountName,
            AccountID,
            FullName,
            ContactNumber,
            Email,
            ResidentialAddress,
            IncidentDetails,
            TypeOfComplaint,
            JurisdictionArea,
            SupportingFiles: fileIDs, // Store an array of file IDs from GridFS
            Comments,
            StatusOfFir,
            DateFiled,
            LastUpdatedDate,
        });

        // Save the FIR to the database
        await newFIR.save();

        res.status(201).json({ message: 'FIR filed successfully.' });
    } catch (error) {
        console.error('Error uploading FIR:', error);
        res.status(500).json({ message: 'Internal server error. FIR was not uploaded.' });
    }
});
app.get('/UserDashBoard/:accountId', async (req, res) => {
    try {
        const { accountId } = req.params;
        const firs = await Fir.find({ AccountID: accountId }).exec();
        
        if (!firs) {
            return res.status(404).json({ message: 'No FIRs found for this user.' });
        }
        
        res.json(firs);
    } catch (error) {
        console.error('Error fetching FIRs:', error);
        res.status(500).json({ message: 'Error fetching FIRs' });
    }
});

app.get('/Announcements',async(req,res)=>{
    try{
        const announcementObjects=await Announcement.find();
        res.json(announcementObjects);

    }catch(error){
        console.error("Error fetching announcements:",error);
        res.status(500).json({message:'Error fetching announcements'});
    }
})
app.post('/Announcements',async(req,res)=>{
    try {
        const {title , content}=req.body;
        const newAnnouncement=new Announcement({
            AnnouncementTitle:title,
            AnnouncementDetail:content,
        })
        await newAnnouncement.save();


    } catch (error) {
        console.error("Error while adding the announcement:",error);
        res.status(500).json({message:'Error while adding announcement'});
    }
})
app.delete('/announcements/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        await Announcement.findOneAndDelete({_id:id});
    }catch(error){
        console.error("Error while deleting the announcement:",error);
        res.status(500).json({message:'Error while deleting the announcement'});
    }
})
app.put('/announcements/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        const announcementObject=req.body;
        console.log('put')
        console.log(id,announcementObject)
        await Announcement.updateOne({_id:id},{$set:{AnnouncementTitle:announcementObject.title,AnnouncementDetail:announcementObject.content}})
    }catch(error){
        console.error("Error while updating the announcement:",error);
        res.status(500).json({message:'Error while updating the announcement'});
    }
})
app.get('/queries',async (req,res)=>{
    try {
        const queryObjects= await Message.find();
        res.json(queryObjects);
    } catch (error) {
        console.error("Error while fetching the queries:",error);
        res.status(500).json({message:'Error while fetching the queries'});
    }
})
app.delete('/queries/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        await Message.findOneAndDelete({_id:id});
    } catch (error) {
        console.error("Error while deleting the query:",error);
        res.status(500).json({message:'Error while deleting the query'});
    }
})

app.get('/admin/firs/:id',async(req,res)=>{
    try {
        const {id}=req.params;
        const adminObject=await Admin.findOne({AdminID:id});
        const adminJurisdictionArea=adminObject.JurisdictionArea;
        console.log(adminJurisdictionArea);
        const firs=await Fir.find({JurisdictionArea:adminJurisdictionArea});
        res.json(firs);
    } catch (error) {
        console.error('Error fetching FIRs:', error);
        res.status(500).json({ message: 'Error while fetching FIRs' });
    }
})
app.get("/admin/statistics/:id", async (req, res) => {
    try {
      const {id}=req.params;
      const adminObject = await Admin.findOne({AdminID:id});
      const firs=await Fir.find({JurisdictionArea:adminObject.JurisdictionArea});
      // Function to parse date strings in "DD/MM/YYYY, HH:mm:SS" format
      const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(", ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      };
  
      // Complaint Data
      const complaintData = firs.reduce((acc, fir) => {
        acc[fir.TypeOfComplaint] = (acc[fir.TypeOfComplaint] || 0) + 1;
        return acc;
      }, {});
  
      // Year Data
      const yearData = firs.reduce((acc, fir) => {
        const dateFiled = typeof fir.DateFiled === "string" ? parseDate(fir.DateFiled) : fir.DateFiled;
        const year = new Date(dateFiled).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});
  
      res.json({ complaintData, yearData });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

app.post('/contactUsMessage', async (req, res) => {
    try {
        const { username, email, phoneNumber, subject , message } = req.body;

        // Validate request data
        if (!username || !phoneNumber ||!message) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }
        var SubmitedDate=new Date().toLocaleString();

        
        // Create a new user instance
        const newMessage = new Message({
            username,
            email,
            phoneNumber,
            subject,
            message,
            SubmitedDate,
        });

        // Save user to the database
        await newMessage.save();

        

        res.status(201).json({ message: 'Message sent successfully.',});
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error. Message has not been sent.' });
    }
});
app.post('/admin/login', async (req, res) => {
    try {
        const { adminUsername, password } = req.body;

        // Validate request data
        if (!adminUsername || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user exists
        const user = await Admin.findOne({  Username: adminUsername });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { AdminId: user.AdminID, username: user.Username,role:user.Role },
            process.env.JWT_SECRET, // Use a secret key from .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set the token in an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // HTTPS only in production
            maxAge: 24*3600000, // Cookie expires in 1 hour
        });
        console.log(req.cookies.authToken);

        res.status(200).json({ message: 'Login successful.',role: user.Role });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Validate request data
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if user exists
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
          });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userID, username: user.username,role:'user' },
            process.env.JWT_SECRET, // Use a secret key from .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set the token in an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // HTTPS only in production
            maxAge: 24*3600000, // Cookie expires in 1 hour
        });
        console.log(req.cookies.authToken);

        res.status(200).json({ message: 'Login successful.',role: 'user' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


app.post('/admin/register', async (req, res) => {
    try {
        const {
            Username,
            Fullname,
            Password,
            Email,
            ContactNumber,
            Role,
            JurisdictionArea,
        } = req.body;

        // Validate request data
        if (
            !Username ||
            !Fullname ||
            !Password ||
            !Email ||
            !ContactNumber ||
            !Role ||
            !JurisdictionArea
        ) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if username or email already exists
        const existingAdminByUsername = await Admin.findOne({ Username });
        if (existingAdminByUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const existingAdminByEmail = await Admin.findOne({ Email });
        if (existingAdminByEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const existingAdminByContact = await Admin.findOne({ ContactNumber });
        if (existingAdminByContact) {
            return res.status(400).json({ message: 'Contact number already in use.' });
        }

        // Generate AdminID manually
        const AdminID = `ADM-${Date.now()}`;

        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new admin instance
        const newAdmin = new Admin({
            AdminID,
            Username,
            Password: hashedPassword,
            Fullname,
            Email,
            ContactNumber,
            Role,
            JurisdictionArea,
        });

        // Save admin to the database
        await newAdmin.save();

        // Generate JWT token
        const token = jwt.sign(
            { AdminID: newAdmin.AdminID, Username: newAdmin.Username, Role: newAdmin.Role },
            process.env.JWT_SECRET, // Use a secret key from .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Set the token in an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'none',
        });

        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        // Validate request data
        if (!username || !password || !phoneNumber) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        // Check if username already exists
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        // Check if phone number already exists
        const existingUserByPhone = await User.findOne({ phoneNumber });
        if (existingUserByPhone) {
            return res.status(400).json({ message: 'Phone number already in use.' });
        }

        // Generate userID manually here
        const userID = generateUserID();

        // Hash password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            userID,
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            role:'User',
        });

        // Save user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.userID, username: newUser.username,role:'user' },
            process.env.JWT_SECRET, // Use a secret key from .env
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        console.log(token);
        // Set the token in an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // HTTPS only in production
            maxAge: 24*3600000, // Cookie expires in 1 hour
        });
        console.log(req.cookies['authToken'])

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.post('/admin/addlog', async (req, res) => {
    const { firId, message } = req.body;

    try {
        // Create a log entry with the message and current timestamp
        const logEntry = {
            message,
            timestamp: new Date().toISOString() // ISO format for timestamp
        };

        // Add the log entry to the UpdateLogs array
        const addLog = await Fir.findOneAndUpdate(
            { FIR_ID: firId },
            { $addToSet: { UpdateLogs: logEntry } }, // Push the log entry to UpdateLogs array
            { new: true } // Return the updated document
        );

        if (!addLog) {
            return res.status(404).json({ message: `FIR with ID ${firId} not found.` });
        }
        const notificationsMsg=`FIR:#${firId} update:${message}`;
        const timestamp=new Date();
        console.log(notificationsMsg);
        sendNotification({notificationsMsg,timestamp},addLog.AccountID,false);

        res.json({ data: { message: `Log added successfully to FIR: ${firId}` } });
    } catch (error) {
        console.error('Error adding FIR log:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.get('/admin/fir/fetchlogs/:firId',async(req,res)=>{
    try {
        const {firId}=req.params;
        const response=await Fir.findOne({FIR_ID:firId});
        console.log(response);
        res.status(200).json(response.UpdateLogs);
    } catch (error) {
        console.error('Error fetching FIR logs:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})
app.put('/admin/fir/status',async (req,res)=>{
    try {
        const {firId,status}=req.body;
        console.log(firId,status);
        const updatedfir=await Fir.findOneAndUpdate({FIR_ID:firId},{$set:{StatusOfFir:status}},{new:true});
        const notificationsMsg=`FIR:#${firId} update: Status of FIR has been changed to ${status}`;
        const timestamp=new Date();
        sendNotification({notificationsMsg,timestamp},updatedfir.AccountID,false);
        res.status(200).json({ message: 'FIR Status changed successfully.' })
    } catch (error) {
        console.error('Error updating FIR status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})
app.put('/admin/fir/assign/:firID', async (req, res) => {
    try {
        const { firID } = req.params;
        const assignedOfficer = req.body;

        // Checking if the assigned officer is valid
        const isPresent = await Admin.exists({
            $and: [
                { AdminID: assignedOfficer.userID },
                { Username: assignedOfficer.username }
            ]
        });

        // If the officer does not exist, return an error response
        if (!isPresent) {
            return res.status(404).json({ message: 'Officer not found.' });
        }

        // Proceed to update the FIR document
        const thatfir = await Fir.findOneAndUpdate(
            { FIR_ID: firID },
            { $set: { CurrrentlyAssignedOfficer: assignedOfficer.username } },
            { new: true } // Option to return the updated document
        );

        // If no FIR was found, return an error
        if (!thatfir) {
            return res.status(404).json({ message: 'FIR not found.' });
        }
        var notificationsMsg=`FIR: #${firID} has been assigned to you.`;
        const timestamp=new Date();
        console.log(assignedOfficer.userID);
        sendNotification({notificationsMsg,timestamp},assignedOfficer.userID,true);
        notificationsMsg=`you FIR: #${firID} has been assigned to Officer : ${assignedOfficer.username}.`;
        sendNotification({notificationsMsg,timestamp},thatfir.AccountID,false);


        console.log(thatfir);
        res.status(200).json({ message: 'FIR successfully assigned to officer.' });

    } catch (error) {
        console.error('Error Assigning FIR to Officer:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/download/:fileID', async (req, res) => {
    try {
        const fileID = req.params.fileID;

        if (!ObjectId.isValid(fileID)) {
            return res.status(400).json({ message: 'Invalid file ID' });
        }

        const downloadStream = gridfsBucket.openDownloadStream(new ObjectId(fileID));

        // Set headers for file download
        downloadStream.on('file', (file) => {
            res.setHeader('Content-Type', file.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        });

        // Pipe the file to the response
        downloadStream.pipe(res);

        // Handle errors
        downloadStream.on('error', (err) => {
            console.error('Error during file download:', err);
            res.status(404).json({ message: 'File not found' });
        });
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

const sendNotification = async (messageEntry, userid, isAdmin) => {
    if (!userid) {
        return;
    }

    try {
        // Ensure that the messageEntry contains both message and timestamp
        const notification = {
            message: messageEntry.notificationsMsg,  // Include the message
            timestamp: messageEntry.timestamp        // Include the timestamp
        };

        if (isAdmin) {
            // If the user is an admin, add the notification to the admin's Notifications array
            console.log(notification);
            await Admin.findOneAndUpdate(
                { AdminID: userid },
                { $addToSet: { Notifications: notification } },  // Ensure unique entry
                { new: true } // Return the updated document
            );
        } else {
            // If the user is not an admin, add the notification to the user's Notifications array
            console.log(notification);
            await User.findOneAndUpdate(
                { userID: userid },
                { $addToSet: { Notifications: notification } },  // Ensure unique entry
                { new: true } // Return the updated document
            );
        }
    } catch (error) {
        console.error('Error sending notification to user:', error);
    }
};


app.get('/admin/notifications/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const response=await Admin.findOne({AdminID:id});
        res.status(200).json(response.Notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

app.get('/notifications/:id', async (req,res)=>{
    try {
        const {id}=req.params;
        console.log(id);
        const response=await User.findOne({userID:id});
        console.log(response);
        res.status(200).json(response.Notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})
app.get('/admin/firHistory/:id', async(req,res)=>{
    try {
        const {id}=req.params;
        const adm=await Admin.findOne({AdminID:id});
        console.log(adm);
        const JurisdictionArea=adm.JurisdictionArea;
        const firs = await Fir.find({
            $and: [
              { JurisdictionArea: JurisdictionArea },
              { StatusOfFir: { $in: ['Resolved', 'Closed'] } }
            ]
          });
          
        console.log(firs);
        res.status(200).json(firs);
    } catch (error) {
        console.error('Error fetching FIRs history:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})
app.get('/officer/fetchfir/:id',async (req,res)=>{
    try {
        const {id}=req.params;
        const firs= await Fir.find({CurrrentlyAssignedOfficer:id});
        res.status(200).json(firs);
    } catch (error) {
        console.error('Error fetching FIRs history:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
})

app.get('/firCounts', async (req, res) => {
    try {
      const counts = await Fir.aggregate([
        {
          $group: {
            _id: "$StatusOfFir",
            count: { $sum: 1 },
          },
        },
      ]);
  
      const totalFIRs = counts.reduce((acc, curr) => acc + curr.count, 0);
      const pendingFIRs = counts.find(c => c._id === "Pending")?.count || 0;
      const resolvedFIRs = counts.find(c => c._id === "Resolved")?.count || 0;
      console.log('hel',totalFIRs);
  
      res.json({
        totalFIRs,
        pendingFIRs,
        resolvedFIRs,
      });
    } catch (error) {
      console.error("Error fetching FIR counts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);

    try {
        const verification = await client2.verify.v2.services(serviceSid)
            .verifications
            .create({ to: `+91${phoneNumber}`, channel: 'sms' });

        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { phoneNumber, enteredOtp } = req.body;
    console.log(phoneNumber,enteredOtp);

    try {
        const verificationCheck = await client2.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: `+91${phoneNumber}`, code: enteredOtp });

        if (verificationCheck.status === 'approved') {
            res.status(200).json({ message: 'OTP verified successfully!' });
        } else {
            res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  


  
  const authenticate = (req, res, next) => {
    const token = req.cookies['authToken'];
    console.log(token);
  
    if (!token) {
      return res.status(401).json({ message: 'Token not present' });
    }
  
    try {
     console.log('hello')
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data to the request
      console.log(decoded);
      next();
    } catch (error) {
      req.user=null;
      console.log(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  
  app.get('/protected',authenticate, (req, res) => {
    console.log('hel')
    console.log(req.user);
    res.status(200).json(req.user);
  });
  app.post('/logout', (req, res) => {
    // Clear the authToken cookie
    res.clearCookie('authToken');
    
    // Send a response to the client indicating the user is logged out
    res.status(200).json({ message: 'Logged out successfully' });
  });

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
