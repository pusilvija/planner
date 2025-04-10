from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import F

from .forms import TaskForm
from .models import Task
import json
from django.views.decorators.http import require_POST


def home(request):
    context = {
               'tasks': Task.objects.all().order_by('order'),
               }
    return render(request, 'home.html', context)


def add_task(request):
    if request.method == "POST":
        form = TaskForm(request.POST)

        if form.is_valid():
            # Check if all the fields are empty (i.e., no data provided)
            cleaned_data = form.cleaned_data
            if all(not value for value in cleaned_data.values()):
                return redirect('home')

            # Shift all existing tasks' order up by 1
            Task.objects.update(order=F('order') + 1)

            # Create the new task with order = 0
            new_task = form.save(commit=False)
            new_task.order = 0
            new_task.save()

            return redirect('home')  # Redirect to the home page after saving the task

    else:
        form = TaskForm()  # If it's a GET request, create an empty form

    return render(request, 'add_task.html', {'form': form})


def delete_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    task_order = task.order  # Save the order of the task being deleted
    task.delete()  # Delete the task

    # Reorder the remaining tasks by shifting their order down by 1
    tasks_to_update = Task.objects.filter(order__gt=task_order).order_by('order')

    for task in tasks_to_update:
        task.order -= 1
        task.save()

    return redirect('home')


def task_details(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    context = {'task': task}
    return render(request, 'task_details.html', context)


def update_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    if request.method == "POST":
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('task_details', task_id=task.id)
    else:
        form = TaskForm(instance=task)
    context = {'form': form, 'task': task}
    return render(request, 'task_details.html', context)


@require_POST
def edit_task_name(request, task_id):
    try:
        # Fetch the task by its ID
        task = get_object_or_404(Task, pk=task_id)

        # Parse the incoming JSON data from the request body
        data = json.loads(request.body.decode('utf-8'))

        # Extract the new title from the JSON data
        new_name = data.get('new_task_name')

        if not new_name:
            return JsonResponse({
                'status': 'error',
                'message': 'No new title provided. Please provide a valid title.'
            }, status=400)

        # Update the task name
        task.name = new_name
        task.save()

        # Return a JSON response indicating success
        return JsonResponse({
            'status': 'success',
            'message': 'Task name updated successfully'
        })

    except Task.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Task not found'
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)


@require_POST  # Ensure only POST requests are accepted
def update_task_order(request, task_id):
    try:
        # Parse the incoming JSON data from the request body
        data = json.loads(request.body.decode('utf-8'))

        # Extract the new order from the JSON data
        new_order = data.get('new_order')

        if new_order is None:
            return JsonResponse({
                'status': 'error',
                'message': 'No new order provided'
            }, status=400)

        # Fetch the task by its ID
        task = Task.objects.get(id=task_id)

        # Update the order (assuming there's an order field in the Task model)
        task.order = new_order
        task.save()

        # Return a JSON response indicating success
        return JsonResponse({
            'status': 'success',
            'message': 'Order updated successfully'
        })

    except Task.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Task not found'
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
