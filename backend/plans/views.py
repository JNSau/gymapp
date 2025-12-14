from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession
# Pamiętaj o imporcie nowego serializera:
from .serializers import (
    TrainingPlanSerializer,
    WorkoutSessionSerializer,
    ExerciseInPlanUpdateSerializer
)

# --- 1. KATALOG PUBLICZNY ---
class PublicPlanListView(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrainingPlan.objects.filter(user__isnull=True)

# --- 2. MOJE PLANY ---
class UserPlanListView(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrainingPlan.objects.filter(user=self.request.user)

# --- 3. SZCZEGÓŁY PLANU ---
class TrainingPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- 4. EDYCJA POJEDYNCZEGO ĆWICZENIA (NOWOŚĆ) ---
class ExerciseInPlanUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExerciseInPlan.objects.all()
    serializer_class = ExerciseInPlanUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Zabezpieczenie: Pozwalamy edytować tylko ćwiczenia należące do planów zalogowanego usera
        return ExerciseInPlan.objects.filter(training_day__plan__user=self.request.user)

# --- 5. LOGIKA KOPIOWANIA ---
class CopyPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        original_plan = get_object_or_404(TrainingPlan, pk=pk)

        new_plan = TrainingPlan.objects.create(
            user=request.user,
            name=f"{original_plan.name} (My Copy)",
            description=original_plan.description,
            level=original_plan.level
        )

        for original_day in original_plan.days.all():
            new_day = TrainingDay.objects.create(
                plan=new_plan,
                day_number=original_day.day_number
            )

            for original_ex_in_plan in original_day.exercises.all():
                ExerciseInPlan.objects.create(
                    training_day=new_day,
                    exercise=original_ex_in_plan.exercise,
                    sets=original_ex_in_plan.sets,
                    reps=original_ex_in_plan.reps,
                    rest_time=original_ex_in_plan.rest_time
                )

        return Response(
            {"message": "Plan copied successfully!", "id": new_plan.id},
            status=status.HTTP_201_CREATED
        )

# --- HISTORIA TRENINGÓW ---
class WorkoutHistoryView(generics.ListCreateAPIView):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user).order_by('-start_time')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)