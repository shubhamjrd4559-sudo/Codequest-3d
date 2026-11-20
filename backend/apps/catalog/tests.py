from rest_framework import status
from rest_framework.test import APITestCase

from apps.catalog.models import Lesson, Topic


class PublicCatalogApiTests(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Arrays", slug="arrays", summary="Array basics", is_published=True)
        self.lesson = Lesson.objects.create(
            topic=self.topic,
            title="Array introduction",
            slug="introduction",
            explanation="An array stores ordered values.",
            is_published=True,
        )
        self.unpublished = Topic.objects.create(title="Draft", slug="draft", summary="Not public", is_published=False)

    def test_topics_and_lessons_are_public_and_published_only(self):
        topics_response = self.client.get("/api/v1/topics/")
        lessons_response = self.client.get("/api/v1/lessons/", {"topic": self.topic.slug})

        self.assertEqual(topics_response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in topics_response.data["results"]], ["arrays"])
        self.assertEqual(lessons_response.status_code, status.HTTP_200_OK)
        self.assertEqual(lessons_response.data["results"][0]["id"], self.lesson.id)

    def test_unpublished_topic_and_lesson_are_not_returned(self):
        Lesson.objects.create(
            topic=self.unpublished,
            title="Draft lesson",
            slug="draft-lesson",
            explanation="Hidden until published.",
            is_published=True,
        )
        response = self.client.get("/api/v1/lessons/", {"topic": self.unpublished.slug})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], [])
