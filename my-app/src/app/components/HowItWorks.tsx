export default function HowItWorks() {
  const steps = [
    {
      title: "First Create Your Project To Integrate with our AI",
      points: [
        "Enter your brand name in the project setup.",
        "Enter your domain name for integration.",
        "Add a description of your brand.",
      ],
      badge: "Step 1",
    },
    {
      title: "Add Your Keywords & Select your Social Medias",
      points: [
        "AI suggests relevant keywords for your brand.",
        "Add your chosen keywords manually.",
        "Select the social medias you want to track.",
      ],
      badge: "Step 2",
    },
    {
      title: "Browse Posts Found From Your Chosen Social Medias",
      points: [
        "View posts that match your keywords from chosen socials.",
        "Use Advanced Settings to filter your post fetching further.",
        "Use View Post to open and engage with the posts.",
      ],
      badge: "Step 3",
    },
    {
      title: "Now We Write You AI Replies Mentioning Your Brand",
      points: [
        "Each AI-generated reply is tailored to specific posts.",
        "Naturally includes your brand and key messages.",
        "Use Custom Prompts to generate replies as per your needs.",
      ],
      badge: "Step 4",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <span className="inline-block rounded-full border border-black/10 dark:border-white/15 px-3 py-1 text-sm font-medium mb-3">
          How It Works
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold">Use BizReply to Generate Customers & Traffic</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.title} className="rounded-2xl border border-black/10 dark:border-white/15 p-5">
            <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2">{step.badge}</div>
            <h3 className="font-semibold mb-3">{step.title}</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-black/80 dark:text-white/80">
              {step.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}


