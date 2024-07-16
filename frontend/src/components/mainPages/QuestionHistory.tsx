import React from 'react';
import '../../styles/mainPageStyle/QuestionHistory.css';

interface QuestionHistoryProps {
  history: Array<{ subject: string, question: string, answer: string | JSX.Element }>;
}

const QuestionHistory: React.FC<QuestionHistoryProps> = ({ history }) => {
  return (
    <div className="question-history">
      <h2>Question History</h2>
      {history.map((entry, index) => (
        <div key={index} className="history-item">
          <strong>Subject:</strong> {entry.subject}<br />
          <strong>Question:</strong> {entry.question}<br />
          <strong>Answer:</strong> {entry.answer}
          -------------------------------------------
        </div>
      ))}
    </div>
  );
};

export default QuestionHistory;
