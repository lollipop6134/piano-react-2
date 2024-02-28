import React, { useState, useEffect } from "react";
import "./testPage.css"
import { Link } from "react-router-dom";
import { useAuth } from "../../UserContext";
import axios from "axios";

type TestProps = {
  lesson_id: number;
};

interface Test {
  id: number;
  lesson_id: number;
  question_order: number;
  question: string;
  options: string[];
  correct_answer: string;
  image: string;
}

const TestPage: React.FC<TestProps> = ({ lesson_id }) => {
  const { user } = useAuth();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [correctlyAnswered, setCorrectlyAnswered] = useState<boolean | null>(null);
  const [test, setTest] = useState<Test[] | null>(null);

  const completeImages = ['Capy1', 'Capy2', 'Capy3', 'Capy4', 'Capy5', 'Capy6', 'Capy7'];
  const completeImage = completeImages[Math.floor(Math.random() * completeImages.length)];

  useEffect(() => {
    fetch(`http://localhost:3001/quizzes?lesson_id=${lesson_id}`)
      .then(response => response.json())
      .then(data => setTest(data as Test[]))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleAnswer = (answer: string) => {
    const correctAnswer = test?.[questionIndex].correct_answer;
    const isCorrect = answer === correctAnswer;
  
    if (isCorrect) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, answer]);
    setCorrectlyAnswered(isCorrect);
  
    if (questionIndex < test!.length - 1) {
      setTimeout(() => {
        setQuestionIndex(questionIndex + 1);
        setCorrectlyAnswered(null);
      }, 1500);
    } else {
      if (test!.length / score < 2 ) {
        addToCompletedLessons();
      }
      setTimeout(() => {
        setTestCompleted(true);
      }, 1500);
    }
  };

  const addToCompletedLessons = async () => {
    if (!user?.completedlessons.includes(lesson_id)) {
      user?.completedlessons.push(lesson_id);
    }
    const userId = user?.user_id;
    try {
      const response = await axios.post(`http://localhost:3001/completeLesson`, { userId, "lessonId": lesson_id });
      return response.status;
    } catch (error) {
      console.error('Cannot update completed lessons', error);
    }
  };

  return (
    <div id="test">
      {!testCompleted ? (
        <div>
          <div id="question">{questionIndex+1}. {test?.[questionIndex].question}</div>
          <img src={`/images/${test?.[questionIndex].image}.webp`} alt="question" id="testImage" />
          <div id="answers">
          {test?.[questionIndex].options.map((option, index) => (
            <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={correctlyAnswered === null ? '' : (option === test?.[questionIndex].correct_answer ? 'correct' : 'incorrect')}
            >
              {option}
            </button>
          ))}
          </div>
        </div>
      ) : (
        <div className="container column">
            <div id="question">{(test!.length / score) < 2 ? "Test complete!" : "You can do better!"}</div>
            {(test!.length / score) < 2 ? (
            <img src={`/images/${completeImage}.webp`} id="completeImage" alt="Cute Capy"/>
            ) : (
            <img src='/images/notFound.png' alt="sad capy" id="sadCapy"/>
            )}
            <div>Your score: {score}/{test!.length}</div>
            <Link to="/lessons" className="main-button" onClick={() => {localStorage.setItem('practiceMode', "false")}}>Lessons</Link>
        </div>
      )}
    </div>
  );
};

export default TestPage;
