from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import WeeklyLog, LogStatusHistory

@receiver(pre_save, sender=WeeklyLog)
def capture_old_status(sender, instance, **kwargs):
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
    old_status = getattr(instance, '_old_status', None)
    new_status = instance.status

    if old_status != new_status:
        LogStatusHistory.objects.create(
            log=instance,
            old_status=old_status if old_status else 'initial',
            new_status=new_status,
            changed_by=getattr(instance, '_changed_by', None),
        )
