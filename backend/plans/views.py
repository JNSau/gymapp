from rest_framework import generics, permissions
from .models import TrainingPlan, WorkoutSession
from .serializers import TrainingPlanSerializer, WorkoutSessionSerializer

# --- WIDOKI PLANÓW ---

class TrainingPlanList(generics.ListAPIView):
    # ZMIANA: Teraz zwracamy wszystkie plany, bez filtrowania po levelu
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

class TrainingPlanDetail(generics.RetrieveAPIView):
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer
    permission_classes = [permissions.IsAuthenticated]


# --- WIDOK: HISTORIA TRENINGÓW ---

class WorkoutHistoryView(generics.ListCreateAPIView):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [permissions.IsAuthenticated] # Tylko dla zalogowanych

    def get_queryset(self):
        # Zwracamy historię TYLKO tego użytkownika, sortując od najnowszych
        return WorkoutSession.objects.filter(user=self.request.user).order_by('-start_time')

    def perform_create(self, serializer):
        # Automatycznie przypisz użytkownika, który wysyła zapytanie
        serializer.save(user=self.request.user)