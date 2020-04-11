import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchESVPassageHTML, fetchLesson, Lesson, Study} from './API';
import {LessonEditorDay} from './LessonEditorDay';
import {PassageViewer} from './PassageViewer';

export const SelectedPassageContext = React.createContext<
  (html: string) => void
>(() => {});

export function LessonEditor({
  lessonID,
  studies,
}: {
  lessonID: string;
  studies: Study[];
}): JSX.Element {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<string>('');
  const [passageHTML, setVerseHTML] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    fetchLesson(lessonID, controller.signal).then(setLesson);
    return () => {
      controller.abort();
    };
  }, [lessonID]);

  useEffect(() => {
    if (selectedVerse) {
      const controller = new AbortController();
      fetchESVPassageHTML(selectedVerse, controller.signal).then(setVerseHTML);
      return () => {
        controller.abort();
      };
    }
  }, [selectedVerse]);

  if (!lesson) {
    return <div className={styles.lessonEditor} />;
  }

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;

  return (
    <SelectedPassageContext.Provider value={setSelectedVerse}>
      <div className={styles.lessonEditor}>
        <div className={styles.lesson}>
          <h1 className={styles.title}>
            {verses} - Lesson {lesson.number}
          </h1>
          {lesson.days.map((day, index) => (
            <LessonEditorDay day={day} key={index} />
          ))}
        </div>
        <PassageViewer passageHTML={passageHTML} />
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
