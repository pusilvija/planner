class TaskManager {
    constructor() {
        this.tasks = Array.from(document.querySelectorAll('.task'));
        this.taskContainer = document.getElementById('task-container');
        this.modal = document.getElementById('task-modal');
        this.closeModal = document.getElementById('close-modal');
        this.taskTitle = document.getElementById('task-title');
        this.taskStatus = document.getElementById('task-status');
        this.taskDescription = document.getElementById('task-description');
        this.taskDeadline = document.getElementById('task-deadline');
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

        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.closeTaskModal());
        }

        if (this.addTaskButton) {
            this.addTaskButton.addEventListener('click', () => this.openEmptyTaskModal());
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
            if (!wasDragging) this.openTaskModal(task);
            wasDragging = false;
        });
    }

    openTaskModal(task) {
        const taskData = Object.fromEntries(
            Object.keys(task.dataset).map(key => [key, task.dataset[key]])
            );
        this.renderModal(taskData);
    }

    openEmptyTaskModal() {
        this.taskTitle.innerText = '';
        this.taskStatus.innerText = '';
        this.taskDescription.innerText = '';
        this.taskCategory.innerText = '';
        this.taskDeadline.innerText = '';

        this.positionModalAtCenter();
        this.modal.style.display = 'flex';
    }

    renderModal(taskData) {
        this.taskTitle.innerText = taskData.name;
        this.taskStatus.innerText = taskData.status;
        this.taskDescription.innerText = taskData.description;
        this.taskCategory.innerText = taskData.category;
        this.taskDeadline.innerText = taskData.deadline;

        this.positionModalAtCenter();
        this.modal.style.display = 'flex';
    }

    closeTaskModal() {
        this.modal.style.display = 'none';
    }

    positionModalAtCenter() {
        this.modal.style.top = `${(window.innerHeight - this.modal.offsetHeight) / 2}px`;
        this.modal.style.left = `${(window.innerWidth - this.modal.offsetWidth) / 2}px`;
    }
}

// Initialize the TaskManager on page load
document.addEventListener('DOMContentLoaded', () => new TaskManager());
