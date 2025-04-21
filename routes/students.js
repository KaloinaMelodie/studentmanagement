let { Student } = require("../model/schemas");

function getAll(req, res) {
  Student.find()
    .then((students) => {
      res.send(students);
    })
    .catch((err) => {
      res.send(err);
    });
}

function getById(req, res) {
    const id = req.params.id;

    Student.findById(id)
        .then((student) => {
            if (!student) {
                return res.status(404).send({ message: "Étudiant non trouvé" });
            }
            res.send(student);
        })
        .catch((err) => {
            res.status(500).send({ message: "Erreur serveur", error: err });
        });
}



async function deleteEtudiant(req, res) {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    console.log(deletedStudent);
    
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      studentId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
}

function create(req, res) {
  let student = new Student();
  student.firstName = req.body.firstName;
  student.lastName = req.body.lastName;

  student
    .save()
    .then((student) => {
      res.json({ message: `student saved with id ${student.id}!` });
    })
    .catch((err) => {
      res.send("cant post student ", err);
    });
}

function update(req, res) {
    const studentId = req.params.id;

    Student.findById(studentId)
        .then((student) => {
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            student.firstName = req.body.firstName || student.firstName;
            student.lastName = req.body.lastName || student.lastName;

            return student.save();
        })
        .then((updatedStudent) => {
            res.json({ message: `Student with id ${updatedStudent.id} updated!` });
        })
        .catch((err) => {
            res.status(500).send('Cannot update student: ' + err);
        });
}

module.exports = { getAll, create, update,deleteEtudiant ,getById};
