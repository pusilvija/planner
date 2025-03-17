from django.db import models


class Status(models.Model):
    # Define the 'id' field, which is automatically handled by Django as an auto-incrementing primary key.
    name = models.CharField(max_length=100, unique=True)  # 'name' field for the status name
    description = models.TextField(blank=True, null=True)  # Optional 'description' field for additional details

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Deadline(models.Model):
    # task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='deadlines')  # foreign key to Task
    due_date = models.DateTimeField(null=True, blank=True)  # field for due date

    def __str__(self):
        return f"Deadline on {self.due_date}"


class Task(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    status = models.ForeignKey(Status, on_delete=models.CASCADE, related_name='tasks', default=1)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='tasks', blank=True, null=True)
    deadline = models.ForeignKey(Deadline, on_delete=models.CASCADE, related_name='tasks', blank=True, null=True)

    def __str__(self):
        return self.name
