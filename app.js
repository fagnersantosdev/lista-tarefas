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
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  
  const newTasks = tasks.filter(t => t.id !== parseInt(id));

  if (tasks.length === newTasks.length) {
    return res.status(404).json({ error: "Tarefa não encontrada" });
  }

  saveTasks(newTasks); // Salva a nova lista (sem a tarefa deletada)
  res.status(204).send();
});

// IMPORTANTE: O app.listen deve ser SEMPRE a última coisa do arquivo
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});