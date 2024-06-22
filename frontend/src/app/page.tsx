
// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <title>UoMe</title>
//     </main>
//   );
// }
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Gub3RYWv1Yr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Icons } from "@/components/icons";
import { FadeText } from "@/components/magicui/fade-text";
import Marquee from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import Link from "next/link";

// this are funny reviews on how people owe money to friends.
const reviews = [
  {
    name: "Cousin",
    username: "@cousin_jack",
    body: "I owe you money. I'm sorry. I'll pay you back soon.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Best friend",
    username: "@kappa",
    body: "I lost count of how much I owe you. I'll pay you back soon. I promise.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Football group",
    username: "@footballers",
    body: "Someone is always owing someone. It's a mess.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "You",
    username: "@me",
    body: "My bank account is always empty. Everyone owes me money.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Father",
    username: "@father",
    body: "I'm your father. You owe me money. Pay up.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "Landlord",
    username: "@landlord",
    body: "You owe me rent. Pay up or get out.",
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  const randomSeed = Math.random();
  const url = `https://api.dicebear.com/9.x/notionists/svg?seed=${randomSeed}`;
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={url} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Landing() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <title>UoMe</title>
      <header className="bg-background lg:px-6 h-14 flex items-center justify-between mr-2 lg:mr-6">
        <Link href="#" className="flex items-center px-4 text-lg font-medium" prefetch={false}>
          <Icons.logo className="h-6 w-6 mr-2" />
          UoMe
        </Link>
        <nav className="flex items-center gap-6 text-base">
          <Link href="/dashboard" className="font-medium hover:underline underline-offset-4" prefetch={false}>
            Home
          </Link>
          <Link href="#about" className="font-medium hover:underline underline-offset-4" prefetch={false}>
            About
          </Link>
          <Link href="#pricing" className="font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="/login" className="font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <FadeText
                    text="Never lose money to your friends again."
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    direction="down"
                    framerProps={{
                      show: { transition: { delay: 0.2 } },
                    }}
                  />
                  <FadeText
                    text="UoMe is the easiest way to keep track of your shared expenses with friends and family."
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    direction="right"
                    framerProps={{
                      show: { transition: { delay: 0.4 } },
                    }}
                  />
                  <FadeText
                    text="Open-source and crowd-funded!"
                    className="max-w-[600px] text-muted-foreground md:text-base"
                    direction="left"
                    framerProps={{
                      show: { transition: { delay: 0.6 } },
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get started, it&apos;s free!
                  </Link>
                </div>
              </div>
              <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg py-20">
                <Marquee pauseOnHover className="[--duration:20s]">
                  {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                  {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                  ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <FadeText
                  text="Keep track of your expenses. Yes, all of them!"
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                  direction="down"
                  framerProps={{
                    show: { transition: { delay: 0.2 } },
                  }}
                />
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {/* <img
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              /> */}
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <FadeText
                        text="Group expenses"
                        className="text-xl font-bold"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.4 } },
                        }}
                      />
                      <FadeText
                        className="text-muted-foreground"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.8 } },
                        }}
                      >
                        Track group expenses and split bills with friends and family. <span className="font-bold">No more WhatsApp reminders.</span>
                      </FadeText>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <FadeText
                        text="Personal expenses"
                        className="text-xl font-bold"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.4 } },
                        }}
                      />
                      <FadeText
                        className="text-muted-foreground"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.8 } },
                        }}
                      >
                        Keep track of your personal expenses and see where your money is going and they sync with your group expenses. <span className="font-bold">No more excel sheets.</span>
                      </FadeText>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <FadeText
                        text="Analytics"
                        className="text-xl font-bold"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.4 } },
                        }}
                      />
                      <FadeText
                        className="text-muted-foreground"
                        direction="right"
                        framerProps={{
                          show: { transition: { delay: 0.8 } },
                        }}
                      >
                        Setup budgets and see how much you&apos;re spending on what. Get insights on your spending habits. <span className="font-bold">No more guesswork.</span>
                      </FadeText>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <FadeText
                  text="Pricing"
                  className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
                  direction="right"
                  framerProps={{
                    show: { transition: { delay: 0.2 } },
                  }}
                />
              </div>
              <FadeText
                  text="It's free, that's it. "
                  className="max-w-[600px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                  direction="right"
                  framerProps={{
                    show: { transition: { delay: 0.4 } },
                  }}
              />
              <FadeText
                  text="We're open-source and crowd-funded. We need your help to keep the lights on but the app will always be free."
                  className="max-w-[600px] text-muted-foreground md:text-l/relaxed lg:text-base/relaxed xl:text-l/relaxed"
                  direction="left"
                  framerProps={{
                    show: { transition: { delay: 0.6 } },
                  }}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 UoMe. All rights reserved.</p>
        <p className="text-xs text-muted-foreground ml-auto">Made with ♥️ by Jerónimo</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/tos" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
