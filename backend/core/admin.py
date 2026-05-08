from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Issue, CustomUser, InternshipPlacement, 
    WeeklyLog, EvaluationCriteria, Evaluation, LogStatusHistory
)

# --- 1. Basic Model Registration ---
admin.site.register(Issue)
admin.site.register(LogStatusHistory)
admin.site.register(EvaluationCriteria)

# --- 2. Fixed Custom User Admin ---
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_superuser")
    
    fieldsets = UserAdmin.fieldsets + (
        ("Role Information and Permissions", {"fields": ("role", "university_id")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Role Information", {"fields": ("role", "university_id")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

# --- 3. Internship Placement Admin ---
class InternshipPlacementAdmin(admin.ModelAdmin):
    # Added scoring fields for Week 9 & 10 visibility
    list_display = ("organization_name", "position", "location", "duration", "total_score", "final_grade")
    search_fields = ['student__username', 'organization_name', 'position']
    list_filter = ("location", "final_grade")
    readonly_fields = ("total_score", "final_grade") 
    
    fieldsets = (   
        ("Student and University", {
            "fields": ("student", "registration_number", "course", "academic_supervisor"),
            'description': 'Select required information.',
        }),
        ("Workplace Details", {
            "fields": ("organization_name", "workplace_supervisor_name", "workplace_supervisor_email")
        }),
        ("Placement Duration and Status", {
            "fields": ("start_date", "end_date", "is_active", "position", "location", "duration", "stipend", "description", "total_score", "final_grade")
        }),
    )

admin.site.register(InternshipPlacement, InternshipPlacementAdmin)

# --- 4. Weekly Log Admin ---
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('get_student_name', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    search_fields = ('student__username', 'activities')

    @admin.display(description='Student')
    def get_student_name(self, obj):
        return obj.student.username

admin.site.register(WeeklyLog, WeeklyLogAdmin)

# --- 5. Evaluation Admin ---
class EvaluationAdmin(admin.ModelAdmin):
    list_display = (
        'get_student', 
        'attendance_punctuality', 
        'technical_competence', 
        'quality_of_work', 
        'total_weighted_score', 
        'date_evaluated'
    )
    list_filter = ('date_evaluated',)
    search_fields = ('placement__student__username',)
    readonly_fields = ('total_weighted_score',)

    @admin.display(description='Student')
    def get_student(self, obj):
        return obj.placement.student.username

admin.site.register(Evaluation, EvaluationAdmin)