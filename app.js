const express = require('express');
const app = express();
const port = 3000;

// Essencial: permite que o Express leia o corpo (body) em JSON
app.use(express.json());

// Nosso "Banco de Dados" em memória
let tasks = [
  { id: 1, title: "Estudar Node.js", completed: false },
  { id: 2, title: "Criar meu portfólio", completed: false }
];

// --- ROTAS ---

// Listar todas (GET)
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Criar nova (POST)
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Título obrigatório" });

  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// ATUALIZAR (PUT) - Verifique se esta parte está no seu arquivo!
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
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