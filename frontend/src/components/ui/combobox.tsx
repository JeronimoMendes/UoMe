import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'


function ComboBoxSelector({ options, value, onChange, placeholder }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    aria-expanded="false"
                    aria-haspopup="listbox"
                    className="w-full justify-between"
                    role="combobox"
                    variant="outline"
                >
                    <span>Next.js</span>
                    {/* <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                </Button>
            </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandInput className="h-9" placeholder={placeholder} />
                <CommandEmpty>No frameworks found.</CommandEmpty>
                <CommandGroup>
                    { options.map((option) => (
                        <CommandItem key={option.value} onSelect={() => onChange(option.value)}>
                            {option.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </Command>
        </PopoverContent>
        </Popover>
    )
}
