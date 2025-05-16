import { Button } from "@components/ui/Button";
import WidgetWrapper from "./WidgetWrapper";
import * as TablerIcons from "@tabler/icons-react";

interface CallToActionProps {
  title?: string;
  text?: string;
  href?: string;
  icon?: string; // Name of the icon, e.g. "IconUserPlus"
}

export default function CallToAction({ text, href, icon, title }: CallToActionProps) {
  const IconComponent = icon ? (TablerIcons as any)[icon] : null;

  return (
    <WidgetWrapper>
      <div className="max-w-2xl mx-auto bg-white text-center p-6 rounded-md shadow-xl text-black">
        <div className='font-bold'>
          {title}
        </div>
            <Button href={href}>
                {IconComponent && <IconComponent className="mr-2 inline-block" size={20} />}
                {text}
            </Button>
        </div>
    </WidgetWrapper>
  );
}