class TaskManager {
    constructor() {
        this.tasks = Array.from(document.querySelectorAll('.task'));
        this.taskContainer = document.getElementById('task-container');
        this.taskTitle = document.getElementById('task-title');
        this.taskStatus = document.getElementById('task-status');
        this.taskDescription = document.getElementById('task-description');
        this.taskCategory = document.getElementById('task-category');
        this.addTaskButton = document.getElementById('add-task');

        this.taskHeight = this.tasks[0].offsetHeight;
        this.spaceBetweenTasks = 20;
        this.dragZoneHeight = this.taskHeight + this.spaceBetweenTasks;

        this.isDragging = false;

        this.initialize();
    }

    initialize() {
        this.setInitialTaskSpacing();
        this.tasks.forEach(task => {
            this.initializeTaskDragging(task);
            this.setupTaskClickHandler(task);
        });

        if (this.addTaskButton) {
            this.addTaskButton.addEventListener('click', () => {
                window.location.href = "{% url 'task_manager:add' %}" });
        }
    }

    setInitialTaskSpacing() {
        this.tasks.forEach((task, index) => {
            task.style.top = `${index * this.dragZoneHeight + this.spaceBetweenTasks}px`;
        });

        // Adjust the container's height dynamically, but do NOT change its top position
        let totalHeight = this.tasks.length * (this.taskHeight + this.spaceBetweenTasks) + this.taskHeight;

        this.taskContainer.style.height = `${totalHeight}px`; // Allows natural expansion

        // Ensure the page itself grows so it can scroll properly
        document.body.style.minHeight = `${totalHeight + 500}px`; // Adjust for extra spacing
    }

    initializeTaskDragging(task) {
        task.addEventListener('mousedown', (e) => this.startDragging(task, e));
    }

    startDragging(task, e) {
        this.isDragging = true;
        let offsetY = e.clientY - task.offsetTop;
        task.classList.add('dragging');

        const onMouseMove = (e) => {
            requestAnimationFrame(() => this.updateDraggedTaskPosition(task, e, offsetY));
        };

        const onMouseUp = () => {
            this.stopDragging(task, onMouseMove, onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    updateDraggedTaskPosition(task, e, offsetY) {
        let newTop = Math.max(0, Math.min(e.clientY - offsetY, this.taskContainer.offsetHeight - task.offsetHeight));
        task.style.top = `${newTop}px`;
    }

    stopDragging(task, onMouseMove, onMouseUp) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        task.classList.remove('dragging');
        this.isDragging = false;
        this.reorderTasks()
    }

    reorderTasks() {
        const taskPositions = this.tasks
                .map(t => ({ task: t, top: t.offsetTop }))
                .sort((a, b) => a.top - b.top);
        taskPositions.forEach((item, index) => {
            item.task.style.top = `${index * this.dragZoneHeight + this.spaceBetweenTasks}px`;
            this.updateTaskOrder(item.task.id, index);
        });
    }

    updateTaskOrder(taskId, newOrder) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;  // Get the CSRF token

        // Create the URL for the request dynamically using the taskId
        const url = `/update-task-order/${taskId}/`;

        // Send the POST request to the URL
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Add CSRF token to headers
            },
            body: JSON.stringify({
                new_order: newOrder  // Send the new order value to the server
            })
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            if (data.status === 'success') {
                console.log('Order updated successfully');
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    setupTaskClickHandler(task) {
        let wasDragging = false;

        task.addEventListener('mousedown', () => wasDragging = false);
        task.addEventListener('mousemove', () => wasDragging = true);

        task.addEventListener('click', () => {
            if (!wasDragging) {
                const taskId = task.id; // Fetch the task ID
                window.location.href = `/task/${taskId}/`; // Redirect to the correct task detail URL
            }
            wasDragging = false;
        });

    }

}

// Initialize the TaskManager on page load
document.addEventListener('DOMContentLoaded', () => new TaskManager());
