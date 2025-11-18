'use client';

import {useTranslations} from 'next-intl';
import PageLayout from '@/layouts/minimal/MinimalLayout';
import { useEffect } from 'react';

type Props = {
  error: Error;
  reset(): void;
};

export default function Error({error, reset}: Props) {
  const t = useTranslations('error');

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <PageLayout>
      <div>
        {t.rich('generic', {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          retry: (chunks) => (
            <button
              className="text-white underline underline-offset-2"
              onClick={reset}
              type="button"
            >
              {chunks}
            </button>
          )
        })}
      </div>
    </PageLayout>
  );
}
