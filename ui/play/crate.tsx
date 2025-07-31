'use client';

import { useEffect } from 'react';

export default function WidgetBotCrate() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new window.Crate({
        server: '1337108365591187640',
        channel: '1345454451904745673',
        css: 'margin-bottom: 8px;',
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
