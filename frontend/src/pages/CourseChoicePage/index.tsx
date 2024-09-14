import { useState } from "react";
import { AddDrop } from "./AddDrop";

export const CourseChoicePage = () => {
  const [isAddMode, setIsAddMode] = useState(true); // Track whether we're in Add or Drop mode

  // State for the "Add" AddDrop
  const [addNumberOfCourses, setAddNumberOfCourses] = useState(1);
  const [addAllInputs, setAddAllInputs] = useState<string[]>([""]);

  const handleAddAnotherAddCourse = () => {
    if (addNumberOfCourses < 2) {
      setAddNumberOfCourses(addNumberOfCourses + 1);
      setAddAllInputs([...addAllInputs, ""]);
    }
  };

  // State for the "Drop" AddDrop
  const [dropNumberOfCourses, setDropNumberOfCourses] = useState(1);
  const [dropAllInputs, setDropAllInputs] = useState<string[]>([""]);

  const handleAddAnotherDropCourse = () => {
    if (dropNumberOfCourses < 2) {
      setDropNumberOfCourses(dropNumberOfCourses + 1);
      setDropAllInputs([...dropAllInputs, ""]);
    }
  };

  // Handle switching between Add and Drop mode
  const handleNextClick = () => {
    setIsAddMode(false); // Switch to Drop mode when Next is clicked
  };

  return (
    <div>
      {isAddMode ? (
        <div>
          <h1>Add Courses</h1>
          <AddDrop
            numberOfCourses={addNumberOfCourses}
            allInputs={addAllInputs}
            setAllInputs={setAddAllInputs}
            handleAddAnotherCourse={handleAddAnotherAddCourse}
          />
        </div>
      ) : (
        <div>
          <h1>Drop Courses</h1>
          <AddDrop
            numberOfCourses={dropNumberOfCourses}
            allInputs={dropAllInputs}
            setAllInputs={setDropAllInputs}
            handleAddAnotherCourse={handleAddAnotherDropCourse}
          />
        </div>
      )}
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
};
