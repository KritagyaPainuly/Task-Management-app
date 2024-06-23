// Assuming you already have basic functionality for adding tasks

// Function to render tasks
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.title;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;

        const taskDueDate = document.createElement('small');
        // Extracting date part from ISO format
        const dueDate = new Date(task.dueDate);
        taskDueDate.textContent = `Due Date: ${dueDate.toDateString()}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => deleteTask(task._id));

        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskDescription);
        taskItem.appendChild(taskDueDate);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    });
}

// Function to delete task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            loadTasks(); // Reload tasks after deletion
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Function to load tasks from server
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        } else {
            console.error('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Event listener for adding task
document.getElementById('addTaskButton').addEventListener('click', async () => {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (title && dueDate) {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, dueDate }),
            });
            if (response.ok) {
                document.getElementById('taskTitle').value = '';
                document.getElementById('taskDescription').value = '';
                document.getElementById('taskDueDate').value = '';
                loadTasks(); // Reload tasks after adding new task
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    } else {
        console.error('Title and due date are required');
    }
});

// Load tasks on page load
window.addEventListener('load', loadTasks);
