import {css} from 'emotion';
import React, {useCallback} from 'react';
import {scanForReferences} from '../api/ReferencesAPI';
import {useAbortableFetch} from '../hooks/useAbortableFetch';

/**
 * Highlights Bible references in the given text, returning chunks of text
 * interspersed with inline tags, all with no wrapper.
 **/
export default function TextWithBibleReferences({
  text,
  onPassageClicked,
}: {
  text: string;
  onPassageClicked: (verse: string) => void;
}): JSX.Element {
  const {result: references} = useAbortableFetch({
    doFetch: useCallback(signal => scanForReferences(text, signal), [text]),
    defaultValue: [],
  });

  if (!references?.length) {
    return <>{text}</>;
  }

  const parts: (JSX.Element | string)[] = [];
  let index = 0;
  for (const verse of references) {
    if (index < verse.textIndex) {
      parts.push(text.slice(index, verse.textIndex));
    }
    const endIndex = verse.textIndex + verse.textLength;
    parts.push(
      <abbr
        className={styles.verse}
        key={verse.textIndex}
        onClick={() => {
          onPassageClicked(verse.passage);
        }}
        title={verse.passage}>
        {text.slice(verse.textIndex, endIndex)}
      </abbr>,
    );
    index = endIndex;
  }
  if (index < text.length) {
    parts.push(text.slice(index));
  }

  return <>{parts}</>;
}

const styles = {
  verse: css`
    cursor: pointer;
  `,
};
