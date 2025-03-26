from django.shortcuts import render, redirect, get_object_or_404

from .forms import TaskForm
from .models import Task


def home(request):
    context = {
               'tasks': Task.objects.all(),
               }
    return render(request, 'home.html', context)


def add_task(request):
    if request.method == "POST":
        form = TaskForm(request.POST)

        # Check if all fields are empty
        if form.is_valid():
            # Check if all the fields are empty (i.e., no data provided)
            cleaned_data = form.cleaned_data
            if not cleaned_data['name'] and not cleaned_data['status'] and not cleaned_data['category'] and not cleaned_data['description']:
                return redirect('home')  # Redirect to the home page if all fields are empty

            # Save the form if any field is provided
            form.save()
            return redirect('home')  # Redirect to the home page after saving the task

    else:
        form = TaskForm()  # If it's a GET request, create an empty form

    return render(request, 'add_task.html', {'form': form})


def delete_task(request, task_id):
    task = Task.objects.get(pk=task_id)
    task.delete()
    # messages.success(request, 'Recipe deleted successfully.')
    return redirect('home')


def task_details(request, task_id):
    task = Task.objects.get(pk=task_id)  # Fetch the task by ID
    context = {'task': task}
    return render(request, 'task_details.html', context)


def update_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)

    if request.method == "POST":
        # Directly update the task using the form
        task.name = request.POST.get('name')
        task.status = request.POST.get('status')
        task.category = request.POST.get('category')
        task.description = request.POST.get('description')
        task.save()  # Save the updated task to the database
        return redirect('task_details', task_id=task.id)  # Redirect to task details page after update

    context = {'task': task}
    return render(request, 'task_details.html', context)
