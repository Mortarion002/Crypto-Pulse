import type { Metadata } from 'next'

import MarketingPageShell, {
  DetailList,
  MarketingCard,
} from '@/shared/components/MarketingPageShell'

export const metadata: Metadata = {
  title: 'Privacy | Crypto Pulse',
  description:
    'How Crypto Pulse handles account, watchlist, and market intelligence data.',
}

export default function PrivacyPage() {
  return (
    <MarketingPageShell
      currentHref="/privacy"
      description="Crypto Pulse is designed around fast market context, not unnecessary data collection. This page explains what we collect, why we use it, and how you stay in control."
      eyebrow="Privacy"
      title="Privacy policy"
      updated="Effective May 26, 2026"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MarketingCard eyebrow="Data we use" title="Information we collect">
          <DetailList
            items={[
              'Account details such as email address and authentication metadata needed to sign you in securely.',
              'Product preferences such as watchlist coins, dashboard settings, and saved market views.',
              'Operational data such as device, browser, request logs, and error diagnostics used to keep the app reliable.',
              'Market and sentiment data shown in the product. This data describes assets and market activity, not your personal finances.',
            ]}
          />
        </MarketingCard>

        <MarketingCard eyebrow="Purpose" title="How we use information">
          <DetailList
            items={[
              'Provide the dashboard, watchlist, coin detail pages, and account experience.',
              'Protect the service from abuse, troubleshoot failures, and improve performance.',
              'Send service notices related to account access, security, billing, or major product changes.',
              'Improve market intelligence features by understanding which surfaces are useful and where users run into friction.',
            ]}
          />
        </MarketingCard>

        <MarketingCard eyebrow="Sharing" title="Who receives data">
          <p>
            We use service providers for hosting, authentication, analytics,
            support, and infrastructure operations. They receive only the data
            needed to perform those services. We do not sell your personal data.
          </p>
          <p className="mt-4">
            We may disclose information if required by law, to protect the
            service, or as part of a business transfer where user protections
            continue to apply.
          </p>
        </MarketingCard>

        <MarketingCard eyebrow="Control" title="Your choices">
          <DetailList
            items={[
              'Update or remove saved watchlist items from inside the app.',
              'Request account deletion or data export through the support channel available to your account.',
              'Use browser controls to limit cookies, storage, or tracking preferences where supported.',
              'Opt out of non-essential emails when those emails include an unsubscribe option.',
            ]}
          />
        </MarketingCard>
      </div>
    </MarketingPageShell>
  )
}
