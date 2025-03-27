from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404

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

        # Check if all fields are empty
        if form.is_valid():
            # Check if all the fields are empty (i.e., no data provided)
            cleaned_data = form.cleaned_data
            if all(not value for value in cleaned_data.values()):
                return redirect('home')

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