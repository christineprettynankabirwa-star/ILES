from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Issue, CustomUser, InternshipPlacement, WeeklyLog, EvaluationCriteria, Evaluation

admin.site.register(Issue)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_superuser")
    
    # Keeping your custom role fields in the edit page
    fieldsets = UserAdmin.fieldsets + (
        ("Role Information", {"fields": ("role", "university_id")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Role Information", {"fields": ("role", "university_id")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)


class InternshipPlacementAdmin(admin.ModelAdmin):
    list_display = ("organization_name", "position", "location", "duration", "stipend",)
    search_fields = ['student__username', 'organization_name', 'academic_supervisor__username', 'position', 'location']
    list_filter = ("location",)
    fieldsets = (   
        ("Student and university", {
            "fields": ("student", "registration_number", "course", "academic_supervisor"),
            'description': 'Select required information.',
        }),
        ("Workplace Details", {
            "fields": ("organization_name", "workplace_supervisor_name", "workplace_supervisor_email")
        }),
        ("Placement Duration and status", {
            "fields": ("start_date", "end_date", "is_active", "position", "location", "duration", "stipend", "description",)
        }),
    )

admin.site.register(InternshipPlacement, InternshipPlacementAdmin)


class WeeklyLogAdmin(admin.ModelAdmin):
    list_display = ('placement', 'week_number', 'status', 'created_at')
    list_filter = ('status', 'week_number')
    search_fields = ('placement__student__username', 'activities')
admin.site.register(WeeklyLog, WeeklyLogAdmin)


class EvaluationCriteriaAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'max_score')
    search_fields = ('title',)
admin.site.register(EvaluationCriteria, EvaluationCriteriaAdmin)


class EvaluationAdmin(admin.ModelAdmin):
    # Removed 'date_evaluated' and 'placement' from filters/display if they cause errors
    # 'total_score' must be readonly because it is auto-calculated in models.py
    list_display = ('get_student', 'attendance_score', 'performance_score', 'initiative_score', 'total_score')
    search_fields = ('placement__student__username',)
    readonly_fields = ('total_score',) 

    @admin.display(description='Student')
    def get_student(self, obj):
        return obj.placement.student.username

admin.site.register(Evaluation, EvaluationAdmin)