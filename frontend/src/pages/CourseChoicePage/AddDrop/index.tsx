interface AddDropProps {
  numberOfCourses: number;
  allInputs: string[];
  setAllInputs: (inputs: string[]) => void;
  handleAddAnotherCourse: () => void;
}

export const AddDrop = ({
  numberOfCourses,
  allInputs,
  setAllInputs,
  handleAddAnotherCourse,
}: AddDropProps) => {
  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = allInputs.map((input, i) =>
      i === index ? value : input
    );
    setAllInputs(updatedInputs);
  };

  return (
    <div>
      {[...Array(numberOfCourses)].map((_, index) => (
        <input
          key={index}
          type="text"
          value={allInputs[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}

      <button onClick={handleAddAnotherCourse}>Add another course</button>
    </div>
  );
};
