import type { LucideIcon } from "lucide-react";

const SocialLink = ({ url, icon: Icon, label }: { url: string; icon: LucideIcon; label: string }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex flex-col items-center gap-2 group"
        >
            <div className="p-3 bg-neo-blue text-white border-2 border-neo-border-color neo-shadow-sm rounded-lg group-hover:-translate-y-1 group-hover:scale-110 group-hover:neo-shadow-md group-hover:bg-neo-babyb transition-all duration-300">
                <Icon size={28} className="text-neo-text" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                {label}
            </span>
        </a>
    );
};

export default SocialLink;