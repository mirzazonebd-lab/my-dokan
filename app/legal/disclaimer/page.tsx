import type { Metadata } from 'next';
import LegalLayout from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Disclaimer | Beauty Dokan BD',
  description:
    'Read the Beauty Dokan BD disclaimer regarding product information, skincare results, color accuracy, and liability.',
  alternates: { canonical: '/legal/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <LegalLayout
      title="Disclaimer"
      description="Please read this disclaimer carefully. It outlines important information about our products and services."
      lastUpdated="July 17, 2026"
      sections={[
        {
          heading: 'General Information',
          paragraphs: [
            'The information provided on the Beauty Dokan BD website is for general informational purposes only. While we strive to keep information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, or reliability of any product information on our website.',
          ],
        },
        {
          heading: 'Product Colors & Images',
          paragraphs: [
            'Product colors may vary slightly from what appears on your screen due to differences in monitor settings, screen resolution, photography lighting, and display configurations. We do our best to represent products accurately, but slight variations are inevitable and should be expected.',
          ],
        },
        {
          heading: 'Skincare Results',
          paragraphs: [
            'Results from skincare products may vary depending on your skin type, condition, sensitivity, and usage patterns. What works effectively for one person may not produce the same results for another. We recommend:',
          ],
          list: [
            'Performing a patch test before using any new product, especially if you have sensitive skin.',
            'Consulting a dermatologist if you have specific skin concerns or known allergies.',
            'Discontinuing use immediately if irritation, redness, or discomfort occurs.',
            'Following the usage instructions provided with each product.',
          ],
        },
        {
          heading: 'Product Ingredients',
          paragraphs: [
            'All product ingredients are listed on the packaging and/or product description. It is your responsibility to review the ingredient list for any known allergens or sensitivities. Beauty Dokan BD is not liable for allergic reactions or adverse effects resulting from the use of any product.',
          ],
        },
        {
          heading: 'Authenticity',
          paragraphs: [
            'Beauty Dokan BD sources products from authorized distributors and trusted suppliers. We take every measure to ensure that all products sold on our website are 100% authentic and genuine. However, we recommend verifying product packaging and seals upon receipt.',
          ],
        },
        {
          heading: 'No Medical Advice',
          paragraphs: [
            'Content on our website, including product descriptions and beauty tips, is not intended as medical advice. Always consult a qualified healthcare professional or dermatologist for skin conditions, allergies, or medical concerns.',
          ],
        },
        {
          heading: 'External Links',
          paragraphs: [
            'Our website may contain links to external websites (such as social media pages or payment gateways). We are not responsible for the content, privacy policies, or practices of these third-party sites.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'Beauty Dokan BD shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of our products or website. Your use of our website and products is at your own risk.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'If you have any questions about this disclaimer, please contact us:',
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
