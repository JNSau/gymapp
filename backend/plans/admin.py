from django.contrib import admin
from .models import TrainingPlan, TrainingDay, ExerciseInPlan

@admin.register(TrainingPlan)
class TrainingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'created_at')
    list_filter = ('level', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('pk',)

@admin.register(TrainingDay)
class TrainingDayAdmin(admin.ModelAdmin):
    list_display = ('plan', 'day_number')
    list_filter = ('plan',)
    search_fields = ('plan__name',)
    ordering = ('plan', 'day_number')

@admin.register(ExerciseInPlan)
class ExerciseInPlanAdmin(admin.ModelAdmin):
    list_display = ('training_day', 'exercise', 'sets', 'reps', 'rest_time')
    list_filter = ('training_day', 'exercise')
    search_fields = ('training_day__plan__name', 'exercise__name')
    ordering = ('training_day', 'exercise')
