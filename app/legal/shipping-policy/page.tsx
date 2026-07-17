import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy | Beauty Dokan BD',
  description:
    'Read the Beauty Dokan BD shipping policy, including delivery areas, estimated times, shipping charges, and order tracking.',
  alternates: { canonical: '/legal/shipping-policy' },
};

export default function ShippingPolicyPage() {
  return (
    <LegalLayout
      title="Shipping Policy"
      description="We deliver all over Bangladesh. Learn about our shipping times, charges, and delivery process."
      lastUpdated="July 17, 2026"
      sections={[
        {
          heading: 'Delivery Areas',
          paragraphs: [
            'Beauty Dokan BD delivers to all districts across Bangladesh. Whether you are in Dhaka or any other part of the country, we will get your order to you.',
          ],
        },
        {
          heading: 'Estimated Delivery Times',
          paragraphs: [
            'Delivery times depend on your location:',
          ],
          list: [
            'Inside Dhaka: 1–2 business days.',
            'Outside Dhaka: 2–5 business days.',
            'Business days exclude Fridays, Saturdays, and public holidays.',
            'Orders placed after 5:00 PM will be processed the next business day.',
          ],
        },
        {
          heading: 'Shipping Charges',
          paragraphs: [
            'Shipping charges are calculated based on your delivery location and are displayed at checkout before you confirm your order. Standard rates are:',
          ],
          list: [
            'Inside Dhaka: 60 BDT.',
            'Outside Dhaka: 120 BDT.',
            'Free shipping may be offered during promotional periods or for orders above a specified amount.',
          ],
        },
        {
          heading: 'Order Processing',
          paragraphs: [
            'Orders are processed in the order they are received. The typical processing flow is:',
          ],
          list: [
            'Order confirmation is sent immediately after placement.',
            'For bKash and Nagad payments, the order is processed after payment verification (usually within 1–2 hours).',
            'For Cash on Delivery, the order is confirmed via a phone call before dispatch.',
            'Once dispatched, you will receive a tracking number via SMS.',
          ],
        },
        {
          heading: 'Delivery & Handover',
          paragraphs: [
            'Our delivery partner will contact you at the phone number provided during checkout before arriving. Please ensure:',
          ],
          list: [
            'Someone is available at the delivery address to receive the package.',
            'You inspect the product before accepting delivery for COD orders.',
            'The correct amount of cash is ready for COD payments.',
          ],
        },
        {
          heading: 'Delayed or Lost Shipments',
          paragraphs: [
            'If your order has not arrived within the estimated timeframe, please contact us. We will coordinate with our courier partner to locate the shipment. If a package is confirmed lost, we will resend the order or issue a full refund.',
          ],
        },
        {
          heading: 'Failed Delivery',
          paragraphs: [
            'If a delivery attempt is unsuccessful due to the recipient being unavailable or an incorrect address, the courier will attempt delivery again. After three failed attempts, the order will be returned to us. In such cases, re-shipping charges will apply.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For shipping related inquiries, please reach out to us:',
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
