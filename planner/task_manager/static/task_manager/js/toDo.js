// Immediately Invoked Function Expression (IIFE) for better scoping
(() => {
    // === DOM Element Caching ===
    const tasks = Array.from(document.querySelectorAll('.task'));
    const taskContainer = document.getElementById('task-container');
    const modal = document.getElementById('task-modal');
    const closeModal = document.getElementById('close-modal');
    const taskTitle = document.getElementById('task-title');
    const taskStatus = document.getElementById('task-status');
    const taskDescription = document.getElementById('task-description');
    const taskDeadline = document.getElementById('task-deadline');
    const taskCategory = document.getElementById('task-category');

    // === Constants ===
    const taskHeight = tasks[0].offsetHeight;
    const spaceBetweenTasks = 20;
    const dragZoneHeight = taskHeight + spaceBetweenTasks;

    // === State Variables ===
    let isDragging = false;
    let placeholderTop = null;

    // === Initialization ===
    function initialize() {
        setInitialTaskSpacing();
        tasks.forEach(task => {
            initializeTaskDragging(task);
            setupTaskClickHandler(task);
        });

        if (closeModal) {
            closeModal.addEventListener('click', closeTaskModal);
        }
    }

    // === Modal Functions ===
    function openTaskModal(task) {
        const taskData = {
            title: task.getAttribute("data-name"),
            status: task.getAttribute("data-status"),
            description: task.getAttribute("data-description"),
            category: task.getAttribute("data-category"),
            deadline: task.getAttribute("data-deadline"),
        };
        renderModal(taskData);
    }

    function renderModal(taskData) {
        taskTitle.innerText = taskData.title;
        taskStatus.innerText = taskData.status;
        taskDescription.innerText = taskData.description;
        taskCategory.innerText = taskData.category;
        taskDeadline.innerText = taskData.deadline;

        positionModalAtCenter(modal);
        modal.style.display = 'flex';
    }

    function closeTaskModal() {
        modal.style.display = 'none';
    }

    function positionModalAtCenter(modal) {
        modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
        modal.style.left = `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    }

    // === Task Manipulation Functions ===
    function setInitialTaskSpacing() {
        tasks.forEach((task, index) => {
            task.style.top = `${index * dragZoneHeight + spaceBetweenTasks}px`;
        });
    }

    function initializeTaskDragging(task) {
        task.addEventListener('mousedown', (e) => startDragging(task, e));
    }

    function startDragging(task, e) {
        isDragging = true;
        let offsetY = e.clientY - task.offsetTop;

        // Add dragging class
        task.classList.add('dragging');

        // Create mousemove and mouseup event listeners for drag behavior
        function onMouseMove(e) {
            requestAnimationFrame(() => updateDraggedTaskPosition(task, e, offsetY));
        }

        function onMouseUp() {
            stopDragging(task, onMouseMove, onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function updateDraggedTaskPosition(task, e, offsetY) {
        let newTop = Math.max(0, Math.min(e.clientY - offsetY, taskContainer.offsetHeight - taskHeight));
        task.style.top = `${newTop}px`;

        placeholderTop = newTop;

        tasks.forEach(otherTask => {
            if (otherTask !== task) {
                let otherTaskTop = otherTask.offsetTop;
                let otherTaskBottom = otherTaskTop + otherTask.offsetHeight;

                if (newTop + taskHeight > otherTaskBottom) {
                    placeholderTop = otherTaskBottom + spaceBetweenTasks / 2;
                } else if (newTop < otherTaskTop) {
                    placeholderTop = otherTaskTop - spaceBetweenTasks / 2;
                }
            }
        });
    }

    function stopDragging(task, onMouseMove, onMouseUp) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Remove dragging class
        task.classList.remove('dragging');
        task.style.top = `${placeholderTop}px`;
        isDragging = false;

        const taskPositions = tasks.map(t => ({ task: t, top: t.offsetTop }))
            .sort((a, b) => a.top - b.top);

        taskPositions.forEach((item, index) => {
            item.task.style.top = `${index * dragZoneHeight + spaceBetweenTasks}px`;
        });
    }

    function setupTaskClickHandler(task) {
        let wasDragging = false;

        task.addEventListener('mousedown', () => wasDragging = false);
        task.addEventListener('mousemove', () => wasDragging = true);

        task.addEventListener('click', () => {
            if (!wasDragging) openTaskModal(task);
            wasDragging = false;
        });
    }

    // === Initialize Application ===
    document.addEventListener('DOMContentLoaded', () => {
        initialize();
    });
})();
