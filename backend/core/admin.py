from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, InternshipPlacement 


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


class InternshipPlacementAdmin(admin.ModelAdmin):
    search_fields = ['student__username', 'organization_name', 'academic_supervisor__username']

    #organise with fieldsets
    fieldsets = (   
        ("Student and university",
          {"fields": ("student", 
                      "registration_number",
                      "course",
                       "academic_supervisor"),
          'description': 'Select required information.',}),

        ("Workplace Details", {
            "fields": ("organization_name", "workplace_supervisor_name", "workplace_supervisor_email")}),

        ("Placement Duration and status", {
            "fields": ("start_date", "end_date", "is_active")}),
        
    )


admin.site.register(InternshipPlacement, InternshipPlacementAdmin)