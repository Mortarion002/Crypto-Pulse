import type { Metadata } from 'next'

import MarketingPageShell, {
  DetailList,
  MarketingCard,
} from '@/shared/components/MarketingPageShell'

export const metadata: Metadata = {
  title: 'Terms | Crypto Pulse',
  description:
    'Terms for using Crypto Pulse market sentiment dashboards, watchlists, and related services.',
}

export default function TermsPage() {
  return (
    <MarketingPageShell
      currentHref="/terms"
      description="These terms cover access to Crypto Pulse, including the market dashboard, sentiment views, watchlists, and any related paid or beta features."
      eyebrow="Terms"
      title="Terms of service"
      updated="Effective May 26, 2026"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MarketingCard eyebrow="Use" title="The service">
          <p>
            Crypto Pulse provides market data views, sentiment labels, and
            workflow tools for tracking crypto assets. The service is for
            informational purposes only and is not financial, investment, tax,
            or legal advice.
          </p>
        </MarketingCard>

        <MarketingCard eyebrow="Accounts" title="Your responsibilities">
          <DetailList
            items={[
              'Keep your login credentials secure and notify us if you suspect unauthorized access.',
              'Use Crypto Pulse only in compliance with applicable laws and exchange rules.',
              'Do not scrape, overload, reverse engineer, or interfere with service infrastructure.',
              'Do not use the product to mislead others, manipulate markets, or distribute harmful content.',
            ]}
          />
        </MarketingCard>

        <MarketingCard eyebrow="Data" title="Market information">
          <p>
            Prices, volume, sentiment, and other market indicators can be
            delayed, incomplete, or inaccurate. Crypto markets are volatile. You
            are responsible for verifying information before making decisions.
          </p>
        </MarketingCard>

        <MarketingCard eyebrow="Plans" title="Billing and changes">
          <DetailList
            items={[
              'Free and paid plans may have different data limits, update frequency, alerts, or API access.',
              'Paid subscriptions renew until canceled according to the checkout terms presented at purchase.',
              'We may change features, pricing, or limits with reasonable notice when required.',
              'Beta features may be modified or removed while we learn from usage and reliability data.',
            ]}
          />
        </MarketingCard>

        <MarketingCard
          className="lg:col-span-2"
          eyebrow="Legal"
          title="Disclaimers and limitations"
        >
          <p>
            Crypto Pulse is provided as available, without guarantees that the
            service will be uninterrupted or error-free. To the fullest extent
            allowed by law, Crypto Pulse is not liable for trading losses,
            missed market events, data interruptions, or indirect damages.
          </p>
        </MarketingCard>
      </div>
    </MarketingPageShell>
  )
}
