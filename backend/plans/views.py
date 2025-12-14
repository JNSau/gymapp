from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession
from .serializers import TrainingPlanSerializer, WorkoutSessionSerializer

# --- 1. KATALOG PUBLICZNY (Explore Plans) ---
class PublicPlanListView(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Zwracamy tylko plany, które NIE mają właściciela (są systemowe)
        return TrainingPlan.objects.filter(user__isnull=True)

# --- 2. MOJE PLANY (My Workouts) ---
class UserPlanListView(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Zwracamy plany przypisane do aktualnego użytkownika
        return TrainingPlan.objects.filter(user=self.request.user)

# --- 3. SZCZEGÓŁY PLANU ---
class TrainingPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    # RetrieveUpdateDestroy pozwala też edytować i usuwać plan (ważne dla "My Workouts")
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- 4. LOGIKA KOPIOWANIA (Deep Copy) ---
class CopyPlanView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        # Pobieramy oryginał (np. plan systemowy)
        original_plan = get_object_or_404(TrainingPlan, pk=pk)

        # A. Tworzymy kopię Planu dla Usera
        new_plan = TrainingPlan.objects.create(
            user=request.user,
            name=f"{original_plan.name} (My Copy)",
            description=original_plan.description,
            level=original_plan.level
        )

        # B. Kopiujemy Dni
        for original_day in original_plan.days.all():
            new_day = TrainingDay.objects.create(
                plan=new_plan,
                day_number=original_day.day_number
            )

            # C. Kopiujemy Ćwiczenia wewnątrz dnia
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