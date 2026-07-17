import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Beauty Dokan BD',
  description:
    'Learn about Beauty Dokan BD return and refund policy, including eligibility, timeframes, and the process for damaged or defective products.',
  alternates: { canonical: '/legal/return-refund-policy' },
};

export default function ReturnRefundPolicyPage() {
  return (
    <LegalLayout
      title="Return & Refund Policy"
      description="We want you to be happy with your purchase. Read our return and refund policy to understand your options."
      lastUpdated="July 17, 2026"
      sections={[
        {
          heading: 'Return Window',
          paragraphs: [
            'We accept returns within 7 days of delivery. Returns are only accepted for products that are damaged, defective, or incorrectly shipped. We do not accept returns for change of mind or personal preference reasons.',
          ],
        },
        {
          heading: 'Eligibility Criteria',
          paragraphs: [
            'To be eligible for a return, the following conditions must be met:',
          ],
          list: [
            'The product must be damaged, defective, or different from what was ordered.',
            'The product must remain unused and in its original packaging.',
            'All original accessories, labels, and seals must be intact.',
            'You must contact us within 7 days of receiving the product.',
            'Proof of purchase (order number or invoice) must be provided.',
          ],
        },
        {
          heading: 'Non-Returnable Items',
          paragraphs: [
            'For hygiene and safety reasons, the following items cannot be returned:',
          ],
          list: [
            'Products that have been opened, used, or partially consumed.',
            'Products without original packaging or with damaged packaging caused by the customer.',
            'Items purchased on sale or with discount codes (unless defective).',
            'Products damaged due to misuse, improper storage, or negligence.',
          ],
        },
        {
          heading: 'How to Initiate a Return',
          paragraphs: [
            'To request a return, follow these steps:',
          ],
          list: [
            'Contact us via Facebook (https://www.facebook.com/beautydokanbd) or email (support@beautydokanbd.com) with your order number and a photo/video of the damaged or incorrect product.',
            'Our team will review your request and respond within 24–48 hours.',
            'If approved, we will arrange a pickup or ask you to send the product back to our address.',
            'The product will be inspected upon receipt to verify the issue.',
          ],
        },
        {
          heading: 'Refund Process',
          paragraphs: [
            'Once your return is approved and the product passes inspection, refunds are processed as follows:',
          ],
          list: [
            'Refunds are issued to the original payment method (bKash, Nagad, or bank transfer).',
            'For Cash on Delivery orders, refunds are sent via bKash or Nagad within 5–7 business days.',
            'You may also choose store credit as an alternative refund method.',
            'Shipping charges are non-refundable unless the return is due to our error.',
          ],
        },
        {
          heading: 'Exchange Policy',
          paragraphs: [
            'If you receive a damaged or incorrect product, we offer a free replacement (exchange) subject to availability. If the replacement is unavailable, a full refund will be issued instead.',
          ],
        },
        {
          heading: 'Cancellations',
          paragraphs: [
            'You may cancel your order before it has been dispatched. Once the order is shipped, cancellation is not possible and the standard return policy applies after delivery.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any return or refund related questions, please contact us:',
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
