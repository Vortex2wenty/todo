import { th } from 'date-fns/locale';
import Project from './project';

const DOM = (() => {
  let projects = [];
  const defaultProject = Project('Default');
  let currentProject;
  let localStorageProjects = [];

  const init = () => {
    saveToStorage();
    initProjectForm();
    initTodoForm();
    defaultProject.addTodo('Test', 'This is a test todo!', new Date(), 1, 'A comment on the todo!');
    addProject(defaultProject);
    displayProjectsList();
    displayProjectContent(projects.indexOf(defaultProject));
  };

  const initProjectForm = () => {
    const addProjectForm = document.querySelector('.form-add-project');
    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newProject = Project(document.querySelector('#add-project-name').value);
      addProject(newProject);
      saveToStorage();
      displayProjectsList();
    });
  };

  const saveToStorage = () => {
    let formattedProjects = [];
    for (const project of projects) {
      let formattedProject = {
        title: project.getTitle(),
        todos: project.getTodos(),
      };
      formattedProjects.push(formattedProject);
    }
    if (!(localStorage.getItem('projects'))) {
      localStorage.setItem('projects', JSON.stringify(formattedProjects));
    } else {
      localStorageProjects = JSON.parse(localStorage.getItem('projects'));
      localStorage.setItem('projects', localStorage.getItem('projects').concat(JSON.stringify(formattedProjects)));
      localStorageProjects = JSON.parse(localStorage.getItem('projects'));
      // projects = JSON.parse(localStorage.getItem('projects'));
      projects = [];
      localStorageProjects.forEach((value, index) => {
        let newProject = Project(value.title);
        addProject(newProject);
        value.todos.forEach((value) => {
          if (value !== null) {
            projects[index].addTodo(value.title, value.description, new Date(value.dueDate), value.priority, value.comment);
          }
        });
      });
    }
  };

  const initTodoForm = () => {
    // Date.valueAsDate.setDate(Date.getDate + 1);
    const addTodoForm = document.querySelector('.form-add-todo');
    addTodoForm.addEventListener('input', (e) => {
      document.querySelector('#todo-priority-output').value = document.querySelector('#add-todo-priority').value;
    });
    addTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTodo = [document.querySelector('#add-todo-name').value,
                       document.querySelector('#add-todo-description').value,
                       document.querySelector('#add-todo-duedate').valueAsDate,
                       +document.querySelector('#add-todo-priority').value,
                       document.querySelector('#add-todo-comment').value];
      projects[currentProject].addTodo(...newTodo);
      saveToStorage();
      displayProjectContent(currentProject);
    });
  };

  const initEditTodoForm = (todo) => {
    const editTodoForm = document.querySelector('.form-edit-todo');
    editTodoForm.addEventListener('input', (e) => {
      document.querySelector('#edit-todo-priority-output').value = document.querySelector('#edit-todo-priority').value;
    });
    const editTodoModal = document.querySelector('#editTodoModal');
    editTodoModal.querySelector('#edit-todo-name').value = todo.title;
    editTodoModal.querySelector('#edit-todo-description').value = todo.description;
    editTodoModal.querySelector('#edit-todo-duedate').value = `${todo.dueDate.getUTCFullYear()}-${todo.dueDate.getUTCMonth() < 10 ? '0' + [todo.dueDate.getUTCMonth() + 1] : todo.dueDate.getUTCMonth() + 1}-${todo.dueDate.getUTCDate()}`;
    editTodoModal.querySelector('#edit-todo-priority').value = todo.priority;
    editTodoModal.querySelector('#edit-todo-priority-output').textContent = todo.priority;
    editTodoModal.querySelector('#edit-todo-comment').value = todo.comment;
    // TODO Add submit and edit todo (just change the values because it is public)
    editTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const editedTodo = [projects[currentProject].getTodos().indexOf(todo),
                       document.querySelector('#edit-todo-name').value,
                       document.querySelector('#edit-todo-description').value,
                       document.querySelector('#edit-todo-duedate').valueAsDate,
                       +document.querySelector('#edit-todo-priority').value,
                       document.querySelector('#edit-todo-comment').value];
      projects[currentProject].editTodo(...editedTodo);
      saveToStorage();
      displayProjectContent(currentProject);
    });
  };

  const addProject = (project) => {
    projects.push(project);
  };

  const displayProjectsList = () => {
    saveToStorage();
    const projectsList = document.querySelector('.projects-list');
    projectsList.innerHTML = '';
    projects.forEach((value, index) => {
      const projectListItem = document.createElement('li');
      projectListItem.classList.add('nav-item');
      const projectListLink = document.createElement('a');
      projectListLink.textContent = value.title;
      projectListLink.classList.add('nav-link');
      projectListLink.setAttribute('href', '#');
      projectListItem.appendChild(projectListLink);
      projectListLink.addEventListener('click', () => {
        displayProjectContent(index);
      });
      projectsList.appendChild(projectListItem);
    });
  };

  const displayProjectContent = (index) => {
    const todosList = document.querySelector('.todos-list');
    todosList.innerHTML = '';
    currentProject = index;
    projects[index].getTodos().forEach((value, todoIndex) => {
      const todoListItem = document.createElement('li');
      let priorityType;
      if (value.priority === 0) {
        priorityType = 'alert-light';
      } else if (value.priority === 1) {
        priorityType = 'alert-info';
      } else if (value.priority === 2) {
        priorityType = 'alert-warning';
      } else {
        priorityType = 'alert-danger';
      }
      todoListItem.classList.add('nav-item', 'alert', priorityType);
      const todoListLink = document.createElement('a');
      todoListLink.classList.add('d-inline-block');
      todoListLink.textContent = value.title;
      todoListLink.classList.add('nav-link')
      todoListLink.setAttribute('href', '#');
      todoListLink.setAttribute('data-bs-toggle', 'modal');
      todoListLink.setAttribute('data-bs-target', '#showTodoModal');
      const editTodoLink = document.createElement('a');
      editTodoLink.setAttribute('href', '#');
      editTodoLink.classList.add('d-inline-block', 'float-end');
      editTodoLink.setAttribute('data-bs-toggle', 'modal');
      editTodoLink.setAttribute('data-bs-target', '#editTodoModal');
      const threeDotsMenu = document.createElement('i');
      threeDotsMenu.classList.add('bi', 'bi-three-dots-vertical');
      const deleteTodoLink = document.createElement('a');
      deleteTodoLink.setAttribute('href', '#');
      deleteTodoLink.classList.add('d-inline-block', 'float-end', 'me-1');
      const archiveMenu = document.createElement('i');
      archiveMenu.classList.add('bi', 'bi-archive');
      editTodoLink.appendChild(threeDotsMenu);
      deleteTodoLink.appendChild(archiveMenu);
      todoListItem.appendChild(todoListLink);
      todoListItem.appendChild(editTodoLink);
      todoListItem.appendChild(deleteTodoLink);
      todosList.appendChild(todoListItem);
      todoListItem.addEventListener('click', (e) => {
        const showTodoModal = document.querySelector('#showTodoModal');
        // TODO Add code to show title, description, etc
        showTodoModal.querySelector('.modal-title').textContent = value.title;
        const description = document.createElement('h3');
        description.textContent = `Description: ${value.description}`;
        const dueDate = document.createElement('h3');
        dueDate.textContent = `Due: ${value.dueDate.toUTCString()}`;
        const priority = document.createElement('h3');
        priority.textContent = `Priority: ${value.priority}`;
        priority.classList.add(priorityType);
        const comment = document.createElement('h3');
        comment.textContent = `Comment: ${value.comment}`;
        const modalBody = showTodoModal.querySelector('.modal-body');
        modalBody.textContent = '';
        modalBody.appendChild(description);
        modalBody.appendChild(dueDate);
        modalBody.appendChild(priority);
        modalBody.appendChild(comment);
      });
      editTodoLink.addEventListener('click', (e) => {
        initEditTodoForm(value);
      });
      deleteTodoLink.addEventListener('click', (e) => {
        projects[currentProject].deleteTodo(todoIndex);
        saveToStorage();
        displayProjectContent(currentProject);
      });
    });
  };

  return { init, defaultProject };
})();

document.addEventListener('DOMContentLoaded', () => {
  DOM.init();
  console.log(DOM);
  console.log(DOM.defaultProject.getTodos());
});