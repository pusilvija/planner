import { setInitialTaskSpacing } from './utils.js';
import { initializeTaskDragging } from './drag.js';
import { setupEditClickHandler } from './edit.js';
import { setupTaskClickHandler } from './events.js';
import { updateTaskOrder, editTaskName } from './api.js';

export class TaskManager {
    constructor() {
        this.tasks = Array.from(document.querySelectorAll('.task'));
        this.taskContainer = document.getElementById('task-container');
        this.taskTitle = document.getElementById('task-title');
        this.taskStatus = document.getElementById('task-status');
        this.taskDescription = document.getElementById('task-description');
        this.taskCategory = document.getElementById('task-category');
        this.addTaskButton = document.getElementById('add-task');
        this.taskHeight = this.tasks[0].offsetHeight; //this.tasks[0]?.offsetHeight || 100;
        this.spaceBetweenTasks = 20;
        this.dragZoneHeight = this.taskHeight + this.spaceBetweenTasks;
        this.isDragging = false;

        this.initialize();
    }

    initialize() {
        setInitialTaskSpacing(this.tasks, this.taskContainer, this.dragZoneHeight, this.spaceBetweenTasks);

        this.tasks.forEach(task => {
            initializeTaskDragging(task, this);
            setupEditClickHandler(task, this);
            setupTaskClickHandler(task);
        });

        if (this.addTaskButton) {
            this.addTaskButton.addEventListener('click', () => {
                window.location.href = "/add-task/";
            });
        }
    }

    reorderTasks() {
        const taskPositions = this.tasks
            .map(t => ({ task: t, top: t.offsetTop }))
            .sort((a, b) => a.top - b.top);

        taskPositions.forEach((item, index) => {
            item.task.style.top = `${index * this.dragZoneHeight + this.spaceBetweenTasks}px`;
            updateTaskOrder(item.task.id, index);
        });
    }

    editTaskName(taskId, newName) {
        editTaskName(taskId, newName);
    }
}
