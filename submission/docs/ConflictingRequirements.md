### Ambiguous or Conflicting Requirements:

    1. Recognitions marked as Anonymous should be counted in Analytics?

    Yes, we would want data in numbers but not traceable to employees.
    One solution is we can store sender/recipient info in db, but mask it
    in payloads.

    if (recognition.visibility === 'ANONYMOUS') {
        recognition.sender = 'Anonymous';
    }

    2. Can HR view private recognitions?

    Technically, no. But HR may need to view private recognitions for auditing or
    compliance issues.
    A solution is we can create a HR_ADMIN role in future that has access to even private and
    can view sender/recipient of Anonymous recognitions too.
    But we need to have a notifications system for when HR_ADMIN accesses these kind of
    recognition. (however, that is far-fetched)

    3. Ideally, should HR a position or a team?

    As per access control, HR should be able to view, edit, delete all recognitions.
    then HR must be a role.
    But, there are various kinds of HR, like Talent Acquisition, Compliance, etc
    So, HR should ideally be a team consisting of all roles, right?
    This seems pretty confusing.
    Solution to this problem, I have added HR as a team with HR_Admin as a special role
    that can be only within HR team.
    This way, we can guarentee access on all recognitions only to HR Admin and other
    Employees in HR other than HR_Admin must not deal with recognition info.

    Similarly, we can scale it for Finance_Admin, Legal_Admin, etc.
