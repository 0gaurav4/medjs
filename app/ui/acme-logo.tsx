import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/* <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" /> */}
      <p className="text-[44px]">
        <Image
                src="/synapse.PNG"
                margin-top='100rem'
                box-sizing="content-box"
                width={1000}
                height={700}
                // className="hidden md:block"
                alt="logo"
              />
      </p>
    </div>
  );
}
