from django.urls import path
from django.contrib import admin

from . import views

urlpatterns = [
    # path("", views.taskFormView, name='task_url'),
    path("", views.home, name="home"),
    path("add/", views.add_task, name='add_task'),
    path("tasks/delete/<int:task_id>/", views.delete_task, name="delete_task"),
    path('task/<int:task_id>/', views.task_details, name='task_details'),
    path('update/<int:task_id>/', views.update_task, name='update_task'),
]
