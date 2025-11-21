import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../utils/projects';
import { ItemList, type ListItem } from './ItemList';

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return <ItemList items={projects as ListItem[]} basePath="/project" emptyMessage="No projects found." loading={loading} />;
}

