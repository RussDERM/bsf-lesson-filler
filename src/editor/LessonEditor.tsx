import {css} from 'emotion';
import React, {useCallback, useState} from 'react';
import {fetchLesson} from '../api/LessonAPI';
import {Study} from '../api/StudiesAPI';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';
import {LessonEditorDay} from './LessonEditorDay';
import {PassageViewer} from './PassageViewer';

export const SelectedPassageContext = React.createContext<
  (html: string) => void
>(() => {});

type Props = {
  answersByQuestionID: Map<string, string>;
  lessonID: string;
  studies: Study[];
};

export function LessonEditor({
  answersByQuestionID,
  lessonID,
  studies,
}: Props): JSX.Element {
  const [selectedPassage, setSelectedPassage] = useState<string | null>(null);
  const {isLoading, result: lesson} = useAbortableFetch({
    doFetch: useCallback(signal => fetchLesson(lessonID, signal), [lessonID]),
    defaultValue: null,
    shouldFetch: Boolean(lessonID),
  });

  if (isLoading || !lesson) {
    return (
      <div className={styles.lessonEditor}>
        <FullSizeLoadingIndicator />
      </div>
    );
  }

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;

  return (
    <SelectedPassageContext.Provider value={setSelectedPassage}>
      <div className={styles.lessonEditor}>
        <div className={styles.lesson}>
          <h1 className={styles.title}>
            {verses} - Lesson {lesson.number}
          </h1>
          {lesson.days.map((day, index) => (
            <LessonEditorDay
              answersByQuestionID={answersByQuestionID}
              day={day}
              key={index}
            />
          ))}
        </div>
        <PassageViewer selectedPassage={selectedPassage ?? verses ?? ''} />
      </div>
    </SelectedPassageContext.Provider>
  );
}

const styles = {
  lessonEditor: css`
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
  `,
  title: css`
    font-size: var(--font-size-xl);
  `,
  lesson: css`
    flex: 1 1 0;
    overflow: auto;
    padding: 0 var(--l) var(--l) var(--l);
  `,
};
