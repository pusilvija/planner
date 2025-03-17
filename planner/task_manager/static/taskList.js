document.addEventListener('DOMContentLoaded', () => {
    const tasks = Array.from(document.querySelectorAll('.task'));
    const taskContainer = document.getElementById('task-container');
    const modal = document.getElementById('task-modal');
    const closeModal = document.getElementById('close-modal');
    const taskTitle = document.getElementById('task-title');
    const taskStatus = document.getElementById('task-status');
    const taskDescription = document.getElementById('task-description');
    const taskDeadline = document.getElementById('task-deadline');
    const taskCategory = document.getElementById('task-category');

    const taskHeight = tasks[0].offsetHeight;
    const spaceBetweenTasks = 20;
    const dragZoneHeight = taskHeight + spaceBetweenTasks;

    let isDragging = false;
    let placeholderTop = null;

    setInitialTaskSpacing();
    tasks.forEach(task => {
        initializeTaskDragging(task);
        setupTaskClickHandler(task);
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');

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

        Object.assign(task.style, {
            opacity: '0.3',
            position: 'absolute',
            zIndex: 10,
            left: '5%'
        });

        function onMouseMove(e) {
            updateDraggedTaskPosition(task, e, offsetY);
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

        task.style.top = `${placeholderTop}px`;
        task.style.zIndex = 1;
        task.style.opacity = '1';
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

    function openTaskModal(task) {
        taskTitle.innerText = task.getAttribute("data-name");
        taskStatus.innerText = task.getAttribute("data-status");
        taskDescription.innerText = task.getAttribute("data-description");
        taskCategory.innerText = task.getAttribute("data-category");
        taskDeadline.innerText = task.getAttribute("data-deadline");

        positionModalAtCenter(modal);
        modal.style.display = 'flex';
    }

    function positionModalAtCenter(modal) {
        modal.style.top = `${(window.innerHeight - modal.offsetHeight) / 2}px`;
        modal.style.left = `${(window.innerWidth - modal.offsetWidth) / 2}px`;
    }
});
