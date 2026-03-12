const express = require('express');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

// Todas as rotas de tarefas agora começam com /tasks
app.use('/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor profissional rodando na porta ${PORT}`);
});