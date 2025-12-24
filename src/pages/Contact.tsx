import { Layout } from "@/components/layout/Layout";
import { ContactSection } from "@/components/home/ContactSection";

export default function Contact() {
  return (
    <Layout>
      <div className="pt-8">
        <ContactSection />
      </div>
    </Layout>
  );
}
