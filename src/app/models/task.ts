import { TaskEvent } from './taskEvent';
import { TaskStatus } from './TaskStatus';
import { TaskPriority } from './TaskPriority';

export class Task {
  id: number;
  text: string;
  description: string;
  projectId: number;
  status: TaskStatus;
  priority: TaskPriority;
  
  start_date: string;
	progress: number;
	duration: number;
  parent: number;
  
  taskEvents: [
    TaskEvent
  ];
}
