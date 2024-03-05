// app.js

// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
let PORT = 3001;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: false,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

// Rest of the code remains unchanged


// MongoDB Models and Schema
const departmentSchema = new mongoose.Schema({
  name: { type: String, unique: true, index: true, required: true },
  duties: { type: String, text: true },
  startDate: { type: Date, required: true },
  deptHead: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
});

const employeeSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  leavingDate: { type: Date },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  designation: { type: String, required: true },
});

const payoutSchema = new mongoose.Schema({
  payoutDate: { type: Date, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  fixedAmount: { type: Number, required: true },
  variableAmount: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
});

const Department = mongoose.model('Department', departmentSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Payout = mongoose.model('Payout', payoutSchema);

// API routes
app.post('/api/department/create', async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/department/update/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employee/create', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employee/update/:email', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employee/delete/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payout/upload', async (req, res) => {
  // Implement Payout Upload logic (considering CSV file processing)
});

// Handle 'EADDRINUSE' error by choosing a different port
app.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying another port.`);
    PORT += 1;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } else {
    console.error('Server error:', error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
