const express = require('express');

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [];

//Mideware para checar se o projeto existe
function checkProjectExists(req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({error: 'Project not found!'});
  }

  return next();
}

//Midleware para mostrar o numero de requisições
function logRequests(req, res, next){
  numberOfRequests++;

  console.log(`Numero de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

//Projects
server.get('/projects', (req, res) =>{
  return res.json(projects);
});

server.post('/projects', (req, res) =>{
  const { id, title } = req.body;

  const project = {
    id, title, tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) =>{
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Tasks
server.post('/projects/:id/tasks', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.put('/projects/:id/tasks', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) =>{
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);