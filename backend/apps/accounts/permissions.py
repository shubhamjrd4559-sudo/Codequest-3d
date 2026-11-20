from rest_framework.permissions import BasePermission


class IsStudentRole(BasePermission):
    """Allow authenticated student accounts only."""

    message = "A student account is required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "student")


class IsAdminRole(BasePermission):
    """Allow authenticated application admins only."""

    message = "An admin account is required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")
