import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MyAvatar({ src }: { src: string }) {
  return (
    <Avatar className="w-32 h-32 border">
      <AvatarImage className="object-cover" src={src} alt="avatar" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
