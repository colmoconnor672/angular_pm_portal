import { TaskEvent } from './taskEvent';

export class Task {
  id: number;
  text: string;
  description: string;
  projectId: number;
  status: {
    id: number;
    description: string;
  };
  priority: {
    id: number;
    priority: string;
  };
  
  start_date: string;
	progress: number;
	duration: number;
  parent: number;
  
  taskEvents: [
    TaskEvent
  ];
}
