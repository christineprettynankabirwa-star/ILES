from django.contrib import admin
from .models import InternshipPlacement

@admin.register(InternshipPlacement)
class InternshipPlacementAdmin(admin.ModelAdmin):

    #diaplay comuns in  a list view
    list_display = ('students', 'organization_name', 'start_date', 'is_active')

    #Adds a search bar
    search_fields = ('students__username', 'organization_name') 

    # Adds a filter sidebar
    list_filter = ('is_active', 'organization_name')
