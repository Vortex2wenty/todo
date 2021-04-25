import Project from './project';

const DOM = (() => {
  let projects = [];
  const defaultProject = Project('Default');

  const init = () => {
    initProjectForm();
    initTodoForm();
    defaultProject.addTodo('Test', 'This is a test todo!', new Date(), 1, 'A comment on the Todo!');
    addProject(defaultProject);
    displayProjectsList();
  };

  const initProjectForm = () => {
    const addProjectForm = document.querySelector('.form-add-project');
    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newProject = Project(document.querySelector('#add-project-name').value);
      addProject(newProject);
      displayProjectsList();
    });
  };

  const initTodoForm = () => {
    // Date.valueAsDate.setDate(Date.getDate + 1);
  };

  const addProject = (project) => {
    projects.push(project);
  };

  const displayProjectsList = () => {
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = '';
    projects.forEach((value, index) => {
      const projectListItem = document.createElement('li');
      projectListItem.textContent = value.title;
      projectListItem.addEventListener('click', () => {
        displayProjectContent(index);
      });
      projectsList.appendChild(projectListItem);
    });
  };

  const displayProjectContent = (index) => {
    const todosList = document.querySelector('.todos-list');
    todosList.innerHTML = '';
    projects[index].getTodos().forEach((value) => {
      const todoListItem = document.createElement('li');
      todoListItem.textContent = value.title;
      todosList.appendChild(todoListItem);
    });
  };

  return { init, defaultProject };
})();

document.addEventListener('DOMContentLoaded', () => {
  DOM.init();
  console.log(DOM);
  console.log(DOM.defaultProject.getTodos());
});