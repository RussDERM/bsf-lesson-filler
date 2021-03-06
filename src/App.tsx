import {css, cx} from 'emotion';
import React, {useEffect, useState} from 'react';
import {subscribeToAnswersByQuestionID} from './api/AnswersAPI';
import {fetchStudies, Study} from './api/StudiesAPI';
import './Colors';
import {LessonEditor} from './editor/LessonEditor';
import {useCurrentUser} from './hooks/useCurrentUser';
import TopBar from './topBar/TopBar';

export default function App() {
  const [studies, setStudies] = useState<Study[] | null>(null);
  const [selectedLessonID, setSelectedLessonID] = useState<string | null>(null);
  useEffect(() => {
    fetchStudies().then(studies => {
      setStudies(studies);
      setSelectedLessonID(
        studies
          .flatMap(s => s.lessons)
          .find(lesson => lesson.date.getTime() > Date.now())?.id ?? null,
      );
    });
  }, []);

  const answersByQuestionID = useSubscribeToAnswersByQuestionID();

  if (!studies) {
    return null;
  }

  return (
    <div
      className={cx(
        styles.app,
        navigator.userAgent.includes('Chrome/81') && styles.chrome81FontFix,
      )}>
      <TopBar
        onSelectLesson={setSelectedLessonID}
        selectedLessonID={selectedLessonID}
        studies={studies}
      />
      <div className={styles.underTop}>
        {selectedLessonID && (
          <LessonEditor
            answersByQuestionID={answersByQuestionID}
            lessonID={selectedLessonID}
            studies={studies}
          />
        )}
      </div>
    </div>
  );
}

function useSubscribeToAnswersByQuestionID(): Map<string, string> {
  const currentUser = useCurrentUser();
  const [answersByQuestionID, setAnswersByQuestionID] = useState<
    Map<string, string>
  >(new Map());
  useEffect(() => {
    if (currentUser) {
      return subscribeToAnswersByQuestionID(
        currentUser.uid,
        setAnswersByQuestionID,
      );
    }
  }, [currentUser]);
  return answersByQuestionID;
}

const styles = {
  app: css`
    background: var(--background-primary);
    color: var(--content-primary);
    display: flex;
    flex-direction: column;
    font-family: system-ui;
    font-size: var(--font-size-m);
    height: 100vh;
    overflow: hidden;
  `,
  chrome81FontFix: css`
    font-family: -apple-system, Helvetica;
  `,
  top: css`
    display: flex;
    flex-shrink: 0;
  `,
  underTop: css`
    display: flex;
    overflow: hidden;
  `,
};
