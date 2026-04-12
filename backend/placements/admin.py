from django.contrib import admin
from .models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):

    #Display columns in a list view
    list_display = ('name', 'contact_email', 'phone_number', 'industry')

#Enable\adds search functionality for name and industry fields
    search_fields = ('name', 'industry')     
    
#Adds a filter sidebar on the right 
list_filter = ('industry',)
