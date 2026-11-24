import {DemoBookingData} from './demoContent';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function buildLocalDateParts(dateIso: string, timeSlot: string) {
  const [y, m, d] = dateIso.split('-').map(Number);
  const [hh, mm] = timeSlot.split(':').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  return {start, end};
}

function formatCalCompact(date: Date): string {
  return (
    `${date.getUTCFullYear()}` +
    `${pad2(date.getUTCMonth() + 1)}` +
    `${pad2(date.getUTCDate())}T` +
    `${pad2(date.getUTCHours())}` +
    `${pad2(date.getUTCMinutes())}00`
  );
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function generateIcsContent(booking: DemoBookingData): string {
  const {start, end} = buildLocalDateParts(booking.dateIso, booking.timeSlot);
  const nowStamp = formatCalCompact(new Date()) + 'Z';
  const dtStart = formatCalCompact(start);
  const dtEnd = formatCalCompact(end);

  const goalsText = booking.goals.length > 0 ? booking.goals.join(', ') : 'General observability';
  const description = [
    `Sightline 30-Minute Live Technical Walkthrough`,
    `Attendee: ${booking.fullName} (${booking.company})`,
    `Role: ${booking.role} | Stack: ${booking.framework}`,
    `Focus Areas: ${goalsText}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sightline//Demo Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:oiq-demo-${booking.dateIso}-${booking.timeSlot.replace(':', '')}@Sightline.dev`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART;TZID=${booking.timezone}:${dtStart}`,
    `DTEND;TZID=${booking.timezone}:${dtEnd}`,
    `SUMMARY:${escapeIcsText(`Sightline Live Demo — ${booking.company}`)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'LOCATION:Google Meet (link sent via email)',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function downloadIcsFile(booking: DemoBookingData): void {
  const content = generateIcsContent(booking);
  const blob = new Blob([content], {type: 'text/calendar;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Sightline-demo-${booking.dateIso}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildGoogleCalendarUrl(booking: DemoBookingData): string {
  const {start, end} = buildLocalDateParts(booking.dateIso, booking.timeSlot);
  const dates = `${formatCalCompact(start)}/${formatCalCompact(end)}`;
  const goalsText = booking.goals.length > 0 ? booking.goals.join(', ') : 'General observability';
  const details = [
    `30-minute live technical walkthrough with an Sightline engineer.`,
    `Company: ${booking.company} (${booking.framework})`,
    `Topics: ${goalsText}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Sightline Live Demo — ${booking.company}`,
    dates,
    ctz: booking.timezone,
    details,
    location: 'Online (Meeting link via email)',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function formatReadableDate(dateIso: string): string {
  if (!dateIso) return '';
  const [y, m, d] = dateIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
}
