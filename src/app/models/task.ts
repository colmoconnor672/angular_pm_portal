export class Task {
  id: number;
  text: string;
  description: string;
  projectId: number;
  status: {
    id: number;
    description: string;
  };
  start_date: string;
	progress: number;
	duration: number;
	parent: number;
}
