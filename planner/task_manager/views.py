from django.shortcuts import render
from .models import Status, Category, Task, Deadline


# Example of an index view
def index(request):
    context = {
               'tasks': Task.objects.all(),
               }
    return render(request, 'index.html', context)
