import Todo from './todo';
// for new object Project (made with factory function):
const Project = (title) => {
  let todos = [];
  const addTodo = (title, description, dueDate = '', priority = 0, comment = '') => {
    todos.push(Todo(title, description, dueDate, priority, comment));
  };

  const getTodos = () => {
    return todos;
  };

  const editTodo = (index, title, description, dueDate = '', priority = 0, comment = '')=> {
    todos[index].title = title;
    todos[index].description = description;
    todos[index].dueDate = dueDate;
    todos[index].priority = priority;
    todos[index].comment = comment;
  };

  const deleteTodo = (index) => {
    delete todos[index];
  };

  return { addTodo, getTodos, editTodo, deleteTodo, title };
};

export default Project;  
  // initialize a title
  // initialize array todos
  // function addTodo(same params as Todo object):
    // pushes Todo object to array todos, with parameters from function
  // function getTodos()
    // returns todos array
  