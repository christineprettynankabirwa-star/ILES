from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InternshipPlacement, WeeklyLog  # 1. Added WeeklyLog here

# --- Custom User Admin ---
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    fieldsets = UserAdmin.fieldsets + (
        ("Role Information", {"fields": ("role", "university_id")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Role Information", {"fields": ("role", "university_id")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

# --- Internship Placement Admin ---
class InternshipPlacementAdmin(admin.ModelAdmin):
    search_fields = ['student__username', 'organization_name', 'academic_supervisor__username']
    fieldsets = (   
        ("Student and university", {
            "fields": ("student", "registration_number", "course", "academic_supervisor"),
            'description': 'Select required information.',
        }),
        ("Workplace Details", {
            "fields": ("organization_name", "workplace_supervisor_name", "workplace_supervisor_email")
        }),
        ("Placement Duration and status", {
            "fields": ("start_date", "end_date", "is_active")
        }),
    )

admin.site.register(InternshipPlacement, InternshipPlacementAdmin)

# --- Weekly Log Admin ---
#  to make WeeklyLog visible
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('placement', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    search_fields = ('placement__student__username', 'activities')

admin.site.register(WeeklyLog, WeeklyLogAdmin)