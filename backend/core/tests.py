from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import date, timedelta
from rest_framework.test import APIClient
from rest_framework import status
from .models import (
    CustomUser, Department, InternshipPlacement,
    WeeklyLog, Evaluation, EvaluationCriteria,
)

def make_user(username, role='student', password='TestPass123!'):
    return CustomUser.objects.create_user(
        username=username, password=password, role=role
    )

def make_placement(student, acad_sup=None, work_sup=None, offset_days=0):
    start = date.today() + timedelta(days=offset_days)
    end = start + timedelta(days=90)
    return InternshipPlacement.objects.create(
        student=student,
        organization_name='Test Org',
        registration_number='REG001',
        position='Intern',
        location='Kampala',
        duration='3 months',
        course='BSc CS',
        start_date=start,
        end_date=end,
        academic_supervisor=acad_sup,
        workplace_supervisor=work_sup,
    )

class CustomUserModelTest(TestCase):
    def test_student_role_property(self):
        user = make_user('alice', role='student')
        self.assertTrue(user.is_student)
        self.assertFalse(user.is_workplace_supervisor)

    def test_work_supervisor_role_property(self):
        user = make_user('bob', role='work_supervisor')
        self.assertTrue(user.is_workplace_supervisor)

    def test_admin_role_property(self):
        user = make_user('carol', role='admin')
        self.assertTrue(user.is_admin_user)

class InternshipPlacementModelTest(TestCase):
    def setUp(self):
        self.student = make_user('dave', role='student')

    def test_valid_placement_saves(self):
        p = make_placement(self.student)
        self.assertIsNotNone(p.pk)

    def test_end_before_start_raises_error(self):
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            InternshipPlacement.objects.create(
                student=self.student,
                organization_name='Org',
                registration_number='REG002',
                position='Intern',
                location='Kampala',
                duration='3 months',
                course='BSc CS',
                start_date=date.today(),
                end_date=date.today() - timedelta(days=1),
            )

    def test_overlapping_placement_raises_error(self):
        from django.core.exceptions import ValidationError
        make_placement(self.student, offset_days=0)
        with self.assertRaises(ValidationError):
            make_placement(self.student, offset_days=10)  # overlaps

class WeeklyLogModelTest(TestCase):
    def setUp(self):
        self.student = make_user('eve', role='student')
        self.placement = make_placement(self.student)
        self.log = WeeklyLog.objects.create(
            placement=self.placement,
            student=self.student,
            week_number=1,
            week_start_date=date.today() - timedelta(days=3),
            activities='Did some work',
            challenges='None',
            status='draft',
        )

    def test_draft_to_submitted_allowed(self):
        self.log._changed_by = self.student
        self.log.status = 'submitted'
        self.log.save()
        self.assertEqual(self.log.status, 'submitted')

    def test_invalid_transition_raises_error(self):
        from django.core.exceptions import ValidationError
        self.log._changed_by = self.student
        self.log.status = 'approved' 
        with self.assertRaises(ValidationError):
            self.log.save()

    def test_approved_log_cannot_be_edited(self):
        from django.core.exceptions import ValidationError
        WeeklyLog.objects.filter(pk=self.log.pk).update(status='approved')
        self.log.refresh_from_db()
        self.log.activities = 'Changed!'
        with self.assertRaises(ValidationError):
            self.log.save()

class EvaluationModelTest(TestCase):
    def setUp(self):
        self.student = make_user('frank', role='student')
        self.acad_sup = make_user('grace', role='acad_supervisor')
        self.placement = make_placement(self.student, acad_sup=self.acad_sup)

    def test_weighted_score_computed_correctly(self):
        eval_ = Evaluation.objects.create(
            placement=self.placement,
            academic_supervisor=self.acad_sup,
            attendance_punctuality=80,
            technical_competence=70,
            quality_of_work=60,
        )
        self.assertAlmostEqual(eval_.total_weighted_score, 71.0)
    def test_grade_synced_to_placement(self):
        Evaluation.objects.create(
            placement=self.placement,
            academic_supervisor=self.acad_sup,
            attendance_punctuality=90,
            technical_competence=85,
            quality_of_work=80,
        )
        self.placement.refresh_from_db()
        self.assertEqual(self.placement.final_grade, 'A')

    def test_score_out_of_range_raises_error(self):
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            Evaluation.objects.create(
                placement=self.placement,
                academic_supervisor=self.acad_sup,
                attendance_punctuality=150,
                technical_competence=50,
                quality_of_work=50,
            )


class AuthAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_user_can_register(self):
        url = reverse('register')
        data = {
            'username': 'henry',
            'email': 'henry@test.com',
            'first_name': 'Henry',
            'last_name': 'Test',
            'role': 'student',
            'password': 'TestPass123!',
            'password2': 'TestPass123!',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_returns_tokens_and_role(self):
        make_user('ivy', role='student')
        url = reverse('token_obtain_pair')
        response = self.client.post(
            url, {'username': 'ivy', 'password': 'TestPass123!'}, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['role'], 'student')

class WeeklyLogAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = make_user('jake', role='student')
        self.placement = make_placement(self.student)
        self.client.force_authenticate(user=self.student)

    def test_student_can_create_draft_log(self):
        url = reverse('weeklylog-list')
        data = {
            'placement': self.placement.pk,
            'week_number': 1,
            'week_start_date': str(date.today() - timedelta(days=3)),
            'activities': 'Attended meetings',
            'challenges': 'None',
            'status': 'draft',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unauthenticated_user_cannot_access_logs(self):
        self.client.force_authenticate(user=None)
        url = reverse('weeklylog-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
from django.test import TestCase

