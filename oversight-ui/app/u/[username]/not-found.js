// app/u/[username]/not-found.js
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
      <div className="text-center max-w-md">
        <User className="w-20 h-20 text-[#6B6560]/30 mx-auto mb-6" />
        <h2 className="text-3xl font-serif text-[#2C2825] mb-3">
          Profile Not Found
        </h2>
        <p className="text-[#6B6560] mb-8 leading-relaxed">
          The founder profile you're looking for doesn't exist or is not
          publicly available.
        </p>
        <Link href="/">
          <Button className="bg-[#D4735F] hover:bg-[#B85A47] text-white rounded-xl px-8 py-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to BackStory
          </Button>
        </Link>
      </div>
    </div>
  );
}
