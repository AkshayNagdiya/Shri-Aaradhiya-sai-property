import { useEffect } from 'react';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute('content', description);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [title, description]);
}
