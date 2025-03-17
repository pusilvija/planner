from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Task
import json
from datetime import datetime

from .models import Task, Status, Category, Deadline


def get_or_create_status(status_name):
    # Retrieve or create a status object by name
    status, created = Status.objects.get_or_create(name=status_name)
    return status


def get_or_create_category(category_name):
    # Retrieve or create a category object by name
    category, created = Category.objects.get_or_create(name=category_name)
    return category


def get_or_create_deadline(due_date):
    if isinstance(due_date, str):  # Ensure due_date is a proper date object
        try:
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        except ValueError:
            return None  # Return None if the date format is invalid

    deadline, created = Deadline.objects.get_or_create(due_date=due_date)
    return deadline


def index(request):
    if request.method == "POST":
        # data = json.loads(request.body)  # Ensure JSON data is correctly received
        # print(">>>>>>>>>>>>>> Received Data:", data)  # Debugging line
        # Collect task data from the request
        name = request.POST.get("task_name")
        description = request.POST.get("task_description", "")
        status_inp = request.POST.get("task_status", "Not Started")
        category_inp = request.POST.get("task_category", "General")
        deadline_inp = request.POST.get("task_deadline")

        # Use helper methods to get or create related objects
        status = get_or_create_status(status_inp)
        category = get_or_create_category(category_inp)
        deadline = get_or_create_deadline(deadline_inp)

        print("NAME:", name)
        # Check if task_name is provided
        if not name:
            return JsonResponse({'error': 'Task name is required'}, status=400)

        # Create a new Task object and save it to the database
        task = Task.objects.create(
            name=name,
            description=description,
            status=status,
            category=category,
            deadline=deadline
        )

        # Return a JSON response (or redirect to another page, if desired)

        return redirect('index')
    #     return JsonResponse({
    #         'task_id': task.id,
    #         'name': task.name,
    #         'description': task.description,
    #         'status': task.status.name,  # Convert ForeignKey to string
    #         'category': task.category.name,  # Convert ForeignKey to string
    #         'deadline': task.deadline.due_date.strftime('%Y-%m-%d') if task.deadline and task.deadline.due_date else None
    #         # Format date properly
    #     })
    # # If not a POST request, just render the index page
    context = {
        'tasks': Task.objects.all(),
    }
    return render(request, 'index.html', context)