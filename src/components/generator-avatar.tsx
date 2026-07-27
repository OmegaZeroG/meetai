import { cn } from "@/lib/utils";
import { generateAvatarUri } from "@/lib/avatar";
import {Avatar, AvatarFallback , AvatarImage} from "@/components/ui/avatar"


interface GenerateAvatarProps{
  seed: string;
  className?: string;
  variant : "botttsNeutral" |"initials";
}

export const GenerateAvatar = (
  {
    seed,
    className,
    variant,
  }: GenerateAvatarProps
)=>{
  const avatarUri = generateAvatarUri({ seed, variant });

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src = {avatarUri} alt="Avatar"/>
      <AvatarFallback>
        {
          seed.charAt(0).toUpperCase()
        }
      </AvatarFallback>
    </Avatar>
  )
}