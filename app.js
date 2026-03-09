const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs'); //Inporta o módulo de sistema de arquivos para ler o arquivo JSON

// Essencial: permite que o Express leia o corpo (body) em JSON
app.use(express.json());

const DATA_FILE = './tasks.json';

// Função auxiliar para ler os dados do arquivo
const readTasks = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

// Função auxiliar para salvar os dados no arquivo
const saveTasks = (tasks) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

// "Banco de Dados" em memória
let tasks = readTasks();

// --- ROTAS ---

// Listar todas (GET)
app.get('/tasks', (req, res) => {
  const tasks = readTasks(); // Lê as tarefas do arquivo a cada requisição
  res.json(tasks);
});

// Criar nova (POST)
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  const tasks = readTasks(); // Lê as tarefas do arquivo para garantir que estamos atualizados
  if (!title) return res.status(400).json({ error: "Título obrigatório" });

  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  saveTasks(tasks); // Salva as tarefas atualizadas no arquivo
  res.status(201).json(newTask);
});

// ATUALIZAR (PUT) - Verifique se esta parte está no seu arquivo!
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const tasks = readTasks(); // Lê as tarefas do arquivo
  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) return res.status(404).json({ error: "Não encontrada" });

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETAR (DELETE) - Verifique se esta parte está no seu arquivo!
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== parseInt(id));
  res.status(204).send();
});

// IMPORTANTE: O app.listen deve ser SEMPRE a última coisa do arquivo
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});