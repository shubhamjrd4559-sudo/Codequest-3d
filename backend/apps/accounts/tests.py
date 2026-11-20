from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from apps.accounts.models import User


class AuthenticationApiTests(APITestCase):
    def test_registration_creates_student_profile_without_role_escalation(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "email": "new.student@example.com",
                "password": "StrongPassword!2026",
                "password_confirm": "StrongPassword!2026",
                "first_name": "New",
                "display_name": "New Student",
                "role": "admin",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="new.student@example.com")
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertEqual(user.student_profile.display_name, "New Student")
        self.assertNotIn("password", response.data)

    def test_login_returns_jwt_pair_and_role_claim(self):
        User.objects.create_user(email="learner@example.com", password="StrongPassword!2026")

        response = self.client.post(
            "/api/v1/auth/token/",
            {"email": "learner@example.com", "password": "StrongPassword!2026"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(AccessToken(response.data["access"])["role"], "student")

    def test_refresh_rotates_tokens(self):
        user = User.objects.create_user(email="refresh@example.com", password="StrongPassword!2026")
        refresh = str(RefreshToken.for_user(user))

        response = self.client.post("/api/v1/auth/token/refresh/", {"refresh": refresh}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertNotEqual(response.data["refresh"], refresh)

    def test_logout_blacklists_refresh_token(self):
        user = User.objects.create_user(email="logout@example.com", password="StrongPassword!2026")
        refresh = RefreshToken.for_user(user)
        jti = refresh["jti"]
        access = AccessToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        response = self.client.post("/api/v1/auth/logout/", {"refresh": str(refresh)}, format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertTrue(BlacklistedToken.objects.filter(token__jti=jti).exists())

    def test_me_endpoint_rejects_unauthenticated_request(self):
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_current_user_and_profile(self):
        user = User.objects.create_user(email="me@example.com", password="StrongPassword!2026")
        self.client.force_authenticate(user)

        response = self.client.get("/api/v1/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], user.email)
        self.assertEqual(response.data["role"], "student")
        self.assertIsNone(response.data["student_profile"])
