export type TimetableEntry = {
  id: string;
  time: string;
  subject: string;
  className: string;
  room: string;
  status: "Done" | "Ongoing" | "Next";
};

export type DashboardNotice = {
  id: string;
  title: string;
  category: string;
  date: string;
  body: string;
};
