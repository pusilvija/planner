export function initializeTaskDragging(task, manager) {
    task.addEventListener('mousedown', (e) => startDragging(task, e, manager));
}

function startDragging(task, e, manager) {
    manager.isDragging = true;
    let offsetY = e.clientY - task.offsetTop;
    task.classList.add('dragging');

    const onMouseMove = (e) => {
        requestAnimationFrame(() => updateDraggedTaskPosition(task, e, offsetY, manager));
    };

    const onMouseUp = () => {
        stopDragging(task, onMouseMove, onMouseUp, manager);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function updateDraggedTaskPosition(task, e, offsetY, manager) {
    let newTop = Math.max(0, Math.min(e.clientY - offsetY, manager.taskContainer.offsetHeight - task.offsetHeight));
    task.style.top = `${newTop}px`;
}

function stopDragging(task, onMouseMove, onMouseUp, manager) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    task.classList.remove('dragging');
    manager.isDragging = false;
    manager.reorderTasks();
}
