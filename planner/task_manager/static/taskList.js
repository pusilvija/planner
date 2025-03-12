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

    // Set initial spacing between tasks
    setInitialTaskSpacing(tasks);

    // Initialize dragging behavior for each task
    tasks.forEach(task => {
        initializeTaskDragging(task);
        setupTaskClickHandlers(task);
    });

    // Close modal when close button is clicked
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Function to set initial spacing between tasks
    function setInitialTaskSpacing(tasks) {
        tasks.forEach((task, index) => {
            task.style.top = (index * dragZoneHeight) + spaceBetweenTasks + 'px';
        });
    }

    // Function to initialize dragging behavior
    function initializeTaskDragging(task) {
        task.addEventListener('mousedown', (e) => {
            startDragging(task, e);
        });
    }

    // Function to handle task dragging start
    function startDragging(task, e) {
        isDragging = true;
        const draggedTask = task;
        let offsetY = e.clientY - task.offsetTop;

        draggedTask.style.opacity = '0.3';
        draggedTask.style.position = 'absolute';
        draggedTask.style.zIndex = 10;
        draggedTask.style.left = '5%';

        let newTop = task.offsetTop + task.offsetHeight + spaceBetweenTasks / 2;

        function onMouseMove(e) {
            updateDraggedTaskPosition(draggedTask, e, offsetY, newTop);
        }

        function onMouseUp() {
            stopDragging(draggedTask, onMouseMove, onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    // Function to update the dragged task's position
    function updateDraggedTaskPosition(draggedTask, e, offsetY, newTop) {
        newTop = e.clientY - offsetY;
        const containerHeight = taskContainer.offsetHeight;
        newTop = Math.max(0, Math.min(newTop, containerHeight - taskHeight));
        draggedTask.style.top = newTop + 'px';

        let placedInSlot = false;

        tasks.forEach(otherTask => {
            if (otherTask !== draggedTask) {
                const draggedTaskBottom = newTop + taskHeight;
                const otherTaskTop = otherTask.offsetTop;
                const otherTaskBottom = otherTaskTop + otherTask.offsetHeight;

                if (draggedTaskBottom > otherTaskBottom) {
                    placeholderTop = otherTaskBottom + spaceBetweenTasks / 2;
                    placedInSlot = true;
                } else if (newTop < otherTaskTop) {
                    placeholderTop = otherTaskTop - spaceBetweenTasks / 2;
                    placedInSlot = true;
                }
            }
        });

        if (!placedInSlot) {
            placeholderTop = newTop;
        }
    }

    // Function to stop dragging and rearrange tasks
    function stopDragging(draggedTask, onMouseMove, onMouseUp) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        draggedTask.style.top = placeholderTop + 'px';

        const taskPositions = tasks
            .map(taskElement => ({ task: taskElement, top: taskElement.offsetTop }))
            .sort((a, b) => a.top - b.top);

        taskPositions.forEach((item, index) => {
            item.task.style.top = (index * dragZoneHeight) + spaceBetweenTasks + 'px';
        });

        draggedTask.style.zIndex = 1;
        draggedTask.style.opacity = '1';
        isDragging = false;
    }

    // Function to setup task click and double-click behavior
    function setupTaskClickHandlers(task) {
        let clickTimer = null;

        task.addEventListener('click', (e) => {
            if (isDragging) return; // Ignore click if it's a drag

            if (clickTimer) {
                clearTimeout(clickTimer); // Clear previous single click timer
            }

            clickTimer = setTimeout(() => {
                // Handle single-click behavior (if needed)
            }, 300); // 300 ms delay for distinguishing between double-click and single-click
        });

        task.addEventListener('dblclick', (e) => {
            if (isDragging) return; // Ignore double-click if it's a drag
            openTaskModal(task);
        });
    }

    // Function to open the task modal and populate it with task data
    function openTaskModal(task) {
        const name = task.getAttribute("data-name");
        const description = task.getAttribute("data-description");
        const status = task.getAttribute("data-status");
        const category = task.getAttribute("data-category");
        const deadline = task.getAttribute("data-deadline");

        taskTitle.innerText = name;
        taskStatus.innerText = status;
        taskDescription.innerText = description;
        taskCategory.innerText = category;
        taskDeadline.innerText = deadline;

        // Center modal on the screen
        positionModalAtCenter(modal);

        modal.style.display = 'flex';
    }

    // Function to position modal at the center of the screen
    function positionModalAtCenter(modal) {
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const modalTop = (windowHeight - modalHeight) / 2;
        const modalLeft = (windowWidth - modalWidth) / 2;

        modal.style.top = `${modalTop}px`;
        modal.style.left = `${modalLeft}px`;
    }
});
