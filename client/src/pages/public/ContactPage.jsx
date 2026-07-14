import {
    Clock3,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ContactForm from "../../components/contact/ContactForm";

const contactItems = [
  {
    icon: Mail,
    title: "Email",
    value: "support@jobportal.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+880 1700-000000",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Dhaka, Bangladesh",
  },
  {
    icon: Clock3,
    title: "Business Hours",
    value: "Sunday–Thursday, 9:00 AM–6:00 PM",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact Us"
        description="Send us a message about technical support, recruitment services, or general questions."
      />

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          {contactItems.map(({ icon: Icon, title, value }) => (
            <article
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {title}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {value}
                </p>
              </div>
            </article>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}