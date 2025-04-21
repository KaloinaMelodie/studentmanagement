let {Course} = require('../model/schemas');

function getAll(req, res) {
    Course.find().then((classes) => {
        res.send(classes);
    }).catch((err) => {
        res.send(err);
    });
}

async function deleteCourse(req, res) {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    console.log(deletedCourse);
    
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      courseId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error });
  }
}

function update(req, res) {
    const courseId = req.params.id;

    Course.findById(courseId)
        .then((course) => {
            if (!course) {
                return res.status(404).json({ message: "course not found" });
            }
            course.name = req.body.name           
            return course.save();
        })
        .then((updatedcourse) => {
            res.json({ message: `course with id ${updatedcourse.id} updated!`,updated:updatedcourse });
        })
        .catch((err) => {
            res.status(500).send('Cannot update course: ' + err);
        });
}


function create(req, res) {
    let course = new Course();
    course.name = req.body.name;
    course.code = req.body.code;

    course.save()
        .then((course) => {
                res.json({message: `course saved with id ${course.id}!`});
            }
        ).catch((err) => {
        res.send('cant post course ', err);
    });
}

module.exports = {getAll, create,update,deleteCourse};
