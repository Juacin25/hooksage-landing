import { plansFor } from "./plan";
export const englishFaqs = [
  {
    question: "Who is Hooksage for?",
    answer:
      "Startups and small businesses that already shoot content but don't have a full-time video editor. It's also for founders, marketing teams and people building a personal brand around their services, courses or expertise. We're welcoming early interest from teams in the US and UK, as well as Latin America.",
  },
  {
    question: "What will it do with my footage?",
    answer:
      "We're building a workflow that turns raw footage into a 15-second vertical video. The focus is on choosing the right cuts, setting the pace, using zooms thoughtfully and adding readable, well-timed captions.",
  },
  {
    question: "How is this different from a general-purpose AI editing tool?",
    answer:
      "The goal is to handle the edit from start to finish, with decisions suited to short-form video. You should be able to focus on your message and get a coherent video back, without writing detailed instructions or fixing every cut. That's the quality we'll be testing during early trials.",
  },
  {
    question: "Where will I be able to use the videos?",
    answer:
      "The output will be a 15-second vertical video in 9:16 format, made for Instagram Reels, TikTok and YouTube Shorts. You can also use it on other channels that support that format. You stay in charge of posting; automatic publishing isn't part of this offer.",
  },
  {
    question: "When can I try it, and what does it cost?",
    answer:
      "We're preparing early trials and haven't set a launch date yet. Joining the waitlist is free and doesn't require a card. Sign up for your first free video when access opens. " +
      plansFor("en")
        .map(
          (plan) =>
            plan.name +
            ": US$" +
            plan.monthlyPriceUSD +
            " per month, with " +
            plan.weeklyExports +
            " video exports per week",
        )
        .join(". ") +
      ". Prices are in US dollars, billed monthly. Export allowances reset weekly.",
  },
  {
    question: "What happens when I submit the form?",
    answer:
      "We'll save your details and email you when you can try Hooksage. You don't need to upload footage now, and joining doesn't start a subscription. WhatsApp is optional. If you'd like us to contact you there too, include your number with its country code.",
  },
];
export const englishBusinesses: Record<
  string,
  {
    name: string;
    singular: string;
    tone: string;
    headline: string;
    description: string;
    ideas: string[];
    seo: string;
    sample: string;
    metaTitle: string;
    metaDescription: string;
  }
> = {
  startups: {
    name: "Startups",
    singular: "Startup",
    tone: "Talking head",
    headline: "Explain what you're building.",
    description:
      "A demo, a product update or the story behind your business. Turn your team's footage into short videos without hiring a full-time editor.",
    ideas: [
      "The problem your product solves",
      "A new feature, shown on screen",
      "A founder sharing one idea to camera",
    ],
    seo: "Videos for startups",
    sample: "Your product, in 15 seconds.",
    metaTitle: "Short-form video editing for startups | Hooksage",
    metaDescription:
      "Turn your startup's raw footage into short videos with cuts, zooms and captions. Join the Hooksage waitlist. First video free when access opens.",
  },
  pymes: {
    name: "Small businesses",
    singular: "Small business",
    tone: "Product",
    headline: "Show what you do. Spend less time editing.",
    description:
      "For small businesses that already film their work and want to post more consistently. Your product, service and team all have a story to share.",
    ideas: [
      "How your product or service works",
      "An answer to a common customer question",
      "The process behind your work",
    ],
    seo: "Videos for small businesses",
    sample: "What you do, clearly told.",
    metaTitle: "Video editing for small businesses | Hooksage",
    metaDescription:
      "Turn footage of your business into short videos with cuts, zooms and captions. Join the Hooksage waitlist. First video free when access opens.",
  },
  "marca-personal": {
    name: "Personal brands",
    singular: "Personal brand",
    tone: "Educational",
    headline: "Your expertise deserves to leave the drafts.",
    description:
      "For people who sell services, courses or knowledge. Turn an explanation, a useful tip or a conversation into a short video without doing every edit yourself.",
    ideas: [
      "One practical tip from your field",
      "A question your clients often ask",
      "An idea from your course or workshop",
    ],
    seo: "Videos for personal brands",
    sample: "One clear idea. Fifteen seconds.",
    metaTitle: "Video editing for personal brands | Hooksage",
    metaDescription:
      "Share your expertise in short videos with clear captions, thoughtful cuts and zooms. Join the Hooksage waitlist for your first free video.",
  },
  "equipos-de-marketing": {
    name: "Marketing teams",
    singular: "Marketing team",
    tone: "Team",
    headline: "The strategy's ready. Now for the editing.",
    description:
      "For growth and marketing teams that post regularly but don't have a dedicated editor. A workflow that helps your content keep up.",
    ideas: [
      "An update for your different channels",
      "A short piece for your campaign",
      "Someone on your team answering a question",
    ],
    seo: "Videos for marketing teams",
    sample: "Keep pace with your team.",
    metaTitle: "Video editing for marketing teams | Hooksage",
    metaDescription:
      "Keep your team's content moving with short videos from raw footage. Cuts, zooms and captions. Join the Hooksage waitlist for early access.",
  },
};
export const englishTones = [
  {
    name: "Talking head",
    title: "One idea. Clearly told.",
    description:
      "Cuts that follow your voice, clean pauses and captions that keep up with what you're saying.",
  },
  {
    name: "Product demo",
    title: "Show what your product does.",
    description:
      "Put the important details up front, with zooms that guide the viewer's attention.",
  },
  {
    name: "Educational",
    title: "Turn an explanation into a short video.",
    description: "One idea per video, key words in focus and a clear ending.",
  },
  {
    name: "Campaign",
    title: "Your message, with a clear rhythm.",
    description:
      "The offer up front, readable text and a clear call to action.",
  },
  {
    name: "Team",
    title: "The people behind your business.",
    description:
      "Real voices and an edit that respects the way your team communicates.",
  },
];
