import { useEffect, useState } from 'react';
import { getSpeeches, type Speech } from '../utils/speeches';
import { ItemList, type ListItem } from './ItemList';

export function SpeechList() {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpeeches().then((data) => {
      setSpeeches(data);
      setLoading(false);
    });
  }, []);

  return <ItemList items={speeches as ListItem[]} basePath="/speech" emptyMessage="No speeches found." loading={loading} ariaLabel="Speeches list" />;
}

