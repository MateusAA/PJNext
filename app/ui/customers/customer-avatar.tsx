import Image from 'next/image';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function CustomerAvatar({ src, alt }: { src: string | null; alt: string }) {
    if (!src) {
        return <UserCircleIcon className="h-7 w-7 shrink-0 text-gray-400" aria-label={alt} />;
    }

    return (
        <Image
            src={src}
            className="rounded-full"
            alt={alt}
            width={28}
            height={28}
        />
    );
}
