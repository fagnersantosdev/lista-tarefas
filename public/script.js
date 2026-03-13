const API_URL = 'http://localhost:3000/tasks';

// Função para buscar e exibir tarefas
async function loadTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="${task.completed ? 'text-decoration: line-through' : ''}">${task.title}</span>
            <button onclick="deleteTask(${task.id})">🗑️</button>
        `;
        list.appendChild(li);
    });
}

// Função para adicionar tarefa
async function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value })
    });

    input.value = '';
    loadTasks();
}

// Função para deletar
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTasks();
}

loadTasks(); // Carrega ao abrir a página