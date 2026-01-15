from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from exercises.models import Exercise
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession

# Pobieramy Twój skonfigurowany model użytkownika
User = get_user_model()


# ==========================================
# CZĘŚĆ 1: TESTY JEDNOSTKOWE (UNIT TESTS)
# ==========================================

class BackendUnitTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='unit_tester', password='password123')

    def test_1_create_plan_model(self):
        """Test jednostkowy modelu Planu (Listing 5.1 w pracy)"""
        plan = TrainingPlan.objects.create(
            user=self.user,
            name="Push Pull Legs",
            description="Strength focus",
            level="INTERMEDIATE"
        )

        self.assertEqual(plan.name, "Push Pull Legs")
        self.assertEqual(plan.level, "INTERMEDIATE")
        self.assertEqual(plan.user, self.user)
        self.assertIsInstance(plan, TrainingPlan)

    def test_2_create_exercise_model(self):
        """Test jednostkowy modelu Ćwiczenia (Listing 5.2 w pracy)"""
        # Używamy pól z Twojego pliku exercises/models.py
        exercise = Exercise.objects.create(
            name="Military Press",
            muscle_group="SHOULDERS",
            difficulty="MEDIUM",
            description="Overhead press"
        )

        self.assertEqual(exercise.name, "Military Press")
        self.assertEqual(exercise.muscle_group, "SHOULDERS")
        self.assertIsNotNone(exercise.pk)


# ==========================================
# CZĘŚĆ 2: TESTY INTEGRACYJNE (INTEGRATION)
# ==========================================

class BackendIntegrationTests(APITestCase):
    def setUp(self):
        # 1. Tworzymy usera API
        self.user = User.objects.create_user(username='integ_tester', password='password123')
        self.client.force_authenticate(user=self.user)

        # 2. Tworzymy ćwiczenie (niezbędne do logów treningowych)
        self.exercise = Exercise.objects.create(
            name="Squat",
            muscle_group="LEGS",
            difficulty="HARD",
            description="Leg exercise"
        )

        # 3. Tworzymy Plan Publiczny
        self.original_plan = TrainingPlan.objects.create(
            user=None,
            name="Public Full Body",
            level="BEGINNER"
        )

        # 4. Dodajemy dzień
        self.day = TrainingDay.objects.create(plan=self.original_plan, day_number=1)

    def test_3_copy_plan_api(self):
        """Test endpointu kopiowania (Listing 5.5 w pracy)"""
        # Sprawdź czy URL jest poprawny (z prefiksem /api/)
        url = f'/api/plans/{self.original_plan.id}/copy/'

        response = self.client.post(url)

        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertEqual(TrainingPlan.objects.count(), 2)

        my_copy = TrainingPlan.objects.filter(user=self.user).first()
        self.assertIsNotNone(my_copy)
        self.assertIn("(My Copy)", my_copy.name)

