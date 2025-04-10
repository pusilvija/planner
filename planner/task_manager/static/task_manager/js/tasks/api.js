export function updateTaskOrder(taskId, newOrder) {
    const csrf = document.querySelector('meta[name="csrf-token"]').content;

    fetch(`/update-task-order/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        body: JSON.stringify({ new_order: newOrder }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.status !== 'success') {
            console.error('Error updating order:', data.message);
        }
    })
    .catch(err => console.error('Fetch error:', err));
}

export function editTaskName(taskId, newName) {
    const csrf = document.querySelector('meta[name="csrf-token"]').content;

    fetch(`/edit_task_name/${taskId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf,
        },
        body: JSON.stringify({ new_task_name: newName }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.status !== 'success') {
            console.error('Error updating title:', data.message);
        }
    })
    .catch(err => console.error('Fetch error:', err));
}
