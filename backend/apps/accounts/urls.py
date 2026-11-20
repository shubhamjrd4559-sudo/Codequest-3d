from django.urls import path
from apps.accounts.views import LoginView, LogoutView, MeView, RefreshView, RegistrationView

app_name = "accounts_api"

urlpatterns = [
    path("register/", RegistrationView.as_view(), name="register"),
    path("token/", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", RefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
