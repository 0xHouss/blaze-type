import Tooltiped from "@/components/tooltiped";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HandHeartIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

export function TeamButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltiped content="Our Team" side="left">
          <div className={buttonVariants({ variant: "outline", size: "icon" })}>
            <UsersIcon />
            <span className="sr-only">Our Team</span>
          </div>
        </Tooltiped>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
          <DialogDescription>
            Takorabet Houssam (242431430718)  {/* (takorabet.houssam.242431430718@gmail.com) */}
            <br />
            Garid Raouf (242431574410) {/* (raoufgrd98@gmail.com) */}
            <br />
            Benkritly Hakim (242431621020) {/* (kimokima381@gmail.com) */}
            <br />
            Saadbouzid Syliane (242431750012) {/* (Syliane2006@gmail.com) */}
            <br />
            Machane Yanis (232331406304) {/* (yanismac74@gmail.com) */}
            <br />
            Tandi Tashinga (23238ZWE19487) {/* (tanditashinga@gmail.com) */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function GithubButton() {
  return (
    <Tooltiped content="Checkout our Githubs" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"https://github.com/0xHouss/blaze-type"} target="_blank">
        <FontAwesomeIcon icon={faGithub} size="xl" />
        <span className="sr-only">Github profile</span>
      </Link>
    </Tooltiped>
  );
}

export function DiscordButton() {
  return (
    <Tooltiped content="Visit the discord" side="left">
      <Link className={buttonVariants({ variant: "outline", size: "icon" })} href={"https://discord.gg/xcqH6TeFV3"} target="_blank">
        <FontAwesomeIcon icon={faDiscord} size="xl" />
        <span className="sr-only">Discord Server</span>
      </Link>
    </Tooltiped>
  );
}

export function SupportButton() {
  return (
    <Dialog>
      <DialogTrigger>
        <Tooltiped content="Support us" side="left">
          <div className={buttonVariants({ variant: "outline", size: "icon" })}>
            <HandHeartIcon />
            <span className="sr-only">Support us</span>
          </div>
        </Tooltiped>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support TypeFast</DialogTitle>
          <DialogDescription>
            Thank you so much for thinking about supporting us!
            If you really want to support us, please consider giving us a 20/20.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}