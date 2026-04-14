from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InternshipPlacement, WeeklyLog, EvaluationCriteria, Evaluation  

# Register your models here.
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
admin.site.register(InternshipPlacement)
admin.site.register(WeeklyLog)
admin.site.register(EvaluationCriteria)
admin.site.register(Evaluation)
