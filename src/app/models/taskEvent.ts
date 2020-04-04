export class TaskEvent {
    id: number;
    taskId: number;
    eventType: {
        id: number;
        description: string;
    };
    eventUser: {
        id: number;
        name: string;
        email: string;
        orgId: number;
        roles: [
            {
                id: number;
                roleName: string;
            }
        ]
    };
    event_date: string;
    comment: string;

    filename: string;
    fileExtension: string;
    filetype: string;
    filePath: string;

    assignedTo: {
        id: number;
        name: string;
        email: string;
        orgId: number;
        roles: [
            {
                id: number;
                roleName: string;
            }
        ]
    };
    assignedBy: {
        id: number;
        name: string;
        email: string;
        orgId: number;
        roles: [
            {
                id: number;
                roleName: string;
            }
        ]
    };
}