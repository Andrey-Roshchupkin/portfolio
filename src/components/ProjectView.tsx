import { getProjectBySlug, type Project } from '../utils/projects';
import { ContentView } from './ContentView';

export function ProjectView() {
  return (
    <ContentView<Project>
      getItemBySlug={getProjectBySlug}
      backPath="/projects"
      notFoundMessage="Project not found"
      notFoundLinkLabel="Go back to projects"
    />
  );
}

