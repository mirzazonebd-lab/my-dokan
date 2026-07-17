import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Beauty Dokan BD',
  description:
    'Read the Beauty Dokan BD Privacy Policy to understand how we collect, use, and protect your personal information when you shop with us.',
  alternates: { canonical: '/legal/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="Your privacy matters to us. Learn how Beauty Dokan BD collects, uses, and safeguards your personal information."
      lastUpdated="July 17, 2026"
      sections={[
        {
          heading: 'Introduction',
          paragraphs: [
            'Beauty Dokan BD (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is an online beauty and skincare store based in Bangladesh. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner.',
            'This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.',
          ],
        },
        {
          heading: 'Information We Collect',
          paragraphs: [
            'When you place an order or interact with our website, we may collect the following types of information:',
          ],
          list: [
            'Full name, phone number, and email address provided during checkout.',
            'Shipping address including city, district, and postal code.',
            'Order history and product preferences.',
            'Payment method used (Cash on Delivery, bKash, or Nagad) — we do not store full payment credentials.',
            'Communications you send us via Facebook, email, or phone.',
          ],
        },
        {
          heading: 'How We Use Your Information',
          paragraphs: [
            'The information we collect is used solely for the following purposes:',
          ],
          list: [
            'Processing and fulfilling your orders, including delivery across Bangladesh.',
            'Providing customer support and responding to your inquiries.',
            'Sending order confirmations, shipping updates, and delivery notifications.',
            'Improving our product selection, website experience, and service quality.',
            'Preventing fraudulent orders and protecting both customers and our business.',
          ],
        },
        {
          heading: 'Information Sharing',
          paragraphs: [
            'We do not sell, trade, or rent your personal information to third parties. Your data is only shared in the following limited circumstances:',
          ],
          list: [
            'With delivery partners (couriers) to ship your orders — only the name, phone number, and shipping address are shared.',
            'With payment providers (bKash, Nagad) to process your transaction securely.',
            'When required by law, court order, or government authority.',
          ],
        },
        {
          heading: 'Data Security',
          paragraphs: [
            'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
          ],
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'Our website may use cookies to enhance your browsing experience, remember your cart contents, and analyze website traffic. You can disable cookies in your browser settings, but some features of the website may not function properly.',
          ],
        },
        {
          heading: 'Your Rights',
          paragraphs: [
            'You have the right to:',
          ],
          list: [
            'Access the personal information we hold about you.',
            'Request correction of inaccurate information.',
            'Request deletion of your account and associated data.',
            'Opt out of promotional communications at any time.',
          ],
        },
        {
          heading: 'Children&apos;s Privacy',
          paragraphs: [
            'Our services are intended for individuals aged 18 and above. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal data, please contact us and we will promptly delete it.',
          ],
        },
        {
          heading: 'Changes to This Policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The &quot;Last Updated&quot; date at the top of this page indicates when the policy was last revised. We encourage you to review this page periodically.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'If you have any questions or concerns about this Privacy Policy or your personal data, please reach out to us:',
          ],
          list: [
            'Facebook: https://www.facebook.com/beautydokanbd',
            'Email: support@beautydokanbd.com',
          ],
        },
      ]}
    />
  );
}
