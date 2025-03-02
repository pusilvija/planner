from django.contrib import admin

from .models import Status, Category, Task, Deadline

admin.site.register(Status)
admin.site.register(Category)
admin.site.register(Task)
admin.site.register(Deadline)
