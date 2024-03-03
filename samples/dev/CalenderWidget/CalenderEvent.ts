export interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: string;
    description?: string;
    link?:string;
  }