export function initializeTaskDragging(task, container, manager) {
    task.addEventListener('mousedown', (e) => startDragging(task, e, container, manager));
}


function startDragging(task, e, container, manager) {
    manager.isDragging = false;

    // Initial mouse position
    const startX = e.clientX;
    const startY = e.clientY;

    // Offset between mouse and task
    const offsetX = e.clientX - task.left;
    const offsetY = e.clientY - task.top; 

    console.log('OffsetX:', offsetX, 'OffsetY:', offsetY); // Debugging offsets


    const onMouseMove = (e) => {
        // Measures how far mouse moved
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        

        // Only start dragging if the mouse moves beyond the threshold (e.g., 5px)
        if (!manager.isDragging && (deltaX > 5 || deltaY > 5)) {
            manager.isDragging = true;
            task.classList.add('dragging');
        }

        if (manager.isDragging) {
            const finalContainer = getContainerUnderMouse(e) 
            const current_container = finalContainer === container ? container : finalContainer;
            updateDraggedTaskPosition(task, e, offsetX, offsetY, current_container);
        }
    };

    const onMouseUp = (e) => {
        stopDragging(task, e, onMouseMove, onMouseUp, manager, container);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);


}


function updateDraggedTaskPosition(task, e, offsetX, offsetY, container) {
    requestAnimationFrame(() => {
        if (!container) {
            console.error('Container is null. Skipping position update.');
            return;
        }


        let new_top=  Math.max(0, Math.min(e.clientY - offsetY, container.offsetHeight - task.offsetHeight));
        let new_left = Math.max(0, Math.min(e.clientX - offsetX, container.offsetWidth - task.offsetWidth));

        task.style.left = `${new_left}px`;
        task.style.top = `${new_top}px`;

        console.log('left:', task.style.left )
        console.log('top:', task.style.top) 

        // Optional: Add visual container detection here if needed
    });
}



function stopDragging(task, e, onMouseMove, onMouseUp, manager, container) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    task.classList.remove('dragging');
    manager.isDragging = false;

    // Determine the final container
    const finalContainer = getContainerUnderMouse(e) 
    if (finalContainer != container) {
        finalContainer.appendChild(task); // Move the task to the new container

        manager.reorderTasks(finalContainer);    
        manager.reorderTasks(container);
    }
    else {
        manager.reorderTasks(finalContainer);  
        manager.reorderTasks(container);
    }

}


function getContainerUnderMouse(e) {
    const containers = document.querySelectorAll('.task-container');
    for (const container of containers) {
        const rect = container.getBoundingClientRect();
        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            return container; // Return the container under the mouse
        }
    }
    return null; // No container found under the mouse
}
