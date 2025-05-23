export interface Item {
  title?: string;
  description?: string;
  icon?: string; // Optional, but we will replace it with numbers
  classes?: Record<string, string>;
}

export interface Props {
  items?: Array<Item>;
  defaultIcon?: string; // Optional, but no longer needed
  classes?: Record<string, string>;
}

const Timeline = ({ items = [], classes = {} }: Props) => {
  const {
    container: containerClass = '',
    panel: panelClass = '',
    title: titleClass = '',
    description: descriptionClass = '',
    icon: defaultIconClass = 'text-primary dark:text-slate-200 border-primary dark:border-blue-700',
  } = classes;

  if (!items || items.length === 0) return null;

  return (
    <div className={containerClass}>
      {items.map(({ title, description, classes: itemClasses = {} }, index) => (
        <div
          key={index}
          className={`flex intersect-once intersect-quarter motion-safe:md:opacity-0 motion-safe:md:intersect:animate-fade ${panelClass} ${itemClasses?.panel || ''}`}
        >
          <div className="flex flex-col items-center mr-4 rtl:mr-0 rtl:ml-4">
            <div>
              <div className="flex items-center justify-center">
                <div
                  className={`w-10 h-10 p-2 rounded-md border-2 flex items-center justify-center font-bold text-lg ${defaultIconClass} ${itemClasses?.icon || ''}`}
                >
                  {index + 1} {/* Display step number */}
                </div>
              </div>
            </div>
            {index !== items.length - 1 && (
              <div className="w-px h-full bg-black/10 dark:bg-slate-400/50" />
            )}
          </div>
          <div className={`pt-1 ${index !== items.length - 1 ? 'pb-8' : ''}`}>
            {title && (
              <p className={`text-xl font-bold ${titleClass} ${itemClasses?.title || ''}`}>
                {title}
              </p>
            )}
            {description && (
              <p
                className={`text-muted mt-2 ${descriptionClass} ${itemClasses?.description || ''}`}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
