from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from exercises.models import Exercise
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession


User = get_user_model()




class BackendUnitTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='unit_tester', password='password123')

    def test_1_create_plan_model(self):

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

        exercise = Exercise.objects.create(
            name="Military Press",
            muscle_group="SHOULDERS",
            difficulty="MEDIUM",
            description="Overhead press"
        )

        self.assertEqual(exercise.name, "Military Press")
        self.assertEqual(exercise.muscle_group, "SHOULDERS")
        self.assertIsNotNone(exercise.pk)




class BackendIntegrationTests(APITestCase):
    def setUp(self):

        self.user = User.objects.create_user(username='integ_tester', password='password123')
        self.client.force_authenticate(user=self.user)


        self.exercise = Exercise.objects.create(
            name="Squat",
            muscle_group="LEGS",
            difficulty="HARD",
            description="Leg exercise"
        )


        self.original_plan = TrainingPlan.objects.create(
            user=None,
            name="Public Full Body",
            level="BEGINNER"
        )


        self.day = TrainingDay.objects.create(plan=self.original_plan, day_number=1)

    def test_3_copy_plan_api(self):

        url = f'/api/plans/{self.original_plan.id}/copy/'

        response = self.client.post(url)

        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertEqual(TrainingPlan.objects.count(), 2)

        my_copy = TrainingPlan.objects.filter(user=self.user).first()
        self.assertIsNotNone(my_copy)
        self.assertIn("(My Copy)", my_copy.name)

