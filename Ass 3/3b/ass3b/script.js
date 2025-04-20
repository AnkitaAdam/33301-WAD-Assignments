const apiUrl = "http://localhost:3000/students";

document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const rollNo = document.getElementById("rollNo").value;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rollNo }),
    });

    const data = await response.json();
    alert(data.message);
    loadStudents();
});

async function loadStudents() {
    const response = await fetch(apiUrl);
    const students = await response.json();

    const studentList = document.getElementById("studentList");
    studentList.innerHTML = "";

    students.forEach((student) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>
                <button onclick="showEditModal('${student.rollNo}', '${student.name}')" class="edit-btn">Edit</button>
                <button onclick="deleteStudent('${student.rollNo}')" class="delete-btn">Delete</button>
            </td>
        `;

        studentList.appendChild(row);
    });
}

async function deleteStudent(rollNo) {
    const response = await fetch(`${apiUrl}/${rollNo}`, { method: "DELETE" });
    const data = await response.json();
    alert(data.message);
    loadStudents();
}

function showEditModal(rollNo, name) {
    document.getElementById("editModal").style.display = "block";
    document.getElementById("editName").value = name;
    document.getElementById("editRollNo").value = rollNo;
}

document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("editModal").style.display = "none";
});

async function updateStudent() {
    const name = document.getElementById("editName").value;
    const rollNo = document.getElementById("editRollNo").value;

    const response = await fetch(`${apiUrl}/${rollNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    const data = await response.json();
    alert(data.message);
    document.getElementById("editModal").style.display = "none";
    loadStudents();
}

loadStudents();
