import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address.").min(1)
});

interface InviteUserFormProps extends React.HTMLAttributes<HTMLDivElement> {
    onSubmit: SubmitHandler<{email: string;}>
}

function InviteUserForm({ className, onSubmit, ...props }: InviteUserFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input id="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='!text-sm w-min' >Invite</Button>
            </form>
        </Form>
    )
}

export { InviteUserForm };
