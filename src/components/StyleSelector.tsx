import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const StyleSelector = ({ value, onChange }: StyleSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] bg-popover">
        <SelectValue placeholder="Citation Style" />
      </SelectTrigger>
      <SelectContent className="bg-popover">
        <SelectItem value="APA">APA Style</SelectItem>
        <SelectItem value="MLA">MLA Style</SelectItem>
        <SelectItem value="Chicago">Chicago Style</SelectItem>
        <SelectItem value="Harvard">Harvard Style</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StyleSelector;
