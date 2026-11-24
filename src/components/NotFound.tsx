import React from 'react';
import {SectionTag} from './SectionTag';
import {RevealText} from './RevealText';
import {Button} from './Button';

export const NotFound: React.FC = () => {
  return (
    <main className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6">
      <div className="max-w-[920px] mx-auto border border-[#0B0B0B]/20 rounded-[8px] bg-[#E9E8E6] p-8 sm:p-14 text-center flex flex-col items-center">
        <SectionTag label="404" />
        <RevealText
          as="h1"
          className="mt-6 text-[44px] sm:text-[64px] text-[#0B0B0B]"
          lines={[
            <>
              Trace <span className="headline-serif-accent">Not Found</span>
            </>,
          ]}
        />
        <p className="mt-4 text-[16px] leading-[1.6] text-[#0B0B0B]/70 max-w-[460px]">
          The route you requested does not exist or moved. Return to the main Sightline
          overview to explore tracing, evals, and live telemetry.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button label="Back To Home" variant="primary" to="/" />
          <Button label="Request A Demo" variant="secondary" to="/demo" />
        </div>
      </div>
    </main>
  );
};
