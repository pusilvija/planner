from django.shortcuts import render, redirect

from .forms import TaskForm
from .models import Task


def base(request):
    context = {
               'tasks': Task.objects.all(),
               }
    return render(request, 'base.html', context)


def add_task(request):
    if request.method == "POST":
        form = TaskForm(request.POST)
        if form.is_valid():
            # Save the new task to the database
            form.save()
            # Redirect to the same page (or another URL like a task list or detail page)
            return redirect('base')  # or redirect to a different view like 'task_list'
    else:
        form = TaskForm()

    # Fetch all tasks to show on the page
    tasks = Task.objects.all()

    # Pass the form and tasks to the template
    context = {
        'form': form,
        'tasks': tasks
    }
    return render(request, 'add_task.html', context)


def delete_task(request, task_id):
    task = Task.objects.get(pk=task_id)
    task.delete()
    # messages.success(request, 'Recipe deleted successfully.')
    return redirect('base')

