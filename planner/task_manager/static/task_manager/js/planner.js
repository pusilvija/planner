class TaskManager {
    constructor() {
        this.tasks = Array.from(document.querySelectorAll('.task'));
        this.taskContainer = document.getElementById('task-container');
        this.taskTitle = document.getElementById('task-title');
        this.taskStatus = document.getElementById('task-status');
        this.taskDescription = document.getElementById('task-description');
        this.taskCategory = document.getElementById('task-category');
        this.addTaskButton = document.querySelector('.add-task');

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

        const taskPositions = this.tasks
            .map(t => ({ task: t, top: t.offsetTop }))
            .sort((a, b) => a.top - b.top);

        taskPositions.forEach((item, index) => {
            item.task.style.top = `${index * this.dragZoneHeight + this.spaceBetweenTasks}px`;
        });
    }

    setupTaskClickHandler(task) {
        let wasDragging = false;

        task.addEventListener('mousedown', () => wasDragging = false);
        task.addEventListener('mousemove', () => wasDragging = true);

        task.addEventListener('click', () => {
            if (!wasDragging) {
                const taskId = task.dataset.task; // Fetch the task ID from the `data-task` attribute
                window.location.href = `/task/${taskId}/`; // Redirect to the correct task detail URL
            }
            wasDragging = false;
        });

    }

}

// Initialize the TaskManager on page load
document.addEventListener('DOMContentLoaded', () => new TaskManager());
