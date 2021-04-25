// for new object todo (made with factory function):
const Todo = (title, description, dueDate = '', priority = 0, comment = '') => {
  let isComplete = false;
  const toggleComplete = () => {
    isComplete ? isComplete = false : isComplete = true;
  };

  return { title, description, dueDate, priority, comment, toggleComplete };
};

export default Todo;
  // initialize a title
  // initialize a description
  // initialize a dueDate
  // initialize a priority
  // initialize a comment
  // initialize isComplete (private)
  // function toggleComplete