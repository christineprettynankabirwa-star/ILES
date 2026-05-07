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
            # We fetch the current state from the database 
            # to compare it with the incoming 'instance' state.
            old_instance = WeeklyLog.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except WeeklyLog.DoesNotExist:
            instance._old_status = None
    else:
        # If it's a brand new log, there is no old status.
        instance._old_status = None

@receiver(post_save, sender=WeeklyLog)
def create_status_history(sender, instance, created, **kwargs):
    """
    Fulfills: 'Track status history' and 'Audit trail logging'.
    Saves a record to LogStatusHistory whenever the status changes.
    """
    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    # 1. Logic: Only create a history record if the status has actually changed
    if old_status != new_status:
        
       #status change feedback is either the supervisor's comments or a default message
        feedback = getattr(instance, 'supervisor_comments', None)
        if not feedback:
            feedback = f"Status transitioned from {old_status or 'New'} to {new_status}."

        LogStatusHistory.objects.create(
            weekly_log=instance,
            from_status=old_status if old_status else "initial",
            to_status=new_status,
            comments=feedback,
            
           # value for changed_by is set to the user who made the change, which should be attached to the instance before saving
            changed_by=getattr(instance, '_changed_by', None)
        )