from django.urls import path
from django.contrib import admin

from . import views

urlpatterns = [
    # path("", views.taskFormView, name='task_url'),
    path("", views.base, name="base"),
    path("add/", views.add_task, name='add_task'),
    path("tasks/delete/<int:task_id>/", views.delete_task, name="delete_task"),
]
