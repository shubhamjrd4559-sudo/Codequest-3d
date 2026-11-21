from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import StudentProfile, User


class StudentProfileSerializer(serializers.ModelSerializer):
    current_level = serializers.IntegerField(source="level", read_only=True)

    class Meta:
        model = StudentProfile
        fields = (
            "display_name",
            "avatar_url",
            "total_xp",
            "level",
            "current_level",
            "current_streak",
            "longest_streak",
            "last_activity_date",
        )
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    student_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "student_profile", "date_joined")
        read_only_fields = fields

    def get_student_profile(self, user):
        try:
            profile = user.student_profile
        except StudentProfile.DoesNotExist:
            return None
        return StudentProfileSerializer(profile).data


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False, style={"input_type": "password"})
    password_confirm = serializers.CharField(write_only=True, trim_whitespace=False, style={"input_type": "password"})
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    display_name = serializers.CharField(max_length=80, required=False, allow_blank=True)

    def validate_email(self, value):
        normalized = User.objects.normalize_email(value).lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        display_name = validated_data.pop("display_name", "")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, role=User.Role.STUDENT, **validated_data)
        StudentProfile.objects.create(user=user, display_name=display_name)
        return user


class TokenObtainPairWithRoleSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

