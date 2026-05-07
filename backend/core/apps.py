from django.apps import AppConfig


class CoreConfig(AppConfig):
    """ Configuration class for the core application """
    name = 'core'

    def ready(self):
        """
        Register Django signals to ensure the Supervisor Review Workflow 
        (status tracking) is active when the server starts.
        """
        import core.signals