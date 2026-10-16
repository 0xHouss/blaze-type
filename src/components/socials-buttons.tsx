import { DiscordIcon, GithubIcon } from "@/components/icons";
import Tooltiped from "@/components/tooltiped";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HandHeartIcon } from "lucide-react";
import Link from "next/link";

const GITHUB_URL = "https://github.com/0xHouss/blaze-type";

export function GithubButton() {
  return (
    <Tooltiped content="Checkout the source code" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        <GithubIcon className="size-5" />
        <span className="sr-only">Github profile</span>
      </Link>
    </Tooltiped>
  );
}

export function DiscordButton() {
  return (
    <Tooltiped content="Visit the discord" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"https://discord.gg/xcqH6TeFV3"} target="_blank" rel="noopener noreferrer">
        <DiscordIcon className="size-5" />
        <span className="sr-only">Discord Server</span>
      </Link>
    </Tooltiped>
  );
}

export function SupportButton() {
  return (
    <Dialog>
      <Tooltiped content="Support us" side="left">
        <DialogTrigger className={buttonVariants({ variant: "outline", size: "icon" })}>
          <HandHeartIcon />
          <span className="sr-only">Support us</span>
        </DialogTrigger>
      </Tooltiped>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support Blaze Type</DialogTitle>
          <DialogDescription>
            Thank you so much for thinking about supporting us!
            The best way to help is to star the project on GitHub and share it with your friends.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Link className={buttonVariants()} href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <GithubIcon />
            Star on GitHub
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
