"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import * as React from "react"

import { cn, hashValue } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName


const UserAvatar = React.forwardRef(( props, forwardedRef ) => {
  const [hashedEmail, setHashedEmail] = React.useState('');
  React.useEffect(() => {
    hashValue(props.user.email).then((hashedEmail) => {
      setHashedEmail(hashedEmail);
    });
  }, [])
  return (
    <Avatar key={props.user.id} ref={forwardedRef} {...props}>
      <AvatarImage src={"https://gravatar.com/avatar/" + hashedEmail + "?d=404"} alt={props.user?.username ?? ""} />
      <AvatarFallback>{props.user.username.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
});
UserAvatar.displayName = "UserAvatar"

export { Avatar, AvatarFallback, AvatarImage, UserAvatar }
