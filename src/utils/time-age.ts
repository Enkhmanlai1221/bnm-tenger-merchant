// import "dayjs/locale/mn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);

dayjs.extend(updateLocale);

dayjs.updateLocale("mn", {
  relativeTime: {
    future: "%s дараа",
    past: "%s",
    s: "хэдхэн хором",
    m: "1 м",
    mm: "%d м",
    h: "1 ц",
    hh: "%d ц",
    d: "1 ө",
    dd: "%d ө",
    M: "1 с",
    MM: "%d с",
    y: "1 ж",
    yy: "%d ж",
  },
});

export const timeAgoText = (time = Date.now()) => dayjs().to(dayjs(time));

export const formatDate = (date: string | Date) =>
  date ? dayjs(date).format("YYYY-MM-DD") : "-- / -- / --";

export const formatDateTime = (
  date: string | Date,
  format = "YYYY-MM-DD HH:mm",
) => (date ? dayjs(date).format(format) : "-- / -- / --");

export const calculateNights = (startDate: string, endDate: string) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, "day");
};
