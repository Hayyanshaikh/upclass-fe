import { LuCheck } from "react-icons/lu";
import Logo from "@/components/shared/Logo";

const benefits = [
  "Attendance, fees and results in one place",
  "Notices and timetable always up to date",
  "Secure access for every role",
];

export default function LoginBranding() {
  return (
    <section
      className="flex flex-col bg-primary px-6 py-8 text-white sm:px-12 lg:py-12"
      aria-label="School portal"
    >
      <Logo size="md" />

      <div className="my-12 lg:my-auto lg:py-16">
        <h1 className="max-w-[490px] text-[32px] leading-[1.15] font-extrabold tracking-[-0.025em] sm:text-[40px]">
          One portal for
          <br className="hidden sm:block" /> students, teachers and parents.
        </h1>
        <ul className="mt-6 space-y-4 text-sm font-semibold sm:text-[15px]">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-light">
              <LuCheck
                className="mt-0.5 shrink-0 text-secondary"
                size={20}
                aria-hidden="true"
              />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-white/60">© 2026 UPCLASS</p>
    </section>
  );
}
