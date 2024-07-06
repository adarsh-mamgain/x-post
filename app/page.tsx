"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import image from "../public/image.svg";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/utils/server";
import { APIPathname } from "@/enums";
// import { Switch } from "@/components/ui/switch";

export default function Home() {
  const handleClick = () => {
    axios.get(BASE_URL + APIPathname.TWITTER_SIGNIN).then((response) => {
      window.location.href = response.data.url;
    });
  };

  return (
    <main className="flex min-h-screen flex-col px-60">
      {/* <nav className="flex items-center p-4">
        <div>
          <span className="text-2xl font-bold">X-Post</span>
        </div>
        <div>
          <Switch />
        </div>
      </nav> */}

      <div className="text-center p-24">
        <div className="mb-6">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-500 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            Supercharge X Account
          </h1>
          <p className="text-lg font-medium text-gray-600">
            Schedule tweets, manage your content calendar, <br />
            and analyze your account performance
          </p>
        </div>
        <div>
          <Button onClick={handleClick}>Sign in</Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Schedule Tweets with Ease</h2>
          <p className="text-lg font-medium text-gray-600">
            Our intuitive scheduling tool allows you to plan and publish your
            tweets in advance, ensuring a consistent social media presence.
          </p>
        </div>
        <div>
          <Image src={image} width={800} height={300} alt="Schedule tweets" />
        </div>
      </div>

      <div className="flex space-x-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Manage Your Content Calendar
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Our content calendar feature allows you to plan and visualize your
            Twitter content, ensuring a consistent and engaging presence.
          </p>
        </div>
        <div>
          <Image src={image} width={800} height={300} alt="Schedule tweets" />
        </div>
      </div>

      <div className="flex space-x-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Analyze Your Twitter Performance
          </h2>
          <p className="text-lg font-medium text-gray-600">
            Our advanced analytics dashboard provides insights into your tweet
            performance, helping you optimize your content strategy.
          </p>
        </div>
        <div>
          <Image src={image} width={800} height={300} alt="Schedule tweets" />
        </div>
      </div>

      <Separator className="my-4" />

      <footer className="w-full p-4">
        <div className="flex items-center">
          <div>
            <p>© 2024 X-Post. All rights reserved.</p>
          </div>
          <div className="grow">
            <Link href={"terms-of-service"}>
              <Button variant={"link"}>Terms of service</Button>
            </Link>
            <Link href={"privacy-policy"}>
              <Button variant={"link"}>Privacy policy</Button>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
