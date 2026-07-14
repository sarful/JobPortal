import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Nusrat Jahan",
    role: "Frontend Developer",
    company: "Dhaka",
    quote:
      "The search tools made it easy to find relevant frontend roles. I could track every application without using separate spreadsheets.",
  },
  {
    name: "Farhan Ahmed",
    role: "HR Manager",
    company: "TechNova Solutions",
    quote:
      "The employer dashboard gives our recruitment team a simple way to publish jobs, review candidates, and update statuses.",
  },
  {
    name: "Samira Khan",
    role: "UI/UX Designer",
    company: "Chattogram",
    quote:
      "I liked having my profile, portfolio, resume, and applications together. The entire process felt organized and clear.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Testimonials
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            What our users say
          </h2>

          <p className="mt-4 text-slate-600">
            Candidates and employers use JobPortal to simplify their
            recruitment experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <Quote
                size={34}
                className="absolute right-6 top-6 text-blue-100"
              />

              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={17}
                    fill="currentColor"
                  />
                ))}
              </div>

              <blockquote className="mt-5 text-sm leading-7 text-slate-600">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-7 border-t border-slate-200 pt-5">
                <p className="font-bold text-slate-900">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {testimonial.role} · {testimonial.company}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}