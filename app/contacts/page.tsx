import ContactContent from "@/Components/ContactContent";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Staycation Haven | Contact",
  description: "Get in touch with Staycation Haven. Contact us via phone, email, or visit our location in Quezon City.",
};

const ContactsPage = () => {
  return <ContactContent />
}

export default ContactsPage;