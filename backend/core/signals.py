from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import WeeklyLog, LogStatusHistory

@receiver(pre_save, sender=WeeklyLog)
def capture_old_status(sender, instance, **kwargs):
    """
    Captures the status before the model is saved to determine 
    if a transition occurred.
    """
    if instance.pk:
        try:
            old_instance = WeeklyLog.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except WeeklyLog.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=WeeklyLog)
def create_status_history(sender, instance, created, **kwargs):
    """
    Fulfills: 'Track status history'.
    Saves a record to LogStatusHistory whenever the status changes.
    """
    old_status = getattr(instance, '_old_status', None)
    
    # We only want to log if the status actually changed or if it's a new submission
    if old_status != instance.status:
        LogStatusHistory.objects.create(
            weekly_log=instance,
            from_status=old_status if old_status else "N/A",
            to_status=instance.status,
            # If you add a supervisor_comments field to WeeklyLog, 
            # you can map it here.
            comments=f"Status changed from {old_status} to {instance.status}"
        )