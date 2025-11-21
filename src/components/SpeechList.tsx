import { useEffect, useState } from 'react';
import { getSpeeches, type Speech } from '../utils/speeches';
import { ItemList, type ListItem } from './ItemList';

export function SpeechList() {
  const [speeches, setSpeeches] = useState<Speech[]>([]);

  useEffect(() => {
    getSpeeches().then(setSpeeches);
  }, []);

  return <ItemList items={speeches as ListItem[]} basePath="/speech" emptyMessage="No speeches found." />;
}

