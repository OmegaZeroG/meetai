import { InboxIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-6 py-16">
      <InboxIcon className="size-10 text-muted-foreground" />
      <div className="flex flex-col gap-y-2 max-w-md mx-auto text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
