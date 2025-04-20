const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const filePath = "students.json";

// Read Students from File
const readStudents = () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return data.length ? JSON.parse(data) : [];
};

// Write Students to File
const writeStudents = (students) => {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
};

// 📌 Register Student
app.post("/students", (req, res) => {
    let students = readStudents();
    const { name, rollNo } = req.body;

    if (!name || !rollNo) return res.status(400).json({ message: "Name and Roll No are required!" });

    if (students.find((s) => s.rollNo === rollNo)) {
        return res.status(400).json({ message: "Roll No already exists!" });
    }

    students.push({ name, rollNo });
    writeStudents(students);

    res.json({ message: "Student added successfully!", students });
});

// 📌 Get All Students
app.get("/students", (req, res) => {
    res.json(readStudents());
});

// 📌 Update Student
app.put("/students/:rollNo", (req, res) => {
    let students = readStudents();
    const rollNo = req.params.rollNo;
    const { name } = req.body;

    const index = students.findIndex((s) => s.rollNo === rollNo);
    if (index === -1) return res.status(404).json({ message: "Student not found!" });

    students[index].name = name;
    writeStudents(students);

    res.json({ message: "Student updated successfully!", students });
});

// 📌 Delete Student
app.delete("/students/:rollNo", (req, res) => {
    let students = readStudents();
    const rollNo = req.params.rollNo;

    students = students.filter((s) => s.rollNo !== rollNo);
    writeStudents(students);

    res.json({ message: "Student deleted successfully!", students });
});

app.listen(3000, () => console.log("Server running on port 3000"));
