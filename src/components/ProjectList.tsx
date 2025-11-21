import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../utils/projects';
import { ItemList, type ListItem } from './ItemList';

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return <ItemList items={projects as ListItem[]} basePath="/project" emptyMessage="No projects found." />;
}

