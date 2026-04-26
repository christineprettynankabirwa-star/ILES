from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InternshipPlacement, WeeklyLog, EvaluationCriteria,Evaluation

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
#-----CustomUserAdmin------
class CustomUserAdmin(admin.ModelAdmin):
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_superuser")
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
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
class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('placement', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    search_fields = ('placement__student__username', 'activities')
admin.site.register(WeeklyLog, WeeklyLogAdmin)
#-------EvaluationCriteria---------------
#-------Criteria Admin-------------------
class EvaluationCriteriaAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('title',)
admin.site.register(EvaluationCriteria, EvaluationCriteriaAdmin)
#--------Evaluation----------------
#--------Evaluation Admin(FIXED----------------
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('student', 'placement', 'criteria', 'score', 'date_evaluated')
    list_filter = ('placement', 'criteria')
    search_fields = ('student__username',)
admin.site.register(Evaluation, EvaluationAdmin)