import React, {useState} from 'react';
import {Download, Check} from 'lucide-react';
import {DemoBookingData} from '../../lib/demoContent';
import {downloadIcsFile} from '../../lib/ics';

interface IcsButtonProps {
  booking: DemoBookingData;
}

export const IcsButton: React.FC<IcsButtonProps> = ({booking}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadIcsFile(booking);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2200);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[#0B0B0B]/20 bg-white hover:bg-[#D9C4A8]/35 text-[#0B0B0B] text-[14px] font-medium px-5 py-3 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0B2FA8]"
    >
      {downloaded ? (
        <Check className="w-4 h-4 text-[#0B2FA8]" />
      ) : (
        <Download className="w-4 h-4 text-[#0B2FA8]" />
      )}
      <span>{downloaded ? 'Downloaded .ics' : 'Download .ics'}</span>
    </button>
  );
};
