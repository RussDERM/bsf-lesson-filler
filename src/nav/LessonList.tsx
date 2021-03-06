import {css} from 'emotion';
import React, {useState} from 'react';
import {Study} from '../api/StudiesAPI';
import {LessonListItem} from './LessonListItem';

export function LessonList({
  isExpandedInitially,
  onSelectLesson,
  selectedLessonID,
  study,
}: {
  isExpandedInitially: boolean;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  study: Study;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedInitially);
  return (
    <div key={study.title}>
      <h1 className={styles.studyName} onClick={() => setIsExpanded(v => !v)}>
        {study.title} ({study.startYear} - {study.endYear})
      </h1>
      {isExpanded && (
        <ul className={styles.lessonList}>
          {study.lessons.map(lesson => {
            const isSelected = selectedLessonID === lesson.id;
            return (
              <LessonListItem
                key={lesson.id}
                isSelected={isSelected}
                lesson={lesson}
                onSelectLesson={onSelectLesson}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

const styles = {
  studyName: css`
    background: var(--background-primary);
    cursor: pointer;
    font-size: var(--font-size-xl);
    left: 0;
    margin-top: 0;
    padding: var(--m) var(--l);
    position: sticky;
    top: 0;
  `,
  lessonList: css`
    list-style-type: none;
    padding: 0;
  `,
};
