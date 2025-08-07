## Access Control

    This model makes sense for access control

    | Action                       | EMPLOYEE | MANAGER | TEAMLEAD | HR |
    | ---                          | ---      | ---     | ---      |--- |
    | Send Recognitions            | Y        | Y       | Y        | Y |
    | View Own Recognitions        | Y        | Y       | Y        | Y |
    | View Team Recognitions       | N        | Y       | Y        | Y |
    | View All Recognitions        | N        | N       | N        | Y |
    | Edit/Delete Recognitions     | N        | Y       | N        | Y |
    | Edit/Delete Own Recognitions | Y        | Y       | Y        | Y |
    | Access Team Analytics        | N        | Y       | Y        | Y |

    HR should be able to view, edit and delete recognitions in case they are NSFW or not according to office policies
    HR should also be able to view Analytics for each team to evaluate performance.

    Only Managers and Team Leads should be able to view Team Recognitions.
    Only Managers and HR should be able to edit/delete other's recognitions.

    Everybody should be able to view/edit/delete own recognitions.
    Only HR should be able to view all recognitions (that includes other teams and all employees)

    1. We can add hardcoded checks using If else statements to block access. (not an ideal solution)
    2. Use Graphql authentication and pass JWT Tokens to authenticate each request.
    3. Add a permissions table enforcing a policy matrix and joining permissions table in each query to
    check access. (This sounds brilliant to me, but ofcourse there are Time Complexity constraints).
    CREATE TABLE permissions (
        role, -> (employee/manager/teamlead/hr)
        action, -> (view/edit/delete)
        allowed BOOLEAN -> (yes/no)
    );

## Visibility

    We have 3 types of visibilities

    enum Visibility {
    	PUBLIC -> Everyone can view recognition
    	PRIVATE -> Only sender and recipient can view recognition
    	ANONYMOUS -> Same as Private, but hides sender/recipient name for recognition
    }

    We can add some checks for Private and Anonymous visibility such as:

    if recognition.visibility === 'Private' {
        const access = (userId === recognition.senderId || userId === recognition.recipientId || userId === HR.id)
        if access : pass through else throw Error ('Access Denied');
    }

    We can avoid collecting senderId/recipientId for Anonymous but still add a check

    if recognition.visibility === 'Anonymous' && recognition.senderId != 'Anonymous' ||  recognition.recipient != 'Anonymous' {
        recognition.senderId = 'Anonymous';
        recognition.recipientId = 'Anonymous';
    }

    We can also add policies in PostgreSQL to restrict access and visibilities.
