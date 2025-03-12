document.addEventListener('DOMContentLoaded', () => {
    const tasks = Array.from(document.querySelectorAll('.task'));
    const taskContainer = document.getElementById('task-container');
    const taskHeight = tasks[0].offsetHeight;
    const spaceBetweenTasks = 20;
    const dragZoneHeight = taskHeight + spaceBetweenTasks;
    const modal = document.getElementById('task-modal');
    const closeModal = document.getElementById('close-modal');
    const taskTitle = document.getElementById('task-title');
    const taskStatus = document.getElementById('task-status');
    const taskDescription = document.getElementById('task-description');
    const taskDeadline = document.getElementById('task-deadline');
    const taskCategory = document.getElementById('task-category');

    let placeholderTop = null;
    let isDragging = false;

    // Set initial spacing between tasks
    tasks.forEach((task, index) => {
        task.style.top = (index * dragZoneHeight) + spaceBetweenTasks + 'px';
    });

    // Function to initialize task dragging
    function initializeTaskDragging(task) {
        task.addEventListener('mousedown', (e) => {
            isDragging = true;

            const draggedTask = task;
            let offsetY = e.clientY - task.offsetTop;

            draggedTask.style.opacity = '0.3';
            draggedTask.style.position = 'absolute';
            draggedTask.style.zIndex = 10;
            draggedTask.style.left = '5%';

            let newTop = task.offsetTop + task.offsetHeight + spaceBetweenTasks / 2;

            function onMouseMove(e) {
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

            function onMouseUp() {
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

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Add a small delay before handling double-click
    tasks.forEach(task => {
        let clickTimer = null;

        task.addEventListener('click', (e) => {
            if (isDragging) {
                return; // Ignore click if it's a drag
            }

            if (clickTimer) {
                clearTimeout(clickTimer); // Clear previous single click timer
            }

            clickTimer = setTimeout(() => {
                // Handle single-click behavior (if needed)
            }, 300); // 300 ms delay for distinguishing between double-click and single-click
        });

        task.addEventListener('dblclick', (e) => {
            if (isDragging) {
                return; // Ignore double-click if it's a drag
            }

            const name = task.getAttribute("data-name");
            const description = task.getAttribute("data-description");
            const status = task.getAttribute("data-status");
            const category = task.getAttribute("data-category");
            const deadline = task.getAttribute("data-deadline");


            const taskId = task.getAttribute('data-task');
            // Update task details (you can replace this with actual dynamic content)
            taskTitle.innerText = name;
            taskStatus.innerText = status;
            taskDescription.innerText = description;
            taskCategory.innerText = category;
            taskDeadline.innerText = deadline;

            // Position the modal at the center of the screen
            const modalWidth = modal.offsetWidth;
            const modalHeight = modal.offsetHeight;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const modalTop = (windowHeight - modalHeight) / 2;
            const modalLeft = (windowWidth - modalWidth) / 2;

            modal.style.top = `${modalTop}px`;
            modal.style.left = `${modalLeft}px`;

            modal.style.display = 'flex';
        });
    });

    // Close the modal when clicking on the close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Initialize dragging on all tasks
    tasks.forEach(task => {
        initializeTaskDragging(task);
    });
});
