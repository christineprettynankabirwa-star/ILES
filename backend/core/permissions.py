
# Custom Role-based "Lock"
class IsStudentuser(permissions.BasePermission):
    """
    Allows access only to users with the 'student' role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'student'
        )