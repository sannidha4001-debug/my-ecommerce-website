/**
 * Bilingual copy for the whole site.
 *
 * `en` is the source of truth. `bn` is typed as `Dictionary`, so if a key is
 * missing or misspelled in Bangla, TypeScript will fail the build. This is a
 * simple, beginner-friendly alternative to a full i18n framework.
 */

export const en = {
  meta: {
    title: "GameXchange — Trusted Game Account Escrow Marketplace in Bangladesh",
    description:
      "Buy and sell Free Fire, eFootball, PUBG and other game accounts safely. GameXchange holds the money in escrow until the deal is complete.",
  },
  nav: {
    home: "Home",
    marketplace: "Marketplace",
    auctions: "Auctions",
    sell: "Sell",
    howItWorks: "How escrow works",
    about: "About",
    contact: "Contact",
    signIn: "Sign in",
    getStarted: "Get started",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    switchLanguage: "Switch language",
    search: "Search",
  },
  common: {
    loading: "Loading",
    viewAll: "View all",
    learnMore: "Learn more",
    browseMarketplace: "Browse marketplace",
    backHome: "Back to home",
    verified: "Verified",
    verifiedSeller: "Verified seller",
    live: "Live",
    liveAuction: "Live auction",
    auction: "Auction",
    fixedPrice: "Fixed price",
    bids: "bids",
    currentBid: "Current bid",
    startingBid: "Starting bid",
    buyNow: "Buy now",
    endsIn: "Ends in",
    ended: "Ended",
    watch: "Watch",
    watching: "Watching",
    featured: "Featured",
    preview: "Preview",
    results: "results",
    noResults: "No listings match those filters yet.",
    clearFilters: "Clear all filters",
    gameAccount: "Game account",
    level: "Level",
    rank: "Rank",
    commission: "Commission",
    demoData:
      "Sample data for preview. The live Supabase marketplace is connected in a later phase.",
  },
  footer: {
    tagline:
      "Bangladesh's trusted escrow marketplace for game accounts. We hold the payment, protect both sides, and release the money only when the deal is done.",
    explore: "Explore",
    company: "Company",
    legal: "Legal",
    support: "Support",
    newsletterTitle: "Stay ahead of the drop",
    newsletterSubtitle: "New auctions, rare accounts and safety tips. No spam, ever.",
    emailPlaceholder: "you@example.com",
    subscribe: "Subscribe",
    subscribed: "You're on the list! Check your inbox for a confirmation.",
    paymentTitle: "Payouts supported via",
    bKash: "bKash",
    nagad: "Nagad",
    bank: "Bank transfer",
    disclaimer:
      "Game trading may violate individual game publishers' terms. You trade at your own risk. GameXchange is an independent escrow service and is not affiliated with any publisher.",
    rights: "All rights reserved.",
    madeIn: "Built for gamers in Bangladesh",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    refunds: "Refund & Dispute Policy",
    howItWorks: "How Escrow Works",
    about: "About Us",
    contact: "Contact",
    safety: "Safety Center",
    faq: "FAQ",
  },
  home: {
    scamWarning: {
      strong: "Never pay a seller directly.",
      text: "Always pay through GameXchange escrow — your money stays protected until you confirm the account works.",
      dismiss: "Dismiss warning",
    },
    hero: {
      badge: "Bangladesh's trusted game account escrow",
      titleLine1: "Trade game accounts",
      titleHighlight: "without the risk.",
      titleLine2: "",
      subtitle:
        "Buy and sell Free Fire, eFootball, PUBG and more while we hold the money safely in the middle. Verified sellers, live auctions and real human support — built for Bangladeshi gamers.",
      ctaPrimary: "Explore marketplace",
      ctaSecondary: "How escrow works",
      trust1: "Money held in escrow",
      trust2: "KYC-verified sellers",
      trust3: "48-hour buyer inspection",
      gamers: "12,400+ gamers already inside",
      rating: "4.9/5 average deal rating",
      liveNow: "Live now",
      liveCardLabel: "Featured auction",
      liveCardGame: "Free Fire · Asia",
      liveCardTitle: "Grandmaster account · 12 mythic skins",
      liveCardBid: "Current bid",
      liveCardBids: "23 bids",
      liveCardEnds: "Ends in",
      placeBid: "Place a bid",
      protectedDeal: "Escrow protected",
      miniSeller: "Verified seller",
      miniDeal: "Deal completed",
      floatingBadge: "Payout released",
      floatingBadgeSub: "Seller paid in 4 min",
    },
    stats: {
      deals: "Deals completed",
      sellers: "Verified sellers",
      protected: "Protected in escrow",
      rating: "Average rating",
      dealsValue: "12,480",
      sellersValue: "3,260",
      protectedValue: "৳4.2 Cr",
      ratingValue: "4.9",
      dealsSuffix: "+",
      sellersSuffix: "+",
      ratingSuffix: "/5",
    },
    auctions: {
      eyebrow: "Live auctions",
      title: "Rare accounts. Real competition.",
      subtitle:
        "Bid in real time, set a proxy bid and let the market decide. Every winner gets an escrow-protected order automatically.",
      viewAll: "View all auctions",
      endingSoon: "Ending soon",
      bidderNote: "Phone-verified bidders only",
      wonNote: "Winner gets 24 hours to pay",
    },
    games: {
      eyebrow: "Trending games",
      title: "Find your next main account",
      subtitle: "Curated listings across the games Bangladeshi players love most.",
      listings: "active listings",
      explore: "Explore",
    },
    escrow: {
      eyebrow: "How escrow works",
      title: "Your money moves only when you say it should.",
      subtitle:
        "Four simple steps. One trusted middleman. Zero direct payments to strangers.",
      step1Title: "Choose & order",
      step1Body:
        "Buy instantly or win an auction. The seller's listing is locked the moment you order.",
      step2Title: "Pay GameXchange",
      step2Body:
        "Send the amount via bKash or Nagad to our official merchant number. Never to the seller.",
      step3Title: "Verify & hand over",
      step3Body:
        "We confirm your payment, then an admin coordinates the account handover through a moderated support thread. Members never message each other privately.",
      step4Title: "Inspect & release",
      step4Body:
        "You get 48 hours to test everything. Confirm, and we pay the seller minus our commission.",
      note: "Fee breakdown is always shown before payout. Default commission is 7% with a ৳50 minimum — configurable by the admin.",
      cta: "See the full escrow process",
      stepLabel: "Step",
      safe: "Held safely by GameXchange",
    },
    features: {
      eyebrow: "Why GameXchange",
      title: "Built like a bank. Feels like a game.",
      subtitle:
        "Serious protection underneath, a fast and friendly experience on top.",
      f1Title: "True escrow protection",
      f1Body:
        "The seller never touches your money until you confirm the account works. Disputes are reviewed by a real human with chat and evidence.",
      f2Title: "Verified sellers only",
      f2Body:
        "Sellers pass phone and NID verification before earning the blue badge. Reputation is built on completed deals, not promises.",
      f3Title: "Live, fair auctions",
      f3Body:
        "Atomic server-side bids, anti-sniping extensions, proxy bidding and masked bid history. No refresh needed.",
      f4Title: "Private handover chat",
      f4Body:
        "Coordinate safely inside the order. We never ask for account passwords and we tell you exactly how to secure the recovery details.",
      f5Title: "bKash & Nagad payouts",
      f5Body:
        "Fast local payouts with a transparent fee breakdown. Track every taka from payment to release.",
      f6Title: "Human support, 7 days",
      f6Body:
        "Stuck mid-deal? Our team is one message away, from first bid to final payout.",
      badge: "Trust layer",
    },
    testimonials: {
      eyebrow: "Trusted by the community",
      title: "Deals that end with a handshake, not a headache.",
      subtitle:
        "Thousands of Bangladeshi gamers trade safely here every month. Here's what a few of them say.",
      t1Name: "Rafiul Hasan",
      t1Role: "Bought a Free Fire account",
      t1Quote:
        "I was nervous about paying first, but the escrow made it simple. The seller delivered in 20 minutes and I had two days to test everything before the money was released.",
      t2Name: "Nusrat Jahan",
      t2Role: "Sold an eFootball squad",
      t2Quote:
        "The fee breakdown was clear from the start and my bKash payout arrived the same day. As a verified seller, buyers trust me much faster now.",
      t3Name: "Ahnaf Chowdhury",
      t3Role: "Won a PUBG auction",
      t3Quote:
        "The live bids updating without refresh felt genuinely premium. I set a proxy bid and won while I was in class. The order was in my dashboard immediately.",
      t4Name: "Sadia Islam",
      t4Role: "Bought a Valorant account",
      t4Quote:
        "A small issue came up after delivery and support stepped in the same evening. The dispute was resolved fairly — that's why I came back for a second account.",
      verifiedBuyer: "Verified buyer",
      dealCompleted: "Deal completed",
    },
    faq: {
      eyebrow: "Questions, answered",
      title: "Before you trade, know this.",
      subtitle:
        "The short answers to the things new buyers and sellers ask us most.",
      items: [
        {
          q: "What exactly is escrow and why do I need it?",
          a: "Escrow means a trusted third party — GameXchange — holds the buyer's payment until both sides complete the deal. The seller knows the money is real, and the buyer knows the seller won't disappear with it. If something goes wrong, our team can refund the buyer or release the payout based on evidence.",
        },
        {
          q: "How do I pay? Is bKash or Nagad supported?",
          a: "Yes. After you place an order you'll see our official bKash and Nagad merchant numbers, loaded securely from admin settings. You send the amount there and submit the sender number and TrxID. Never send money to the seller directly — that payment is not protected.",
        },
        {
          q: "What happens after I receive the account?",
          a: "You get a 48-hour inspection window. Change the password, bind your own email and phone, and test the account thoroughly. If everything is correct, click Confirm received and we pay the seller. If not, open a dispute with evidence before the timer ends.",
        },
        {
          q: "How much commission does GameXchange charge?",
          a: "The default commission is 7% of the sale price, with a minimum of ৳50. It is deducted from the seller's payout and shown in a clear breakdown before you confirm. The admin can change this in site settings, and the rate is always visible on your order.",
        },
        {
          q: "Do you ever ask for my game account password?",
          a: "Never. GameXchange staff will never ask for your game password, OTP or recovery code, and our chat does not store passwords. Use the game's own email/phone recovery change flow during handover so the seller loses access permanently.",
        },
        {
          q: "Can I bid if I'm not phone-verified?",
          a: "No. Bidding requires a logged-in, phone-verified account and a refundable bid deposit when the admin enables it. This keeps fake bids out and protects real sellers. You can verify your phone from your dashboard in under a minute.",
        },
      ],
      stillQuestions: "Still have a question?",
      contact: "Talk to our team",
    },
    cta: {
      title: "Ready to trade without the fear?",
      subtitle:
        "Join thousands of Bangladeshi gamers buying and selling with real escrow protection. Your first deal could be today.",
      primary: "Create a free account",
      secondary: "Browse accounts",
      guarantee: "No hidden fees · 48-hour inspection · Human support",
    },
  },
  marketplace: {
    eyebrow: "Marketplace",
    title: "Accounts worth playing.",
    subtitle:
      "Every listing is reviewed before it goes live. Filter by game, budget and seller reputation to find your next account.",
    searchPlaceholder: "Search by game, rank, skin or seller…",
    allGames: "All games",
    filters: "Filters",
    priceRange: "Price range (৳)",
    min: "Min",
    max: "Max",
    verifiedOnly: "Verified sellers only",
    listingType: "Listing type",
    allTypes: "All types",
    fixed: "Fixed price",
    auctionType: "Auction",
    sortBy: "Sort by",
    newest: "Newest first",
    priceLow: "Price: low to high",
    priceHigh: "Price: high to low",
    endingSoon: "Ending soon",
    mostBids: "Most bids",
    results: "accounts found",
    reset: "Reset filters",
    gridView: "Grid view",
    listView: "List view",
    previewNotice: "Preview listings",
    previewNote:
      "These are demo accounts to show the experience. Live Supabase listings and checkout arrive in Phase 3.",
    loadMore: "Load more accounts",
    showing: "Showing",
    of: "of",
    emptyTitle: "No accounts found",
    emptyBody: "Try a different game or widen your price range.",
    watchAdded: "Added to your watchlist",
    watchRemoved: "Removed from your watchlist",
    sortLabel: "Sort listings",
    filtersLabel: "Filter listings",
  },
  pages: {
    howItWorks: {
      eyebrow: "The GameXchange promise",
      title: "One safe path from “I want it” to “it's mine”.",
      subtitle:
        "We sit between the buyer and the seller, hold the money, and only release it when the deal is complete. Here is exactly what happens.",
      intro:
        "Game account trading is full of strangers, fake screenshots and vanishing sellers. Escrow removes the trust problem: nobody has to go first, because GameXchange holds the payment in the middle.",
      steps: [
        {
          title: "Order the account",
          body: "Buy at a fixed price or win an auction. Your order is created instantly and the listing is locked so nobody else can buy it.",
        },
        {
          title: "Send payment to GameXchange",
          body: "Use the official bKash or Nagad number shown on your order. Submit the sender number, transaction ID and a screenshot. We never ask you to pay a seller directly.",
        },
        {
          title: "We verify the payment",
          body: "Our team matches your transaction and marks the payment confirmed, usually within minutes during support hours. You'll see the order move to the next stage.",
        },
        {
          title: "Private handover",
          body: "Buyer and seller coordinate in the order's private chat. Change the account email and phone to yours using the game's official recovery flow. Never share passwords in chat.",
        },
        {
          title: "48-hour inspection",
          body: "Test the account, log in, check items and rank. If anything is wrong, open a dispute with evidence before the window closes.",
        },
        {
          title: "Payout released",
          body: "You confirm receipt. We deduct the commission and pay the seller via bKash or Nagad. Both sides can review each other and build reputation.",
        },
      ],
      feesTitle: "Clear fees, no surprises",
      feesBody:
        "The commission is deducted from the seller's payout, never added on top of the buyer's price.",
      feesPoints: [
        "Default commission: 7% of the sale price",
        "Minimum commission: ৳50 per completed order",
        "Example: a ৳10,000 sale pays ৳700 commission, seller receives ৳9,300",
        "The exact breakdown is shown before payout is released",
        "Failed or cancelled orders do not earn commission",
      ],
      safetyTitle: "Safety rules that never bend",
      safetyPoints: [
        "Never pay a seller directly — only pay the official GameXchange number",
        "Never share your game password, OTP or recovery code in chat",
        "Change the account email and phone during handover",
        "Keep all negotiation and evidence inside the order",
        "Report anyone who asks you to move the deal off-platform",
      ],
      ctaTitle: "See it in action",
      ctaBody: "Browse live listings and start your first protected deal today.",
      cta: "Explore marketplace",
    },
    about: {
      eyebrow: "About GameXchange",
      title: "We built the middleman gamers actually wanted.",
      subtitle:
        "A local escrow service for a local problem: trading game accounts in Bangladesh without getting scammed.",
      storyTitle: "Our story",
      story1:
        "GameXchange started with a simple observation: Bangladeshi gamers were buying and selling accounts every day in Facebook groups and Discord servers, with nothing but screenshots and hope. Buyers sent bKash first and never received the account. Sellers handed over the account and never got paid. There had to be a better way.",
      story2:
        "So we built a proper escrow layer: the buyer pays us, we verify it, both sides hand over safely, and money moves only after the buyer confirms. We added verified sellers, structured disputes, live auctions and a transparent fee model. Today the platform is built around one promise — nobody has to trust a stranger, because they can trust the process.",
      valuesTitle: "What we stand for",
      values: [
        {
          title: "Safety before speed",
          body: "A slightly slower checkout is worth it if it prevents one scam. Every flow is designed so both sides can verify before money moves.",
        },
        {
          title: "Radical clarity",
          body: "Fees, timelines and rules are visible up front. No hidden charges, no vague dispute outcomes, no fine print tricks.",
        },
        {
          title: "Local first",
          body: "bKash and Nagad, Bangla and English, BDT pricing and support hours that match how Bangladesh actually plays.",
        },
      ],
      numbersTitle: "The community so far",
      ctaTitle: "Trade with people who take safety seriously",
      cta: "Join GameXchange",
    },
    contact: {
      eyebrow: "Contact",
      title: "Real humans, ready to help.",
      subtitle:
        "Payment issue, stuck order or a suspicious listing? Send us the details and we'll get back to you within one business day.",
      email: "Email",
      emailValue: "support@gamexchange.com.bd",
      hours: "Support hours",
      hoursValue: "Every day, 10:00 – 23:00 (GMT+6)",
      response: "Typical response",
      responseValue: "Under 6 hours",
      formTitle: "Send a message",
      name: "Your name",
      emailField: "Email address",
      subject: "Subject",
      message: "How can we help?",
      subjectOptions: {
        payment: "Payment or payout",
        order: "Order or dispute",
        listing: "Report a listing",
        account: "Account or verification",
        other: "Something else",
      },
      submit: "Send message",
      sending: "Sending…",
      success: "Message received. Our team will reply by email shortly.",
      error: "Something went wrong. Please email us directly.",
      faqPrompt: "Looking for a quick answer?",
      faqLink: "Read the FAQ",
    },
    terms: {
      eyebrow: "Legal",
      title: "Terms & Conditions",
      updated: "Last updated: 4 November 2026",
      intro:
        "These terms govern your use of GameXchange. By creating an account or using the marketplace, you agree to them. Please read them fully — especially the section about game publisher rules.",
      sections: [
        {
          title: "1. Who we are",
          body: [
            "GameXchange is an independent escrow marketplace that helps buyers and sellers trade game accounts in Bangladesh. We are not the buyer or the seller, and we are not affiliated with, endorsed by or sponsored by any game publisher.",
          ],
        },
        {
          title: "2. Eligibility",
          body: [
            "You must be at least 18 years old and legally able to enter a contract. You must provide a working phone number, keep your account secure, and complete identity verification before selling.",
          ],
        },
        {
          title: "3. Game publisher rules",
          body: [
            "Many game publishers prohibit or restrict account trading in their terms of service. GameXchange does not encourage breaking those rules. If you choose to trade, you do so at your own risk, and you accept that a publisher may suspend, ban or reclaim the account. GameXchange cannot reverse a publisher's enforcement action.",
          ],
        },
        {
          title: "4. Escrow and payments",
          body: [
            "Buyers pay GameXchange, not the seller. We hold funds until the buyer confirms receipt or a dispute is resolved. Payment instructions are shown in the order and may change if bank or mobile-money details change. Always use the number displayed on your own order page.",
            "Orders must be paid within the stated window. Unpaid orders may be cancelled and repeat no-shows may lead to restrictions on your account.",
          ],
        },
        {
          title: "5. Commission and payouts",
          body: [
            "A commission is deducted from the seller's payout. The default is 7% of the sale price with a minimum of ৳50, and the exact amount is shown before release. Payouts are made to the seller's verified bKash or Nagad number after completion and any required review.",
          ],
        },
        {
          title: "6. Handover and verification",
          body: [
            "Members never message each other directly. Every handover step, screenshot and question goes through an admin-moderated support thread. Never share game passwords, OTPs or recovery codes. Use the game's official account recovery or binding-change process so that ownership is genuinely transferred. GameXchange never asks for your game password.",
          ],
        },
        {
          title: "7. Disputes",
          body: [
            "The buyer has 48 hours after delivery to inspect the account and open a dispute with evidence. Our team may request additional proof and will make a good-faith decision based on the listing, chat history and evidence. Decisions may include release, partial refund, or full refund.",
          ],
        },
        {
          title: "8. Prohibited conduct",
          body: [
            "Fraud, shill bidding, fake payment proof, chargebacks, harassment, account takeover, uploading stolen accounts and attempting to move deals off-platform are prohibited. We may suspend accounts, withhold payouts pending investigation, and report unlawful activity to the authorities.",
          ],
        },
        {
          title: "9. Limitation of liability",
          body: [
            "The service is provided on an “as is” basis. To the maximum extent permitted by law, GameXchange is not liable for indirect or consequential losses, publisher bans, or losses caused by your own failure to secure an account after handover. Our total liability for any order is limited to the amount held in escrow for that order.",
          ],
        },
        {
          title: "10. Changes and contact",
          body: [
            "We may update these terms and will post the new version with a revised date. Continued use means acceptance. Questions can be sent to support@gamexchange.com.bd.",
          ],
        },
      ],
    },
    privacy: {
      eyebrow: "Legal",
      title: "Privacy Policy",
      updated: "Last updated: 4 November 2026",
      intro:
        "We collect the minimum information needed to run a safe escrow marketplace, and we protect it like we protect your payments. This policy explains what we collect, why, and your choices.",
      sections: [
        {
          title: "1. Information we collect",
          body: [
            "Account details: name, email, phone number, password hash and age confirmation. Trading details: listings, orders, bids, chat messages, payment sender number and transaction ID.",
            "Verification details: NID images submitted for seller KYC, stored in a private bucket with restricted access. Technical details: device, browser, IP address and security logs used for fraud prevention and rate limiting.",
          ],
        },
        {
          title: "2. How we use it",
          body: [
            "To operate escrow orders, verify payments, prevent fraud and shill bidding, resolve disputes, pay sellers, comply with legal obligations, and send transactional notifications such as outbid alerts and ending-soon reminders.",
          ],
        },
        {
          title: "3. What we never store",
          body: [
            "We do not store game account passwords, OTPs or recovery codes. Do not send them in chat or upload them anywhere on the platform. Our staff will never ask for them.",
          ],
        },
        {
          title: "4. Sharing",
          body: [
            "We share the minimum necessary information with payment providers, email/SMS delivery services, hosting and security providers. We do not sell personal data. We may disclose information if required by law or to investigate fraud.",
          ],
        },
        {
          title: "5. Retention and security",
          body: [
            "We use Row Level Security, encrypted connections, least-privilege access and audit logs. KYC files and payment evidence are private. Data is retained while your account is active and for a reasonable period afterwards for legal, accounting and dispute purposes.",
          ],
        },
        {
          title: "6. Your rights",
          body: [
            "You can access and update most profile data in your dashboard. To request a copy, correction or deletion of your data, contact support@gamexchange.com.bd. Some records may be retained where the law requires it.",
          ],
        },
        {
          title: "7. Cookies",
          body: [
            "We use essential cookies for authentication, theme and language preferences, plus security cookies for rate limiting. We do not use advertising trackers.",
          ],
        },
        {
          title: "8. Contact",
          body: [
            "Privacy questions: privacy@gamexchange.com.bd. General support: support@gamexchange.com.bd.",
          ],
        },
      ],
    },
    refunds: {
      eyebrow: "Legal",
      title: "Refund & Dispute Policy",
      updated: "Last updated: 4 November 2026",
      intro:
        "Escrow only works if both sides know what happens when a deal goes wrong. This policy explains the refund rules, timelines and evidence we use.",
      sections: [
        {
          title: "1. Your inspection window",
          body: [
            "After the seller delivers the account, the buyer has 48 hours to inspect it. During this time you can confirm receipt or open a dispute. If you do nothing, the order may auto-complete and the payout may be released.",
          ],
        },
        {
          title: "2. When you can open a dispute",
          body: [
            "Open a dispute if the account is not delivered, does not match the listing, is recovered by the seller, is permanently banned for reasons that existed before delivery, or the seller asks for extra money. Provide screenshots, screen recordings, chat logs and error messages.",
          ],
        },
        {
          title: "3. What is not covered",
          body: [
            "Publisher rule changes, a ban caused by your own actions after handover, buyer regret, or losses caused by sharing your password/OTP. If you paid the seller directly outside GameXchange, we cannot recover that money.",
          ],
        },
        {
          title: "4. How we decide",
          body: [
            "Our team reviews the listing, order chat, payment record and evidence from both sides. We may request a live screen share or additional proof. We aim to decide within 3 business days, and both parties are notified in the order.",
          ],
        },
        {
          title: "5. Possible outcomes",
          body: [
            "Full refund to the buyer, partial refund, release to the seller, or a return/reversal of the account. The commission is refunded proportionally when an order is refunded. Fraudulent claims can lead to suspension.",
          ],
        },
        {
          title: "6. Refund timeline",
          body: [
            "Approved refunds are sent to the original payment method or your verified bKash/Nagad number within 3–5 business days. Bank delays may add time. You will see the refund recorded on the order.",
          ],
        },
        {
          title: "7. Chargebacks",
          body: [
            "Please contact us before raising a chargeback. A chargeback after delivery may be treated as fraud, and your account may be suspended while the case is investigated.",
          ],
        },
        {
          title: "8. Appeal",
          body: [
            "You may appeal a decision within 7 days with new evidence. Appeals are reviewed by a different moderator where possible. Contact disputes@gamexchange.com.bd and include your order number.",
          ],
        },
      ],
    },
  },
  sellPage: {
    eyebrow: "Sell on GameXchange",
    title: "Turn your account into a safe payout.",
    subtitle:
      "Create a listing, add screenshots and a short video, and let verified buyers find it. Your money is protected from the first click to the final release.",
    previewNote:
      "Demo form: listings and secure media storage connect to Supabase in Phase 3. Previews work fully in your browser today.",
    stepsTitle: "How selling works",
    step1: "Create your listing with photos and a short video",
    step2: "Pass phone and NID verification once",
    step3: "Hand over safely inside the order chat",
    step4: "Get paid via bKash or Nagad after inspection",
    formTitle: "Account details",
    formSubtitle:
      "Buyers trust listings that show real screenshots and honest details.",
    gameLabel: "Game",
    typeLabel: "Listing type",
    typeFixed: "Fixed price",
    typeFixedHint: "Sell instantly at your price.",
    typeAuction: "Auction",
    typeAuctionHint: "Let buyers bid. You set the starting price.",
    titleLabel: "Listing title",
    titlePlaceholder: "e.g. Grandmaster · 12 mythic skins · full email access",
    descriptionLabel: "Description",
    descriptionPlaceholder:
      "Rank, skins, level, linked email, ban history and anything else a buyer should know…",
    priceLabel: "Your price (৳)",
    startingBidLabel: "Starting bid (৳)",
    buyNowLabel: "Buy-now price (৳, optional)",
    levelLabel: "Account level",
    rankLabel: "Highest rank",
    platformLabel: "Platform / server",
    detailsTitle: "Photos & video",
    detailsSubtitle:
      "The first photo becomes your cover. Listings with a short video sell noticeably faster.",
    imagesLabel: "Screenshots",
    imagesHint: "Up to 8 images · JPG, PNG or WebP · 8 MB each",
    videoLabel: "Short video",
    videoHint: "1 video · MP4, WebM or MOV · 50 MB · max 2 minutes",
    dropImages: "Drag screenshots here, or click to browse",
    dropVideo: "Drag a short video here, or click to browse",
    dropActive: "Drop to add",
    browse: "Browse files",
    cover: "Cover",
    setCover: "Set as cover",
    remove: "Remove",
    preparing: "Preparing preview…",
    ready: "Ready",
    imageTooLarge: "That image is larger than 8 MB.",
    videoTooLarge: "That video is larger than 50 MB.",
    wrongImageType: "Only JPG, PNG and WebP images are allowed.",
    wrongVideoType: "Only MP4, WebM and MOV videos are allowed.",
    videoTooLong: "Videos must be 2 minutes or shorter.",
    tooManyImages: "You can upload up to 8 screenshots.",
    oneVideoOnly: "Only one video is allowed per listing.",
    readFailed: "That file could not be read. Please try another one.",
    localPreviewNote:
      "Files stay in your browser for now. Encrypted upload to private storage arrives with Supabase in Phase 3.",
    confirmOwnership:
      "I own this account and it has no active bans, recovery disputes or outstanding loans.",
    confirmTerms:
      "I understand account trading may violate the game publisher's terms and that I sell at my own risk.",
    submit: "Save listing draft",
    submitting: "Saving draft…",
    requiredFields:
      "Add a title, a price, at least one screenshot and accept both confirmations.",
    submittedTitle: "Draft saved locally",
    submittedBody:
      "Your details look good. Real listing creation, admin review and private media storage arrive in Phase 3.",
    createAnother: "Edit another draft",
    feeTitle: "Payout estimate",
    feeSalePrice: "Sale price",
    feeCommission: "Commission (7%, min ৳50)",
    feeYouReceive: "You receive",
    feeNote:
      "The commission is deducted from your payout, never added on top of the buyer's price.",
    safetyTitle: "Seller safety",
    safety1: "Never share your game password, OTP or recovery code in chat.",
    safety2:
      "Guide the buyer to change the account email and phone during handover.",
    safety3: "Keep every conversation and piece of evidence inside the order.",
    safety4:
      "Deliver within the promised window to avoid strikes on your account.",
    needHelp: "Need help creating your listing?",
    contactSupport: "Contact support",
  },
  notFound: {
    code: "404",
    title: "This account has left the lobby.",
    subtitle:
      "The page you're looking for was sold, moved, or never existed. Let's get you back to something worth playing.",
    home: "Return home",
    marketplace: "Browse accounts",
  },
  authPlaceholder: {
    badge: "Coming in Phase 2",
    title: "Secure sign-in is being wired up.",
    subtitle:
      "The visual foundation is ready. Email/password auth, Google login, phone verification and the separate admin portal arrive in Phase 2.",
    back: "Back to home",
    explore: "Explore the marketplace",
  },
};

