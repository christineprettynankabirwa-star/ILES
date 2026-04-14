from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InternshipPlacement, WeeklyLog, Evaluation, EvaluationCriteria 

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


#-----CustomUserAdmin------
class CustomUserAdmin(admin.ModelAdmin):
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_superuser")
    list_display = ("username", "email", "role", "is_staff", "is_superuser")
admin.site.register(CustomUser, CustomUserAdmin)

#-----InternshipPlacementAdmin------
class InternshipPlacementAdmin(admin.ModelAdmin):
    search_fields = ("company_name",)

admin.site.register(InternshipPlacement)


admin.site.register(WeeklyLog)

#-----EvaluationCriteria------
#-----Criteria Admin------
class EvaluationCriteriaAdmin(admin.ModelAdmin):
    list_display = ("title", "max_score")
    search_fields = ("title",)


admin.site.register(EvaluationCriteria, EvaluationCriteriaAdmin)

#-----Evaluation------
#-----Evaluation Admin(FIXED)------
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ("student", "placement", "criteria", "score", "date_evaluated")
    list_filter = ("placement", "criteria")
    search_fields = ("student__username",)

    autocomplete_fields = ("student", "placement", "criteria")

admin.site.register(Evaluation,EvaluationAdmin)