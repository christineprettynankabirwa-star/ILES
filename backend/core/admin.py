from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

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

