import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Beauty Dokan BD',
  description:
    'Review the Terms & Conditions for shopping at Beauty Dokan BD, including order placement, payment, delivery, and user responsibilities.',
  alternates: { canonical: '/legal/terms-conditions' },
};

export default function TermsConditionsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      description="Please read these Terms & Conditions carefully before using our website or placing an order."
      lastUpdated="July 17, 2026"
      sections={[
        {
          heading: 'Introduction',
          paragraphs: [
            'These Terms & Conditions (&quot;Terms&quot;) govern your use of the Beauty Dokan BD website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these Terms.',
          ],
        },
        {
          heading: 'Account & User Responsibilities',
          paragraphs: [
            'When using our website and placing orders, you are responsible for the following:',
          ],
          list: [
            'Providing accurate and complete information during checkout, including your full name, phone number, email, and delivery address.',
            'Ensuring you are available to receive the delivery at the provided address.',
            'Keeping your account credentials secure if you create an account.',
            'Not using our website for any unlawful, fraudulent, or abusive purpose.',
          ],
        },
        {
          heading: 'Order Placement & Acceptance',
          paragraphs: [
            'All orders placed through our website are subject to acceptance and availability. We reserve the right to:',
          ],
          list: [
            'Accept or decline any order at our discretion.',
            'Cancel orders that appear fraudulent, suspicious, or placed in bad faith.',
            'Limit order quantities or refuse service to anyone for legitimate reasons.',
            'Modify or discontinue products at any time without prior notice.',
          ],
        },
        {
          heading: 'Pricing & Payments',
          paragraphs: [
            'All prices listed on our website are in Bangladeshi Taka (BDT) and are subject to change without notice. We accept the following payment methods:',
          ],
          list: [
            'Cash on Delivery (COD) — pay in cash when your order arrives.',
            'bKash — mobile financial service payment.',
            'Nagad — mobile financial service payment.',
          ],
        },
        {
          heading: 'Delivery',
          paragraphs: [
            'We deliver all over Bangladesh. Estimated delivery times are:',
          ],
          list: [
            'Inside Dhaka: 1–2 business days.',
            'Outside Dhaka: 2–5 business days.',
            'Delivery times are estimates and may vary due to weather, holidays, or courier conditions. We are not liable for delays beyond our control.',
          ],
        },
        {
          heading: 'Product Information',
          paragraphs: [
            'We make every effort to display product information, including descriptions, ingredients, and images, as accurately as possible. However, we do not warrant that all information is entirely error-free. Product colors may vary slightly due to screen settings and photography lighting.',
          ],
        },
        {
          heading: 'Returns & Refunds',
          paragraphs: [
            'Returns are accepted within 7 days of delivery only for damaged, defective, or incorrectly shipped products. Items must be unused and in their original packaging. For full details, please refer to our Return & Refund Policy.',
          ],
        },
        {
          heading: 'Intellectual Property',
          paragraphs: [
            'All content on this website, including text, images, logos, graphics, and design elements, is the property of Beauty Dokan BD or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'Beauty Dokan BD shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the product in question.',
          ],
        },
        {
          heading: 'Governing Law',
          paragraphs: [
            'These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.',
          ],
        },
        {
          heading: 'Changes to These Terms',
          paragraphs: [
            'We may update these Terms & Conditions at any time. The &quot;Last Updated&quot; date indicates when changes were last made. Continued use of our website after changes constitutes acceptance of the revised Terms.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'If you have any questions about these Terms & Conditions, please contact us:',
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
