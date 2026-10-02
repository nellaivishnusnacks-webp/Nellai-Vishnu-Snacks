const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This public website currently helps visitors browse a catalogue and contact the shop through WhatsApp, phone, or email.',
    sections: [
      ['Information handled', 'The frontend does not create user accounts, collect form submissions, or store customer records. If you choose to contact the shop, WhatsApp, your phone provider, or your email provider will handle that interaction under their own terms and policies.'],
      ['Website storage and tracking', 'This frontend does not use analytics, advertising scripts, or non-essential cookies. An order slip exists only in the current page session and is not persisted by this website.'],
      ['Owner confirmation required', 'The shop owner should confirm the final legal contact details, retention practices, and any future data-processing arrangements before launch.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'This website is a public catalogue and contact interface. It is not a checkout, payment, or order-confirmation system.',
    sections: [
      ['Catalogue information', 'Product details, prices, availability, weights, and photographs are subject to confirmation by the shop. Sending a message through WhatsApp does not by itself confirm an order, price, availability, or delivery arrangement.'],
      ['Contact and ordering', 'Visitors can use the provided WhatsApp, phone, and email links to contact the shop. Any final order terms, collection or delivery arrangements, and payment instructions must be agreed directly with the shop.'],
      ['Owner confirmation required', 'The shop owner should review and replace this neutral draft with final business terms, including any applicable ordering, delivery, and dispute information.'],
    ],
  },
  refund: {
    title: 'Refund Policy',
    intro: 'This website does not process payments or issue refunds. It only helps visitors contact the shop.',
    sections: [
      ['No online payment on this website', 'There is no payment gateway or online checkout in the current frontend. No payment, refund, cancellation, or return request is submitted through this website.'],
      ['Direct arrangements', 'If a purchase is agreed with the shop through WhatsApp, phone, or email, please ask the shop about its applicable cancellation, return, replacement, and refund arrangements before completing that purchase.'],
      ['Owner confirmation required', 'The shop owner must supply and approve the final refund, cancellation, return, and contact procedure before accepting online orders or payments.'],
    ],
  },
}

export default function PolicyPage({ type }) {
  const policy = POLICIES[type] || POLICIES.privacy
  return (
    <section className="bg-paper" aria-labelledby="policy-heading">
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-24">
        <p className="tag text-maroon">Public information</p>
        <h1 id="policy-heading" className="font-display text-3xl md:text-5xl text-ink mt-3 max-w-3xl">{policy.title}</h1>
        <p className="font-editorial text-lg text-ink/80 leading-relaxed mt-6 max-w-2xl">{policy.intro}</p>
        <div className="mt-10 max-w-3xl border-t-2 border-ink">
          {policy.sections.map(([heading, body]) => (
            <section key={heading} className="py-6 border-b border-dashed border-ink/35" aria-labelledby={`${type}-${heading}`}>
              <h2 id={`${type}-${heading}`} className="font-display text-xl md:text-2xl text-maroon">{heading}</h2>
              <p className="font-body text-base text-ink/80 leading-relaxed mt-3">{body}</p>
            </section>
          ))}
        </div>
        <p className="font-body text-sm text-ink/65 mt-8 max-w-3xl">This is a neutral frontend draft and is not legal advice. Please obtain owner and legal review before launch.</p>
      </div>
    </section>
  )
}
