"use client";

import { signUp } from "@/api/auth-service";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema: any = z.object({
    username: z.string().min(5, {
        message: "Username must be at least 5 characters long.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
    passwordConfirmation: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
}).refine(data => data.password === data.passwordConfirmation, {
    message: "Passwords must match.",
    path: ["passwordConfirmation"],
});

interface SignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignupForm({ className, ...props }: SignupFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            await signUp({
                username: values.username,
                email: values.email,
                password: values.password,
            });
            toast.loading("Account created successfully! Redirecting to login page...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error) {
            toast.error("An error occurred: " + error.message)
        }

        setTimeout(() => {
        setIsLoading(false);
        }, 3000);
    }

    return (
        <>
        <Form {...form}>
            <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>Sign up with Google</Button>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="JoeDoe" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="joedoe@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                We&apos;ll never share your email with anyone else.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="supersecret123" type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Must be at least 8 characters long.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="passwordConfirmation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input placeholder="supersecret123" type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                Must match the password above.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Sign up</Button>
            </form>
        </Form>
        <Toaster />
        </>
    )
}
