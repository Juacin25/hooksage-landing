import { plansFor, packsFor } from "./plan";
const planSummary = plansFor("en")
  .map(
    (plan) =>
      plan.name +
      ": US$" +
      plan.monthlyPriceUSD +
      " per month, with " +
      plan.weeklyExports +
      " video exports per week",
  )
  .join(". ");
export const englishFaqs = [
  {
    question: "Who is Hooksage for?",
    answer:
      "Startups, small businesses, creators and marketing teams without a dedicated editor. Start with your own recordings or an idea to communicate your product, service or personal brand.",
  },
  {
    question: "How does my brand shape content suggestions?",
    answer:
      "Create an editable profile or import information from text or a PDF. The pilot uses that context to suggest hooks, scripts and shot lists. It also helps discover Shorts references by category and approximate brand fit; these don't guarantee sales or virality.",
  },
  {
    question: "Do I need to have footage ready?",
    answer:
      "You can edit a recording while keeping your original voice, or create a video with a script and voiceover. The second route supports one main video and up to two supporting clips or images. Generating voices and new sounds is optional and depends on the services configured for the pilot.",
  },
  {
    question: "What changes between Natural, Dynamic and Impact?",
    answer:
      "They are three finish directions. They guide decisions about pacing, text, graphics and sound, with advanced controls to adjust them. The edit follows your content and available material rather than applying every effect to every video.",
  },
  {
    question: "Can I upload a reference video?",
    answer:
      "Yes. A reference can guide pacing and visual direction. It is analysed separately from the footage you want to edit. This is different from the Shorts references you can explore by category.",
  },
  {
    question: "What format and length are the exports?",
    answer:
      "Current output is vertical MP4 at 720 × 1280 and 30 fps, for channels such as Reels, TikTok and Shorts. Length follows the edit and the voice. Compatible MP4/MOV files are accepted as input.",
  },
  {
    question: "Can I request changes without losing the previous edit?",
    answer:
      "Yes. The library automatically saves originals and versions. Each revision creates a new job and keeps the earlier result so you can revisit and compare it. Review each export before posting.",
  },
  {
    question: "When can I try it, and what does it cost?",
    answer:
      "The pilot is in development and currently runs locally; public multi-user access is still being prepared. There is no confirmed access date. Joining the waitlist is free and needs no card. Sign up for your first free video when access opens. " +
      planSummary +
      ". Prices are in US dollars, billed monthly. Export allowances reset weekly. One-off packs are also available: " +
      packsFor("en")
        .map((pack) => pack.exports + " videos for US$" + pack.priceUSD)
        .join(", ") +
      ".",
  },
  {
    question: "What happens when I submit the form?",
    answer:
      "We save your request. You can share a link to your clip and tell us what you had to redo in your last edit; both are optional. Someone on the team will email you to arrange a free first edit. The public editor is still in development, and submitting the form does not create an account or start a subscription. WhatsApp is optional.",
  },
  {
    question: "Can I connect an assistant?",
    answer:
      "The pilot includes a local MCP to inspect projects and request jobs through the same API. Public remote MCP access is still pending. This is an option for people configuring the local pilot, not an active public service on this landing.",
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
    sample: "Your product, clearly explained.",
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
    sample: "One clear idea. Your way of telling it.",
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
