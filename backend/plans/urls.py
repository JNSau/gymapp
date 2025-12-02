from django.urls import path
from .views import TrainingPlanList, TrainingPlanDetail

urlpatterns = [
    path("", TrainingPlanList.as_view(), name="plan_list"),
    path("<int:pk>/", TrainingPlanDetail.as_view(), name="plan_detail"),
]
