import { getSpeechBySlug, type Speech } from '../utils/speeches';
import { ContentView } from './ContentView';

export function SpeechView() {
  return (
    <ContentView<Speech>
      getItemBySlug={getSpeechBySlug}
      backPath="/speeches"
      notFoundMessage="Speech not found"
      notFoundLinkLabel="Go back to speeches"
    />
  );
}