/**
 * The shape every locale must follow. `typeof en` widens strings to `string`
 * while keeping every key and array element strictly required.
 */
export type Dictionary = typeof en;

export const bn: Dictionary = {
  meta: {
    title: "GameXchange — বাংলাদেশে বিশ্বস্ত গেম অ্যাকাউন্ট এস্ক্রো মার্কেটপ্লেস",
    description:
      "Free Fire, eFootball, PUBG ও অন্যান্য গেম অ্যাকাউন্ট নিরাপদে কিনুন ও বিক্রি করুন। ডিল সম্পন্ন না হওয়া পর্যন্ত GameXchange টাকা ধরে রাখে।",
  },
  nav: {
    home: "হোম",
    marketplace: "মার্কেটপ্লেস",
    auctions: "নিলাম",
    sell: "বিক্রি করুন",
    howItWorks: "এস্ক্রো যেভাবে কাজ করে",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    signIn: "লগ ইন",
    getStarted: "শুরু করুন",
    openMenu: "মেনু খুলুন",
    closeMenu: "মেনু বন্ধ করুন",
    toggleTheme: "থিম পরিবর্তন",
    switchLanguage: "ভাষা পরিবর্তন",
    search: "খুঁজুন",
  },
  common: {
    loading: "লোড হচ্ছে",
    viewAll: "সব দেখুন",
    learnMore: "আরও জানুন",
    browseMarketplace: "মার্কেটপ্লেস দেখুন",
    backHome: "হোমে ফিরুন",
    verified: "ভেরিফাইড",
    verifiedSeller: "ভেরিফাইড বিক্রেতা",
    live: "লাইভ",
    liveAuction: "লাইভ নিলাম",
    auction: "নিলাম",
    fixedPrice: "নির্ধারিত দাম",
    bids: "বিড",
    currentBid: "বর্তমান বিড",
    startingBid: "শুরুর দাম",
    buyNow: "এখনই কিনুন",
    endsIn: "শেষ হবে",
    ended: "শেষ হয়েছে",
    watch: "ওয়াচ",
    watching: "ওয়াচ করছেন",
    featured: "ফিচার্ড",
    preview: "প্রিভিউ",
    results: "টি ফলাফল",
    noResults: "এই ফিল্টারে এখন কোনো লিস্টিং নেই।",
    clearFilters: "সব ফিল্টার মুছুন",
    gameAccount: "গেম অ্যাকাউন্ট",
    level: "লেভেল",
    rank: "র‍্যাংক",
    commission: "কমিশন",
    demoData:
      "প্রিভিউয়ের জন্য নমুনা ডেটা। লাইভ Supabase মার্কেটপ্লেস পরবর্তী ধাপে যুক্ত হবে।",
  },
  footer: {
    tagline:
      "গেম অ্যাকাউন্ট কেনাবেচার জন্য বাংলাদেশের বিশ্বস্ত এস্ক্রো মার্কেটপ্লেস। আমরা পেমেন্ট ধরে রাখি, দুই পক্ষকে সুরক্ষা দিই, আর ডিল সম্পন্ন হলেই টাকা ছাড়ি।",
    explore: "ঘুরে দেখুন",
    company: "কোম্পানি",
    legal: "আইনি",
    support: "সাপোর্ট",
    newsletterTitle: "নতুন সুযোগ সবার আগে পান",
    newsletterSubtitle: "নতুন নিলাম, বিরল অ্যাকাউন্ট ও নিরাপত্তা টিপস। কোনো স্প্যাম নয়।",
    emailPlaceholder: "you@example.com",
    subscribe: "সাবস্ক্রাইব",
    subscribed: "আপনি তালিকায় আছেন! কনফার্মেশনের জন্য ইনবক্স দেখুন।",
    paymentTitle: "পেআউটের মাধ্যম",
    bKash: "বিকাশ",
    nagad: "নগদ",
    bank: "ব্যাংক ট্রান্সফার",
    disclaimer:
      "গেম ট্রেডিং বিভিন্ন গেম প্রকাশকের শর্তভঙ্গ হতে পারে। আপনি নিজ দায়িত্বে লেনদেন করছেন। GameXchange একটি স্বতন্ত্র এস্ক্রো সার্ভিস এবং কোনো প্রকাশকের সাথে সম্পর্কিত নয়।",
    rights: "সর্বস্বত্ব সংরক্ষিত।",
    madeIn: "বাংলাদেশের গেমারদের জন্য তৈরি",
    terms: "শর্তাবলি",
    privacy: "প্রাইভেসি পলিসি",
    refunds: "রিফান্ড ও ডিসপিউট পলিসি",
    howItWorks: "এস্ক্রো যেভাবে কাজ করে",
    about: "আমাদের সম্পর্কে",
    contact: "যোগাযোগ",
    safety: "সেফটি সেন্টার",
    faq: "সাধারণ প্রশ্ন",
  },
  home: {
    scamWarning: {
      strong: "কখনোই সরাসরি বিক্রেতাকে টাকা দেবেন না।",
      text: "সবসময় GameXchange এস্ক্রোর মাধ্যমে পেমেন্ট করুন — অ্যাকাউন্ট ঠিক আছে নিশ্চিত না হওয়া পর্যন্ত আপনার টাকা সুরক্ষিত থাকবে।",
      dismiss: "সতর্কবার্তা বন্ধ করুন",
    },
    hero: {
      badge: "বাংলাদেশের বিশ্বস্ত গেম অ্যাকাউন্ট এস্ক্রো",
      titleLine1: "গেম অ্যাকাউন্ট কেনাবেচা করুন",
      titleHighlight: "ঝুঁকি ছাড়াই।",
      titleLine2: "",
      subtitle:
        "Free Fire, eFootball, PUBG ও আরও অনেক গেম অ্যাকাউন্ট কিনুন-বিক্রি করুন — টাকা নিরাপদে আমাদের কাছে থাকবে। ভেরিফাইড বিক্রেতা, লাইভ নিলাম আর সত্যিকারের মানুষের সাপোর্ট, বাংলাদেশের গেমারদের জন্য।",
      ctaPrimary: "মার্কেটপ্লেস ঘুরে দেখুন",
      ctaSecondary: "এস্ক্রো যেভাবে কাজ করে",
      trust1: "টাকা এস্ক্রোতে সুরক্ষিত",
      trust2: "KYC-ভেরিফাইড বিক্রেতা",
      trust3: "৪৮ ঘণ্টা যাচাইয়ের সময়",
      gamers: "১২,৪০০+ গেমার ইতিমধ্যে যুক্ত",
      rating: "গড় ডিল রেটিং ৪.৯/৫",
      liveNow: "এখন লাইভ",
      liveCardLabel: "ফিচার্ড নিলাম",
      liveCardGame: "Free Fire · এশিয়া",
      liveCardTitle: "গ্র্যান্ডমাস্টার অ্যাকাউন্ট · ১২টি মিথিক স্কিন",
      liveCardBid: "বর্তমান বিড",
      liveCardBids: "২৩টি বিড",
      liveCardEnds: "শেষ হবে",
      placeBid: "বিড করুন",
      protectedDeal: "এস্ক্রো সুরক্ষিত",
      miniSeller: "ভেরিফাইড বিক্রেতা",
      miniDeal: "ডিল সম্পন্ন",
      floatingBadge: "পেআউট রিলিজ",
      floatingBadgeSub: "বিক্রেতাকে ৪ মিনিটে পরিশোধ",
    },
    stats: {
      deals: "সম্পন্ন লেনদেন",
      sellers: "ভেরিফাইড বিক্রেতা",
      protected: "এস্ক্রোতে সুরক্ষিত",
      rating: "গড় রেটিং",
      dealsValue: "12,480",
      sellersValue: "3,260",
      protectedValue: "৳4.2 Cr",
      ratingValue: "4.9",
      dealsSuffix: "+",
      sellersSuffix: "+",
      ratingSuffix: "/5",
    },
    auctions: {
      eyebrow: "লাইভ নিলাম",
      title: "বিরল অ্যাকাউন্ট। সত্যিকারের প্রতিযোগিতা।",
      subtitle:
        "রিয়েল টাইমে বিড করুন, প্রক্সি বিড সেট করুন, বাজারই সিদ্ধান্ত নিক। প্রতিটি বিজয়ী স্বয়ংক্রিয়ভাবে এস্ক্রো-সুরক্ষিত অর্ডার পান।",
      viewAll: "সব নিলাম দেখুন",
      endingSoon: "শেষ হচ্ছে",
      bidderNote: "শুধু ফোন-ভেরিফাইড বিডার",
      wonNote: "বিজয়ীর পেমেন্টের জন্য ২৪ ঘণ্টা",
    },
    games: {
      eyebrow: "ট্রেন্ডিং গেম",
      title: "আপনার পরের মেইন অ্যাকাউন্ট খুঁজুন",
      subtitle: "বাংলাদেশের গেমারদের সবচেয়ে পছন্দের গেমগুলোতে বাছাই করা লিস্টিং।",
      listings: "টি সক্রিয় লিস্টিং",
      explore: "দেখুন",
    },
    escrow: {
      eyebrow: "এস্ক্রো যেভাবে কাজ করে",
      title: "আপনি না বললে টাকা কোথাও যাবে না।",
      subtitle: "চারটি সহজ ধাপ। একজন বিশ্বস্ত মধ্যস্থতাকারী। অচেনা কাউকে সরাসরি টাকা নয়।",
      step1Title: "বেছে নিন ও অর্ডার করুন",
      step1Body: "সরাসরি কিনুন বা নিলামে জিতুন। অর্ডার করার সাথে সাথেই লিস্টিং লক হয়ে যায়।",
      step2Title: "GameXchange-কে পেমেন্ট করুন",
      step2Body: "অফিসিয়াল বিকাশ বা নগদ নম্বরে টাকা দিন। কখনোই বিক্রেতাকে নয়।",
      step3Title: "ভেরিফাই ও হ্যান্ডওভার",
      step3Body: "আমরা পেমেন্ট নিশ্চিত করি, তারপর ক্রেতা-বিক্রেতা প্রাইভেট চ্যাটে হ্যান্ডওভার সম্পন্ন করেন।",
      step4Title: "যাচাই করুন ও টাকা ছাড়ুন",
      step4Body: "সবকিছু পরীক্ষা করার জন্য ৪৮ ঘণ্টা পাবেন। কনফার্ম করলে কমিশন বাদ দিয়ে বিক্রেতাকে টাকা দেওয়া হয়।",
      note: "পেআউটের আগে ফি-ব্রেকডাউন সবসময় দেখানো হয়। ডিফল্ট কমিশন ৭%, সর্বনিম্ন ৳৫০ — অ্যাডমিন পরিবর্তন করতে পারেন।",
      cta: "পুরো এস্ক্রো প্রক্রিয়া দেখুন",
      stepLabel: "ধাপ",
      safe: "GameXchange-এর কাছে নিরাপদে",
    },
    features: {
      eyebrow: "কেন GameXchange",
      title: "ব্যাংকের মতো সুরক্ষা। গেমের মতো অনুভূতি।",
      subtitle: "ভেতরে গুরুত্বপূর্ণ সুরক্ষা, বাইরে দ্রুত ও আনন্দদায়ক অভিজ্ঞতা।",
      f1Title: "প্রকৃত এস্ক্রো সুরক্ষা",
      f1Body:
        "ক্রেতা অ্যাকাউন্ট ঠিক আছে নিশ্চিত না করলে বিক্রেতা আপনার টাকা পান না। চ্যাট ও প্রমাণসহ বিরোধ একজন সত্যিকারের মানুষ পর্যালোচনা করেন।",
      f2Title: "শুধু ভেরিফাইড বিক্রেতা",
      f2Body:
        "ফোন ও NID ভেরিফিকেশনের পরই নীল ব্যাজ পাওয়া যায়। সুনাম আসে সম্পন্ন ডিল থেকে, প্রতিশ্রুতি থেকে নয়।",
      f3Title: "লাইভ, ন্যায্য নিলাম",
      f3Body:
        "সার্ভার-সাইড পারমাণবিক বিড, অ্যান্টি-স্নাইপিং এক্সটেনশন, প্রক্সি বিডিং ও মাস্ক করা বিড হিস্ট্রি। রিফ্রেশ লাগবে না।",
      f4Title: "প্রাইভেট হ্যান্ডওভার চ্যাট",
      f4Body:
        "অর্ডারের ভেতরেই নিরাপদে যোগাযোগ করুন। আমরা কখনো গেম পাসওয়ার্ড চাই না এবং রিকভারি তথ্য সুরক্ষিত করার উপায় জানাই।",
      f5Title: "বিকাশ ও নগদ পেআউট",
      f5Body:
        "স্বচ্ছ ফি-ব্রেকডাউনসহ দ্রুত লোকাল পেআউট। পেমেন্ট থেকে রিলিজ পর্যন্ত প্রতিটি টাকা ট্র্যাক করুন।",
      f6Title: "সপ্তাহে ৭ দিন সাপোর্ট",
      f6Body:
        "ডিলের মাঝে আটকে গেছেন? প্রথম বিড থেকে শেষ পেআউট পর্যন্ত আমাদের টিম এক মেসেজ দূরেই।",
      badge: "ট্রাস্ট লেয়ার",
    },
    testimonials: {
      eyebrow: "কমিউনিটির আস্থা",
      title: "যে ডিল শেষ হয় হ্যান্ডশেকে, মাথাব্যথায় নয়।",
      subtitle:
        "প্রতি মাসে হাজারো বাংলাদেশি গেমার এখানে নিরাপদে লেনদেন করেন। কয়েকজনের কথা শুনুন।",
      t1Name: "রাফিউল হাসান",
      t1Role: "একটি Free Fire অ্যাকাউন্ট কিনেছেন",
      t1Quote:
        "আগে টাকা দেওয়ায় ভয় পেতাম, কিন্তু এস্ক্রো সব সহজ করে দিয়েছে। বিক্রেতা ২০ মিনিটে অ্যাকাউন্ট দিয়েছেন, আর টাকা রিলিজের আগে দুই দিন সবকিছু পরীক্ষা করার সুযোগ পেয়েছি।",
      t2Name: "নুসরাত জাহান",
      t2Role: "একটি eFootball স্কোয়াড বিক্রি করেছেন",
      t2Quote:
        "শুরুতেই ফি-ব্রেকডাউন পরিষ্কার ছিল এবং বিকাশ পেআউট একই দিনে পেয়েছি। ভেরিফাইড বিক্রেতা হিসেবে ক্রেতারা এখন অনেক দ্রুত ভরসা করেন।",
      t3Name: "আহনাফ চৌধুরী",
      t3Role: "একটি PUBG নিলাম জিতেছেন",
      t3Quote:
        "রিফ্রেশ ছাড়াই লাইভ বিড আপডেট হওয়াটা সত্যিই প্রিমিয়াম লেগেছে। ক্লাসে থাকার সময় প্রক্সি বিড সেট করে জিতেছি, অর্ডার সাথে সাথেই ড্যাশবোর্ডে এসেছে।",
      t4Name: "সাদিয়া ইসলাম",
      t4Role: "একটি Valorant অ্যাকাউন্ট কিনেছেন",
      t4Quote:
        "ডেলিভারির পর ছোট একটা সমস্যা হয়েছিল, সেদিন সন্ধ্যাতেই সাপোর্ট এগিয়ে এসেছে। বিরোধ ন্যায্যভাবে সমাধান হয়েছে — তাই দ্বিতীয় অ্যাকাউন্টও এখান থেকেই নিয়েছি।",
      verifiedBuyer: "ভেরিফাইড ক্রেতা",
      dealCompleted: "ডিল সম্পন্ন",
    },
    faq: {
      eyebrow: "প্রশ্নের উত্তর",
      title: "লেনদেনের আগে এগুলো জেনে নিন।",
      subtitle: "নতুন ক্রেতা-বিক্রেতারা সবচেয়ে বেশি যা জিজ্ঞেস করেন, তার সংক্ষিপ্ত উত্তর।",
      items: [
        {
          q: "এস্ক্রো আসলে কী এবং কেন দরকার?",
          a: "এস্ক্রো মানে একজন বিশ্বস্ত তৃতীয় পক্ষ — GameXchange — উভয় পক্ষ ডিল শেষ না করা পর্যন্ত ক্রেতার পেমেন্ট ধরে রাখে। বিক্রেতা জানেন টাকা সত্যিই আছে, ক্রেতা জানেন টাকা নিয়ে কেউ পালাবে না। সমস্যা হলে আমাদের টিম প্রমাণ দেখে রিফান্ড দেয় বা পেআউট ছাড়ে।",
        },
        {
          q: "কীভাবে পেমেন্ট করব? বিকাশ বা নগদ চলবে?",
          a: "হ্যাঁ। অর্ডার দেওয়ার পর আপনি আমাদের অফিসিয়াল বিকাশ ও নগদ মার্চেন্ট নম্বর দেখতে পাবেন, যা অ্যাডমিন সেটিংস থেকে আসে। ওখানে টাকা পাঠিয়ে প্রেরকের নম্বর ও TrxID জমা দিন। কখনোই বিক্রেতাকে সরাসরি টাকা দেবেন না — সেই পেমেন্ট সুরক্ষিত নয়।",
        },
        {
          q: "অ্যাকাউন্ট পাওয়ার পরে কী হয়?",
          a: "আপনি ৪৮ ঘণ্টা যাচাইয়ের সময় পাবেন। পাসওয়ার্ড বদলান, নিজের ইমেইল ও ফোন বাইন্ড করুন, ভালোভাবে পরীক্ষা করুন। সব ঠিক থাকলে Confirm received চাপুন, আমরা বিক্রেতাকে টাকা দেব। না হলে সময় শেষ হওয়ার আগে প্রমাণসহ ডিসপিউট খুলুন।",
        },
        {
          q: "GameXchange কত কমিশন নেয়?",
          a: "ডিফল্ট কমিশন বিক্রয়মূল্যের ৭%, সর্বনিম্ন ৳৫০। এটি বিক্রেতার পেআউট থেকে কাটা হয় এবং কনফার্ম করার আগে পরিষ্কার ব্রেকডাউন দেখানো হয়। অ্যাডমিন সাইট সেটিংসে এটি বদলাতে পারেন, আর হার সবসময় আপনার অর্ডারে দেখা যায়।",
        },
        {
          q: "আপনারা কি কখনো গেম অ্যাকাউন্টের পাসওয়ার্ড চান?",
          a: "কখনোই না। GameXchange-এর কেউ কখনো আপনার গেম পাসওয়ার্ড, OTP বা রিকভারি কোড চাইবে না, আর আমাদের চ্যাট পাসওয়ার্ড সংরক্ষণ করে না। হ্যান্ডওভারের সময় গেমের নিজস্ব ইমেইল/ফোন রিকভারি পরিবর্তন প্রক্রিয়া ব্যবহার করুন যাতে বিক্রেতার অ্যাক্সেস সম্পূর্ণ চলে যায়।",
        },
        {
          q: "ফোন ভেরিফাই না করে কি বিড করা যাবে?",
          a: "না। বিড করার জন্য লগইন করা ও ফোন-ভেরিফাইড অ্যাকাউন্ট লাগে, এবং অ্যাডমিন চালু করলে ফেরতযোগ্য বিড ডিপোজিট লাগে। এতে ভুয়া বিড আটকে যায় এবং প্রকৃত বিক্রেতারা সুরক্ষিত থাকেন। ড্যাশবোর্ড থেকে এক মিনিটেই ফোন ভেরিফাই করতে পারবেন।",
        },
      ],
      stillQuestions: "আরও প্রশ্ন আছে?",
      contact: "আমাদের টিমের সাথে কথা বলুন",
    },
    cta: {
      title: "ভয় ছাড়া লেনদেন শুরু করতে প্রস্তুত?",
      subtitle:
        "হাজারো বাংলাদেশি গেমারের সাথে যুক্ত হোন, যারা সত্যিকারের এস্ক্রো সুরক্ষায় কেনাবেচা করেন। আপনার প্রথম ডিল আজই হতে পারে।",
      primary: "বিনামূল্যে অ্যাকাউন্ট খুলুন",
      secondary: "অ্যাকাউন্ট দেখুন",
      guarantee: "লুকানো ফি নেই · ৪৮ ঘণ্টা যাচাই · সত্যিকারের সাপোর্ট",
    },
  },
  marketplace: {
    eyebrow: "মার্কেটপ্লেস",
    title: "খেলার যোগ্য অ্যাকাউন্ট।",
    subtitle:
      "প্রতিটি লিস্টিং লাইভ হওয়ার আগে পর্যালোচনা করা হয়। গেম, বাজেট ও বিক্রেতার সুনাম দিয়ে আপনার পরের অ্যাকাউন্ট খুঁজুন।",
    searchPlaceholder: "গেম, র‍্যাংক, স্কিন বা বিক্রেতা খুঁজুন…",
    allGames: "সব গেম",
    filters: "ফিল্টার",
    priceRange: "দামের সীমা (৳)",
    min: "সর্বনিম্ন",
    max: "সর্বোচ্চ",
    verifiedOnly: "শুধু ভেরিফাইড বিক্রেতা",
    listingType: "লিস্টিং ধরন",
    allTypes: "সব ধরন",
    fixed: "নির্ধারিত দাম",
    auctionType: "নিলাম",
    sortBy: "সাজান",
    newest: "নতুন আগে",
    priceLow: "দাম: কম থেকে বেশি",
    priceHigh: "দাম: বেশি থেকে কম",
    endingSoon: "শেষ হচ্ছে",
    mostBids: "সবচেয়ে বেশি বিড",
    results: "টি অ্যাকাউন্ট পাওয়া গেছে",
    reset: "ফিল্টার রিসেট",
    gridView: "গ্রিড ভিউ",
    listView: "লিস্ট ভিউ",
    previewNotice: "প্রিভিউ লিস্টিং",
    previewNote:
      "এগুলো অভিজ্ঞতা দেখানোর জন্য ডেমো অ্যাকাউন্ট। লাইভ Supabase লিস্টিং ও চেকআউট ধাপ ৩-এ আসবে।",
    loadMore: "আরও অ্যাকাউন্ট লোড করুন",
    showing: "দেখানো হচ্ছে",
    of: "এর মধ্যে",
    emptyTitle: "কোনো অ্যাকাউন্ট পাওয়া যায়নি",
    emptyBody: "অন্য গেম বেছে নিন বা দামের সীমা বাড়ান।",
    watchAdded: "ওয়াচলিস্টে যোগ হয়েছে",
    watchRemoved: "ওয়াচলিস্ট থেকে সরানো হয়েছে",
    sortLabel: "লিস্টিং সাজান",
    filtersLabel: "লিস্টিং ফিল্টার",
  },
  pages: {
    howItWorks: {
      eyebrow: "GameXchange-এর প্রতিশ্রুতি",
      title: "“আমি চাই” থেকে “এটা আমার” — একটাই নিরাপদ পথ।",
      subtitle:
        "আমরা ক্রেতা ও বিক্রেতার মাঝখানে থাকি, টাকা ধরে রাখি, আর ডিল সম্পন্ন হলেই তা ছাড়ি। ঠিক যা ঘটে, তা এখানে।",
      intro:
        "গেম অ্যাকাউন্ট ট্রেডিংয়ে অচেনা মানুষ, ভুয়া স্ক্রিনশট আর পালিয়ে যাওয়া বিক্রেতা থাকে। এস্ক্রো আস্থার সমস্যাটা দূর করে: কাউকে আগে যেতে হয় না, কারণ পেমেন্ট মাঝখানে GameXchange ধরে রাখে।",
      steps: [
        {
          title: "অ্যাকাউন্ট অর্ডার করুন",
          body: "নির্ধারিত দামে কিনুন বা নিলামে জিতুন। সাথে সাথেই অর্ডার তৈরি হয় এবং লিস্টিং লক হয়, যাতে অন্য কেউ কিনতে না পারে।",
        },
        {
          title: "GameXchange-কে পেমেন্ট পাঠান",
          body: "অর্ডারে দেখানো অফিসিয়াল বিকাশ বা নগদ নম্বর ব্যবহার করুন। প্রেরকের নম্বর, ট্রানজেকশন আইডি ও স্ক্রিনশট জমা দিন। বিক্রেতাকে সরাসরি টাকা দিতে আমরা কখনো বলি না।",
        },
        {
          title: "আমরা পেমেন্ট যাচাই করি",
          body: "আমাদের টিম লেনদেন মিলিয়ে পেমেন্ট কনফার্ম করে, সাপোর্ট সময়ে সাধারণত কয়েক মিনিটে। অর্ডার পরের ধাপে যেতে দেখবেন।",
        },
        {
          title: "প্রাইভেট হ্যান্ডওভার",
          body: "ক্রেতা-বিক্রেতা অর্ডারের প্রাইভেট চ্যাটে সমন্বয় করেন। গেমের অফিসিয়াল রিকভারি প্রক্রিয়ায় অ্যাকাউন্টের ইমেইল ও ফোন নিজের করে নিন। চ্যাটে কখনো পাসওয়ার্ড শেয়ার করবেন না।",
        },
        {
          title: "৪৮ ঘণ্টা যাচাই",
          body: "অ্যাকাউন্ট পরীক্ষা করুন, লগইন করুন, আইটেম ও র‍্যাংক দেখুন। কিছু ভুল থাকলে সময় শেষের আগে প্রমাণসহ ডিসপিউট খুলুন।",
        },
        {
          title: "পেআউট রিলিজ",
          body: "আপনি রিসিভ কনফার্ম করুন। আমরা কমিশন বাদ দিয়ে বিক্রেতাকে বিকাশ বা নগদে টাকা দিই। দুই পক্ষ একে অপরকে রিভিউ দিয়ে সুনাম গড়তে পারেন।",
        },
      ],
      feesTitle: "স্বচ্ছ ফি, কোনো চমক নয়",
      feesBody: "কমিশন বিক্রেতার পেআউট থেকে কাটা হয়, ক্রেতার দামের সাথে যোগ হয় না।",
      feesPoints: [
        "ডিফল্ট কমিশন: বিক্রয়মূল্যের ৭%",
        "সর্বনিম্ন কমিশন: প্রতি সম্পন্ন অর্ডারে ৳৫০",
        "উদাহরণ: ৳১০,০০০ বিক্রয়ে কমিশন ৳৭০০, বিক্রেতা পান ৳৯,৩০০",
        "পেআউট রিলিজের আগে সঠিক ব্রেকডাউন দেখানো হয়",
        "ব্যর্থ বা বাতিল অর্ডারে কমিশন নেই",
      ],
      safetyTitle: "যে নিরাপত্তা নিয়ম কখনো বদলায় না",
      safetyPoints: [
        "কখনো বিক্রেতাকে সরাসরি টাকা দেবেন না — শুধু অফিসিয়াল GameXchange নম্বরে দিন",
        "চ্যাটে গেম পাসওয়ার্ড, OTP বা রিকভারি কোড শেয়ার করবেন না",
        "হ্যান্ডওভারের সময় অ্যাকাউন্টের ইমেইল ও ফোন বদলান",
        "সব আলোচনা ও প্রমাণ অর্ডারের ভেতরেই রাখুন",
        "কেউ প্ল্যাটফর্মের বাইরে ডিল করতে বললে রিপোর্ট করুন",
      ],
      ctaTitle: "বাস্তবে দেখুন",
      ctaBody: "লাইভ লিস্টিং দেখুন এবং আজই আপনার প্রথম সুরক্ষিত ডিল শুরু করুন।",
      cta: "মার্কেটপ্লেস দেখুন",
    },
    about: {
      eyebrow: "GameXchange সম্পর্কে",
      title: "গেমাররা যে মধ্যস্থতাকারীকেই চেয়েছিল, আমরা সেটাই বানিয়েছি।",
      subtitle:
        "লোকাল সমস্যার লোকাল সমাধান: প্রতারণা ছাড়া বাংলাদেশে গেম অ্যাকাউন্ট কেনাবেচা।",
      storyTitle: "আমাদের গল্প",
      story1:
        "GameXchange শুরু হয়েছিল একটি সহজ পর্যবেক্ষণ থেকে: বাংলাদেশের গেমাররা প্রতিদিন ফেসবুক গ্রুপ ও ডিসকর্ডে অ্যাকাউন্ট কেনাবেচা করতেন, হাতে থাকত শুধু স্ক্রিনশট আর ভরসা। ক্রেতা আগে বিকাশ পাঠিয়ে অ্যাকাউন্ট পাননি। বিক্রেতা অ্যাকাউন্ট দিয়ে টাকা পাননি। এর চেয়ে ভালো উপায় থাকতেই হবে।",
      story2:
        "তাই আমরা একটি সঠিক এস্ক্রো স্তর বানালাম: ক্রেতা আমাদের টাকা দেন, আমরা যাচাই করি, দুই পক্ষ নিরাপদে হ্যান্ডওভার করেন, আর ক্রেতা কনফার্ম করার পরেই টাকা যায়। যোগ হলো ভেরিফাইড বিক্রেতা,structured ডিসপিউট, লাইভ নিলাম ও স্বচ্ছ ফি মডেল। আজ পুরো প্ল্যাটফর্ম এক প্রতিশ্রুতিতে দাঁড়িয়ে — অচেনা মানুষকে ভরসা করতে হবে না, প্রক্রিয়াটাকে করা যায়।",
      valuesTitle: "আমরা যা বিশ্বাস করি",
      values: [
        {
          title: "গতির আগে নিরাপত্তা",
          body: "একটি প্রতারণা ঠেকাতে চেকআউট কিছুটা ধীর হলে সেটা মূল্যবান। প্রতিটি ফ্লো এমনভাবে তৈরি যাতে টাকা যাওয়ার আগে দুই পক্ষ যাচাই করতে পারে।",
        },
        {
          title: "সম্পূর্ণ স্বচ্ছতা",
          body: "ফি, সময়সীমা ও নিয়ম শুরুতে দেখা যায়। লুকানো চার্জ নেই, অস্পষ্ট ডিসপিউট ফলাফল নেই, ছোট অক্ষরের ফাঁদ নেই।",
        },
        {
          title: "লোকাল সবার আগে",
          body: "বিকাশ ও নগদ, বাংলা ও ইংরেজি, BDT দাম এবং বাংলাদেশের খেলার সময়ের সাথে মিলে যাওয়া সাপোর্ট।",
        },
      ],
      numbersTitle: "এখন পর্যন্ত কমিউনিটি",
      ctaTitle: "যারা নিরাপত্তাকে গুরুত্ব দেন, তাদের সাথে লেনদেন করুন",
      cta: "GameXchange-এ যোগ দিন",
    },
    contact: {
      eyebrow: "যোগাযোগ",
      title: "সত্যিকারের মানুষ, সাহায্যের জন্য প্রস্তুত।",
      subtitle:
        "পেমেন্ট সমস্যা, আটকে থাকা অর্ডার বা সন্দেহজনক লিস্টিং? বিস্তারিত পাঠান, এক কর্মদিবসের মধ্যে উত্তর দেব।",
      email: "ইমেইল",
      emailValue: "support@gamexchange.com.bd",
      hours: "সাপোর্ট সময়",
      hoursValue: "প্রতিদিন, ১০:০০ – ২৩:০০ (GMT+6)",
      response: "সাধারণ উত্তর সময়",
      responseValue: "৬ ঘণ্টার কম",
      formTitle: "বার্তা পাঠান",
      name: "আপনার নাম",
      emailField: "ইমেইল ঠিকানা",
      subject: "বিষয়",
      message: "কীভাবে সাহায্য করতে পারি?",
      subjectOptions: {
        payment: "পেমেন্ট বা পেআউট",
        order: "অর্ডার বা ডিসপিউট",
        listing: "লিস্টিং রিপোর্ট",
        account: "অ্যাকাউন্ট বা ভেরিফিকেশন",
        other: "অন্য কিছু",
      },
      submit: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে…",
      success: "বার্তা পেয়েছি। আমাদের টিম শীঘ্রই ইমেইলে উত্তর দেবে।",
      error: "কিছু ভুল হয়েছে। অনুগ্রহ করে সরাসরি ইমেইল করুন।",
      faqPrompt: "দ্রুত উত্তর খুঁজছেন?",
      faqLink: "সাধারণ প্রশ্ন পড়ুন",
    },
    terms: {
      eyebrow: "আইনি",
      title: "শর্তাবলি",
      updated: "সর্বশেষ হালনাগাদ: ৪ নভেম্বর ২০২৬",
      intro:
        "এই শর্তাবলি GameXchange ব্যবহার নিয়ন্ত্রণ করে। অ্যাকাউন্ট তৈরি বা মার্কেটপ্লেস ব্যবহার করলে আপনি এতে সম্মত হচ্ছেন। বিশেষ করে গেম প্রকাশকের নিয়ম সম্পর্কিত অংশটি সম্পূর্ণ পড়ুন।",
      sections: [
        {
          title: "১. আমরা কারা",
          body: [
            "GameXchange একটি স্বতন্ত্র এস্ক্রো মার্কেটপ্লেস, যা বাংলাদেশে গেম অ্যাকাউন্ট কেনাবেচায় সাহায্য করে। আমরা ক্রেতা বা বিক্রেতা নই, এবং কোনো গেম প্রকাশকের সাথে সম্পর্কিত, অনুমোদিত বা স্পনসরকৃত নই।",
          ],
        },
        {
          title: "২. যোগ্যতা",
          body: [
            "আপনার বয়স কমপক্ষে ১৮ হতে হবে এবং চুক্তি করার আইনি যোগ্যতা থাকতে হবে। কার্যকর ফোন নম্বর দিতে হবে, অ্যাকাউন্ট নিরাপদ রাখতে হবে এবং বিক্রয়ের আগে পরিচয় যাচাই সম্পন্ন করতে হবে।",
          ],
        },
        {
          title: "৩. গেম প্রকাশকের নিয়ম",
          body: [
            "অনেক গেম প্রকাশক তাদের সেবার শর্তে অ্যাকাউন্ট ট্রেডিং নিষিদ্ধ বা সীমাবদ্ধ করে। GameXchange সেই নিয়ম ভাঙতে উৎসাহ দেয় না। আপনি ট্রেড করলে নিজ দায়িত্বে করবেন এবং মেনে নেবেন যে প্রকাশক অ্যাকাউন্ট স্থগিত, ব্যান বা ফিরিয়ে নিতে পারেন। প্রকাশকের এমন পদক্ষেপ GameXchange ফেরাতে পারে না।",
          ],
        },
        {
          title: "৪. এস্ক্রো ও পেমেন্ট",
          body: [
            "ক্রেতারা বিক্রেতাকে নয়, GameXchange-কে পেমেন্ট করেন। ক্রেতা রিসিভ কনফার্ম করা বা ডিসপিউট নিষ্পত্তি হওয়া পর্যন্ত আমরা টাকা ধরে রাখি। পেমেন্ট নির্দেশনা অর্ডারে দেখা যায় এবং ব্যাংক বা মোবাইল-মানি তথ্য বদলালে পরিবর্তিত হতে পারে। সবসময় নিজের অর্ডার পেজে দেখানো নম্বর ব্যবহার করুন।",
            "নির্দিষ্ট সময়ের মধ্যে অর্ডার পেমেন্ট করতে হবে। অপরিশোধিত অর্ডার বাতিল হতে পারে এবং বারবার না-দিলে অ্যাকাউন্টে বিধিনিষেধ আসতে পারে।",
          ],
        },
        {
          title: "৫. কমিশন ও পেআউট",
          body: [
            "বিক্রেতার পেআউট থেকে কমিশন কাটা হয়। ডিফল্ট ৭%, সর্বনিম্ন ৳৫০, এবং রিলিজের আগে সঠিক পরিমাণ দেখানো হয়। সম্পন্ন হওয়া ও প্রয়োজনীয় পর্যালোচনার পর বিক্রেতার ভেরিফাইড বিকাশ বা নগদ নম্বরে পেআউট দেওয়া হয়।",
          ],
        },
        {
          title: "৬. হ্যান্ডওভার ও যাচাই",
          body: [
            "ক্রেতা ও বিক্রেতা অর্ডার চ্যাটের ভেতরেই সমন্বয় করবেন। কখনো গেম পাসওয়ার্ড, OTP বা রিকভারি কোড শেয়ার করবেন না। গেমের অফিসিয়াল অ্যাকাউন্ট রিকভারি বা বাইন্ডিং পরিবর্তন প্রক্রিয়া ব্যবহার করুন যাতে মালিকানা সত্যিই হস্তান্তর হয়। GameXchange কখনো আপনার গেম পাসওয়ার্ড চায় না।",
          ],
        },
        {
          title: "৭. ডিসপিউট",
          body: [
            "ডেলিভারির পর ক্রেতার ৪৮ ঘণ্টা সময় থাকে অ্যাকাউন্ট যাচাই করে প্রমাণসহ ডিসপিউট খোলার। আমাদের টিম অতিরিক্ত প্রমাণ চাইতে পারে এবং লিস্টিং, চ্যাট ও প্রমাণ দেখে সৎ বিশ্বাসে সিদ্ধান্ত নেবে। সিদ্ধান্তে রিলিজ, আংশিক রিফান্ড বা সম্পূর্ণ রিফান্ড থাকতে পারে।",
          ],
        },
        {
          title: "৮. নিষিদ্ধ আচরণ",
          body: [
            "প্রতারণা, শিল বিডিং, ভুয়া পেমেন্ট প্রমাণ, চার্জব্যাক, হয়রানি, অ্যাকাউন্ট দখল, চুরি করা অ্যাকাউন্ট আপলোড এবং প্ল্যাটফর্মের বাইরে ডিল সরানোর চেষ্টা নিষিদ্ধ। আমরা অ্যাকাউন্ট স্থগিত করতে, তদন্তকালে পেআউট আটকে রাখতে এবং অবৈধ কার্যকলাপ কর্তৃপক্ষকে জানাতে পারি।",
          ],
        },
        {
          title: "৯. দায়সীমা",
          body: [
            "সেবা “যেমন আছে” ভিত্তিতে দেওয়া হয়। আইনের সর্বোচ্চ অনুমোদিত সীমা পর্যন্ত, GameXchange পরোক্ষ বা ফলশ্রুত ক্ষতি, প্রকাশকের ব্যান, বা হ্যান্ডওভারের পর অ্যাকাউন্ট সুরক্ষিত না করার কারণে ক্ষতির দায় বহন করে না। যেকোনো অর্ডারে আমাদের মোট দায় সেই অর্ডারের এস্ক্রোতে থাকা পরিমাণে সীমাবদ্ধ।",
          ],
        },
        {
          title: "১০. পরিবর্তন ও যোগাযোগ",
          body: [
            "আমরা এই শর্তাবলি হালনাগাদ করতে পারি এবং নতুন তারিখসহ প্রকাশ করব। ব্যবহার চালিয়ে যাওয়া মানে সম্মতি। প্রশ্ন পাঠান support@gamexchange.com.bd-এ।",
          ],
        },
      ],
    },
    privacy: {
      eyebrow: "আইনি",
      title: "প্রাইভেসি পলিসি",
      updated: "সর্বশেষ হালনাগাদ: ৪ নভেম্বর ২০২৬",
      intro:
        "একটি নিরাপদ এস্ক্রো মার্কেটপ্লেস চালানোর জন্য যতটুকু তথ্য দরকার, ততটুকুই আমরা সংগ্রহ করি এবং আপনার পেমেন্টের মতোই তা সুরক্ষিত রাখি। এই নীতিতে ব্যাখ্যা আছে কী সংগ্রহ করি, কেন, এবং আপনার কী অধিকার।",
      sections: [
        {
          title: "১. আমরা যা সংগ্রহ করি",
          body: [
            "অ্যাকাউন্ট তথ্য: নাম, ইমেইল, ফোন নম্বর, পাসওয়ার্ড হ্যাশ ও বয়স নিশ্চিতকরণ। ট্রেডিং তথ্য: লিস্টিং, অর্ডার, বিড, চ্যাট বার্তা, পেমেন্ট প্রেরকের নম্বর ও ট্রানজেকশন আইডি।",
            "যাচাই তথ্য: বিক্রেতা KYC-এর জন্য দেওয়া NID ছবি, যা সীমিত অ্যাক্সেসসহ প্রাইভেট বাকেটে রাখা হয়। প্রযুক্তিগত তথ্য: ডিভাইস, ব্রাউজার, IP ও নিরাপত্তা লগ — প্রতারণা প্রতিরোধ ও রেট লিমিটিংয়ের জন্য।",
          ],
        },
        {
          title: "২. কীভাবে ব্যবহার করি",
          body: [
            "এস্ক্রো অর্ডার চালানো, পেমেন্ট যাচাই, প্রতারণা ও শিল বিডিং প্রতিরোধ, ডিসপিউট নিষ্পত্তি, বিক্রেতাকে পেআউট, আইনি বাধ্যবাধকতা পালন এবং আউটবিড অ্যালার্ট ও শেষ হওয়ার রিমাইন্ডারের মতো লেনদেনমূলক নোটিফিকেশন পাঠাতে।",
          ],
        },
        {
          title: "৩. যা কখনো সংরক্ষণ করি না",
          body: [
            "আমরা গেম অ্যাকাউন্টের পাসওয়ার্ড, OTP বা রিকভারি কোড সংরক্ষণ করি না। চ্যাটে পাঠাবেন না বা প্ল্যাটফর্মে কোথাও আপলোড করবেন না। আমাদের কর্মীরা কখনো এগুলো চাইবেন না।",
          ],
        },
        {
          title: "৪. তথ্য শেয়ার",
          body: [
            "পেমেন্ট প্রোভাইডার, ইমেইল/SMS ডেলিভারি, হোস্টিং ও নিরাপত্তা সেবাদাতার সাথে প্রয়োজনীয় ন্যূনতম তথ্য শেয়ার করি। আমরা ব্যক্তিগত তথ্য বিক্রি করি না। আইনগত বাধ্যবাধকতা বা প্রতারণা তদন্তের প্রয়োজনে তথ্য প্রকাশ করতে পারি।",
          ],
        },
        {
          title: "৫. সংরক্ষণ ও নিরাপত্তা",
          body: [
            "আমরা Row Level Security, এনক্রিপ্টেড সংযোগ, সর্বনিম্ন অ্যাক্সেস ও অডিট লগ ব্যবহার করি। KYC ফাইল ও পেমেন্ট প্রমাণ প্রাইভেট। আপনার অ্যাকাউন্ট সক্রিয় থাকাকালীন এবং আইনি, হিসাব ও ডিসপিউট প্রয়োজনে তার পরেও যুক্তিসঙ্গত সময় তথ্য রাখা হয়।",
          ],
        },
        {
          title: "৬. আপনার অধিকার",
          body: [
            "ড্যাশবোর্ড থেকে বেশিরভাগ প্রোফাইল তথ্য দেখা ও পরিবর্তন করতে পারেন। তথ্যের কপি, সংশোধন বা মুছতে support@gamexchange.com.bd-এ যোগাযোগ করুন। আইনে যেখানে প্রয়োজন, কিছু রেকর্ড রাখা হতে পারে।",
          ],
        },
        {
          title: "৭. কুকিজ",
          body: [
            "আমরা লগইন, থিম ও ভাষা পছন্দ এবং রেট লিমিটিং নিরাপত্তার জন্য প্রয়োজনীয় কুকি ব্যবহার করি। বিজ্ঞাপন ট্র্যাকার ব্যবহার করি না।",
          ],
        },
        {
          title: "৮. যোগাযোগ",
          body: [
            "প্রাইভেসি প্রশ্ন: privacy@gamexchange.com.bd। সাধারণ সাপোর্ট: support@gamexchange.com.bd।",
          ],
        },
      ],
    },
    refunds: {
      eyebrow: "আইনি",
      title: "রিফান্ড ও ডিসপিউট পলিসি",
      updated: "সর্বশেষ হালনাগাদ: ৪ নভেম্বর ২০২৬",
      intro:
        "ডিল ভুল হলে কী হবে — দুই পক্ষ এটি জানলেই এস্ক্রো কাজ করে। এই নীতিতে রিফান্ডের নিয়ম, সময়সীমা ও প্রমাণ ব্যাখ্যা করা আছে।",
      sections: [
        {
          title: "১. আপনার যাচাইয়ের সময়",
          body: [
            "বিক্রেতা অ্যাকাউন্ট ডেলিভারি দেওয়ার পর ক্রেতার ৪৮ ঘণ্টা সময় থাকে যাচাইয়ের। এই সময়ে রিসিভ কনফার্ম বা ডিসপিউট খুলতে পারেন। কিছু না করলে অর্ডার স্বয়ংক্রিয়ভাবে সম্পন্ন হতে পারে এবং পেআউট রিলিজ হতে পারে।",
          ],
        },
        {
          title: "২. কখন ডিসপিউট খুলতে পারেন",
          body: [
            "অ্যাকাউন্ট ডেলিভারি না হলে, লিস্টিংয়ের সাথে না মিললে, বিক্রেতা অ্যাকাউন্ট ফিরিয়ে নিলে, ডেলিভারির আগে থেকেই থাকা কারণে স্থায়ী ব্যান হলে, বা বিক্রেতা অতিরিক্ত টাকা চাইলে ডিসপিউট খুলুন। স্ক্রিনশট, স্ক্রিন রেকর্ডিং, চ্যাট লগ ও এরর মেসেজ দিন।",
          ],
        },
        {
          title: "৩. যা কভার হয় না",
          body: [
            "প্রকাশকের নিয়ম পরিবর্তন, হ্যান্ডওভারের পর আপনার নিজের কাজে ব্যান, ক্রেতার মন পরিবর্তন, বা পাসওয়ার্ড/OTP শেয়ার করার কারণে ক্ষতি। GameXchange-এর বাইরে সরাসরি বিক্রেতাকে টাকা দিলে আমরা সেই টাকা ফেরাতে পারি না।",
          ],
        },
        {
          title: "৪. আমরা কীভাবে সিদ্ধান্ত নিই",
          body: [
            "আমাদের টিম লিস্টিং, অর্ডার চ্যাট, পেমেন্ট রেকর্ড ও দুই পক্ষের প্রমাণ পর্যালোচনা করে। প্রয়োজনে লাইভ স্ক্রিন শেয়ার বা অতিরিক্ত প্রমাণ চাইতে পারি। লক্ষ্য ৩ কর্মদিবসের মধ্যে সিদ্ধান্ত, এবং অর্ডারে দুই পক্ষকে জানানো হয়।",
          ],
        },
        {
          title: "৫. সম্ভাব্য ফলাফল",
          body: [
            "ক্রেতাকে সম্পূর্ণ রিফান্ড, আংশিক রিফান্ড, বিক্রেতাকে রিলিজ, বা অ্যাকাউন্ট ফেরত/রিভার্স। অর্ডার রিফান্ড হলে কমিশন আনুপাতিকভাবে ফেরত হয়। প্রতারণামূলক দাবিতে অ্যাকাউন্ট স্থগিত হতে পারে।",
          ],
        },
        {
          title: "৬. রিফান্ডের সময়",
          body: [
            "অনুমোদিত রিফান্ড মূল পেমেন্ট পদ্ধতি বা আপনার ভেরিফাইড বিকাশ/নগদ নম্বরে ৩–৫ কর্মদিবসে পাঠানো হয়। ব্যাংক বিলম্ব সময় বাড়াতে পারে। রিফান্ড অর্ডারে রেকর্ড দেখা যাবে।",
          ],
        },
        {
          title: "৭. চার্জব্যাক",
          body: [
            "চার্জব্যাক করার আগে আমাদের সাথে যোগাযোগ করুন। ডেলিভারির পর চার্জব্যাক প্রতারণা হিসেবে বিবেচিত হতে পারে এবং তদন্তকালে আপনার অ্যাকাউন্ট স্থগিত হতে পারে।",
          ],
        },
        {
          title: "৮. আপিল",
          body: [
            "নতুন প্রমাণসহ ৭ দিনের মধ্যে সিদ্ধান্তের আপিল করতে পারেন। সম্ভব হলে অন্য মডারেটর আপিল পর্যালোচনা করেন। disputes@gamexchange.com.bd-এ অর্ডার নম্বরসহ যোগাযোগ করুন।",
          ],
        },
      ],
    },
  },
  sellPage: {
    eyebrow: "GameXchange-এ বিক্রি করুন",
    title: "আপনার অ্যাকাউন্টকে নিরাপদ পেআউটে পরিণত করুন।",
    subtitle:
      "লিস্টিং তৈরি করুন, স্ক্রিনশট ও ছোট ভিডিও যোগ করুন, ভেরিফাইড ক্রেতারা খুঁজে নিক। প্রথম ক্লিক থেকে শেষ রিলিজ পর্যন্ত আপনার টাকা সুরক্ষিত।",
    previewNote:
      "ডেমো ফর্ম: লিস্টিং ও নিরাপদ মিডিয়া স্টোরেজ ধাপ ৩-এ Supabase-এ যুক্ত হবে। প্রিভিউ এখনই আপনার ব্রাউজারে পুরোপুরি কাজ করে।",
    stepsTitle: "বিক্রি যেভাবে কাজ করে",
    step1: "ছবি ও ছোট ভিডিওসহ লিস্টিং তৈরি করুন",
    step2: "একবার ফোন ও NID ভেরিফিকেশন সম্পন্ন করুন",
    step3: "অর্ডার চ্যাটের ভেতরে নিরাপদে হ্যান্ডওভার করুন",
    step4: "যাচাইয়ের পর বিকাশ বা নগদে টাকা পান",
    formTitle: "অ্যাকাউন্টের তথ্য",
    formSubtitle:
      "সত্যিকারের স্ক্রিনশট ও সৎ তথ্য থাকলে ক্রেতারা দ্রুত ভরসা করেন।",
    gameLabel: "গেম",
    typeLabel: "লিস্টিং ধরন",
    typeFixed: "নির্ধারিত দাম",
    typeFixedHint: "আপনার দামে সাথে সাথে বিক্রি করুন।",
    typeAuction: "নিলাম",
    typeAuctionHint: "ক্রেতারা বিড করবে। শুরুর দাম আপনি ঠিক করবেন।",
    titleLabel: "লিস্টিং শিরোনাম",
    titlePlaceholder:
      "যেমন: গ্র্যান্ডমাস্টার · ১২টি মিথিক স্কিন · ফুল ইমেইল অ্যাক্সেস",
    descriptionLabel: "বিবরণ",
    descriptionPlaceholder:
      "র‍্যাংক, স্কিন, লেভেল, লিংক করা ইমেইল, ব্যান হিস্ট্রি — ক্রেতার যা জানা দরকার সব লিখুন…",
    priceLabel: "আপনার দাম (৳)",
    startingBidLabel: "শুরুর বিড (৳)",
    buyNowLabel: "বাই-নাউ দাম (৳, ঐচ্ছিক)",
    levelLabel: "অ্যাকাউন্ট লেভেল",
    rankLabel: "সর্বোচ্চ র‍্যাংক",
    platformLabel: "প্ল্যাটফর্ম / সার্ভার",
    detailsTitle: "ছবি ও ভিডিও",
    detailsSubtitle:
      "প্রথম ছবিটিই কভার হবে। ছোট ভিডিও থাকলে লিস্টিং লক্ষণীয়ভাবে দ্রুত বিক্রি হয়।",
    imagesLabel: "স্ক্রিনশট",
    imagesHint: "সর্বোচ্চ ৮টি ছবি · JPG, PNG বা WebP · প্রতিটি ৮ MB",
    videoLabel: "ছোট ভিডিও",
    videoHint: "১টি ভিডিও · MP4, WebM বা MOV · ৫০ MB · সর্বোচ্চ ২ মিনিট",
    dropImages: "স্ক্রিনশট এখানে টেনে আনুন, বা ক্লিক করে বেছে নিন",
    dropVideo: "ছোট ভিডিও এখানে টেনে আনুন, বা ক্লিক করে বেছে নিন",
    dropActive: "যোগ করতে ছেড়ে দিন",
    browse: "ফাইল দেখুন",
    cover: "কভার",
    setCover: "কভার হিসেবে সেট করুন",
    remove: "সরান",
    preparing: "প্রিভিউ তৈরি হচ্ছে…",
    ready: "প্রস্তুত",
    imageTooLarge: "ছবিটি ৮ MB-এর চেয়ে বড়।",
    videoTooLarge: "ভিডিওটি ৫০ MB-এর চেয়ে বড়।",
    wrongImageType: "শুধু JPG, PNG ও WebP ছবি অনুমোদিত।",
    wrongVideoType: "শুধু MP4, WebM ও MOV ভিডিও অনুমোদিত।",
    videoTooLong: "ভিডিও সর্বোচ্চ ২ মিনিট হতে পারবে।",
    tooManyImages: "সর্বোচ্চ ৮টি স্ক্রিনশট আপলোড করা যাবে।",
    oneVideoOnly: "প্রতি লিস্টিংয়ে শুধু একটি ভিডিও দেওয়া যাবে।",
    readFailed: "ফাইলটি পড়া যায়নি। অন্য একটি ফাইল চেষ্টা করুন।",
    localPreviewNote:
      "ফাইলগুলো আপাতত আপনার ব্রাউজারেই থাকে। ধাপ ৩-এ Supabase-এর সাথে এনক্রিপ্টেড প্রাইভেট স্টোরেজ যুক্ত হবে।",
    confirmOwnership:
      "এই অ্যাকাউন্টটি আমার, এতে কোনো সক্রিয় ব্যান, রিকভারি বিরোধ বা বাকি নেই।",
    confirmTerms:
      "আমি বুঝি অ্যাকাউন্ট ট্রেডিং গেম প্রকাশকের শর্তভঙ্গ হতে পারে এবং আমি নিজ দায়িত্বে বিক্রি করছি।",
    submit: "লিস্টিং ড্রাফট সংরক্ষণ করুন",
    submitting: "ড্রাফট সংরক্ষণ হচ্ছে…",
    requiredFields:
      "শিরোনাম, দাম, অন্তত একটি স্ক্রিনশট দিন এবং দুটি নিশ্চিতকরণে টিক দিন।",
    submittedTitle: "ড্রাফট লোকালি সংরক্ষিত",
    submittedBody:
      "তথ্যগুলো ঠিক আছে। আসল লিস্টিং তৈরি, অ্যাডমিন রিভিউ ও প্রাইভেট মিডিয়া স্টোরেজ ধাপ ৩-এ আসবে।",
    createAnother: "আরেকটি ড্রাফট সম্পাদনা করুন",
    feeTitle: "পেআউট হিসাব",
    feeSalePrice: "বিক্রয়মূল্য",
    feeCommission: "কমিশন (৭%, সর্বনিম্ন ৳৫০)",
    feeYouReceive: "আপনি পাবেন",
    feeNote:
      "কমিশন আপনার পেআউট থেকে কাটা হয়, ক্রেতার দামের সাথে যোগ হয় না।",
    safetyTitle: "বিক্রেতার নিরাপত্তা",
    safety1: "চ্যাটে কখনো গেম পাসওয়ার্ড, OTP বা রিকভারি কোড শেয়ার করবেন না।",
    safety2:
      "হ্যান্ডওভারের সময় ক্রেতাকে ইমেইল ও ফোন বদলাতে সাহায্য করুন।",
    safety3: "সব আলোচনা ও প্রমাণ অর্ডারের ভেতরেই রাখুন।",
    safety4:
      "অ্যাকাউন্টে স্ট্রাইক এড়াতে প্রতিশ্রুত সময়ের মধ্যে ডেলিভারি দিন।",
    needHelp: "লিস্টিং তৈরি করতে সাহায্য লাগবে?",
    contactSupport: "সাপোর্টে যোগাযোগ করুন",
  },
  notFound: {
    code: "৪০৪",
    title: "এই অ্যাকাউন্ট লবি ছেড়ে চলে গেছে।",
    subtitle:
      "আপনি যে পেজ খুঁজছেন তা বিক্রি হয়েছে, সরানো হয়েছে, বা কখনো ছিলই না। চলুন খেলার মতো কিছুতে ফিরে যাই।",
    home: "হোমে ফিরুন",
    marketplace: "অ্যাকাউন্ট দেখুন",
  },
  authPlaceholder: {
    badge: "ধাপ ২-এ আসছে",
    title: "নিরাপদ সাইন-ইন তৈরি হচ্ছে।",
    subtitle:
      "ভিজ্যুয়াল ভিত্তি প্রস্তুত। ইমেইল/পাসওয়ার্ড লগইন, গুগল লগইন, ফোন ভেরিফিকেশন ও আলাদা অ্যাডমিন পোর্টাল ধাপ ২-এ যুক্ত হবে।",
    back: "হোমে ফিরুন",
    explore: "মার্কেটপ্লেস দেখুন",
  },
};
