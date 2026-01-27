from django.contrib import admin
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession, WorkoutLog



@admin.register(TrainingPlan)
class TrainingPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'user', 'created_at')
    list_filter = ('level', 'created_at')
    search_fields = ('name', 'description', 'user__username')
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



@admin.register(WorkoutSession)
class WorkoutSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'custom_name', 'start_time', 'duration_minutes')
    list_filter = ('start_time', 'user')
    search_fields = ('user__username', 'custom_name', 'notes')
    ordering = ('-start_time',)

@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ('session', 'exercise', 'set_number', 'weight_kg', 'reps_done')
    list_filter = ('exercise', 'session__user')
    search_fields = ('exercise__name', 'session__user__username')
    ordering = ('session', 'set_number')