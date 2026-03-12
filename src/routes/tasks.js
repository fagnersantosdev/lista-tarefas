const express = require('express');
const router = express.Router();
const { readTasks, saveTasks } = require('../utils/fileHandler');

// GET /tasks
router.get('/', (req, res) => {
  res.json(readTasks());
});

// POST /tasks
router.post('/', (req, res) => {
  const { title } = req.body;
  const tasks = readTasks();
  const newTask = { id: Date.now(), title, completed: false };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// ATUALIZAR (PUT) - Verifique se esta parte está no seu arquivo!
router.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  let tasks = readTasks(); // Lê o que está no arquivo
  const taskIndex = tasks.findIndex(t => t.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  // Atualiza os campos se eles existirem no corpo da requisição
  if (title !== undefined) tasks[taskIndex].title = title;
  if (completed !== undefined) tasks[taskIndex].completed = completed;

  saveTasks(tasks); // Salva a lista atualizada de volta no arquivo
  res.json(tasks[taskIndex]);
});

// DELETAR (DELETE) - Verifique se esta parte está no seu arquivo!
router .delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  
  const newTasks = tasks.filter(t => t.id !== parseInt(id));

  if (tasks.length === newTasks.length) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  saveTasks(newTasks); // Salva a nova lista (sem a tarefa deletada)
  res.status(204).send();
});


module.exports = router;