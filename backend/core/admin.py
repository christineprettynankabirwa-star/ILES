from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Department, InternshipPlacement, WeeklyLog,
    EvaluationCriteria, Evaluation, LogStatusHistory
)

admin.site.register(LogStatusHistory)
admin.site.register(EvaluationCriteria)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "department", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    list_filter = ("role", "department", "is_staff", "is_superuser")

    fieldsets = UserAdmin.fieldsets + (
        ("Role Information and Permissions", {
            "fields": ("role", "department", "student_number", "staff_number", "phone_number")
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Role Information", {
            "fields": ("role", "department", "student_number", "staff_number", "phone_number")
        }),
    )


admin.site.register(CustomUser, CustomUserAdmin)


class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = (
        "student", "organization_name", "position", "location",
        "academic_supervisor", "workplace_supervisor",
        "total_score", "final_grade", "is_active"
    )
    search_fields = [
        'student__username', 'organization_name', 'position',
        'academic_supervisor__username', 'workplace_supervisor__username'
    ]
    list_filter = ("location", "final_grade", "is_active")
    readonly_fields = ("total_score", "final_grade")

    fieldsets = (
        ("Student and University", {
            "fields": ("student", "registration_number", "course", "academic_supervisor"),
            'description': 'Select required information.',
        }),
        ("Workplace Details", {
            # FIX: workplace_supervisor is now a FK (was workplace_supervisor_name/_email)
            "fields": ("organization_name", "workplace_supervisor")
        }),
        ("Placement Duration and Status", {
            "fields": (
                "start_date", "end_date", "is_active", "position",
                "location", "duration", "stipend", "description",
                "total_score", "final_grade"
            )
        }),
    )


admin.site.register(InternshipPlacement, InternshipPlacementAdmin)


class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('get_student_name', 'get_organization', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    search_fields = ('placement__student__username', 'activities')

    @admin.display(description='Student')
    def get_student_name(self, obj):
        # FIX: student is now a property derived from placement
        return obj.placement.student.username

    @admin.display(description='Organization')
    def get_organization(self, obj):
        return obj.placement.organization_name


admin.site.register(WeeklyLog, WeeklyLogAdmin)


class EvaluationAdmin(admin.ModelAdmin):
    list_display = (
        'get_student',
        'academic_supervisor',
        'attendance_punctuality',
        'technical_competence',
        'quality_of_work',
        'total_weighted_score',
        'date_evaluated'
    )
    list_filter = ('date_evaluated',)
    search_fields = ('placement__student__username', 'academic_supervisor__username')
    readonly_fields = ('total_weighted_score',)

    @admin.display(description='Student')
    def get_student(self, obj):
        return obj.placement.student.username


admin.site.register(Evaluation, EvaluationAdmin)