import './lessonPage.css';
import { useParams } from 'react-router-dom';
import { Footer } from '../../components/footer/footer';
import { useState, useEffect } from 'react';
import PracticePage from '../practicePage/practicePage';
import TestPage from '../test/testPage';

export interface Lesson {
    id: number,
    subtitle: string;
    title: string;
    information: string[];
    lesson_images: string[];
    notes: string[];
    practice_image: string[];
}

export function LessonPage() {
    const { id } = useParams<{ id?: string }>();
    const [practiceMode, setPracticeMode] = useState(false);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/lessons?id=${id}`)
          .then(response => response.json())
          .then(data => {
            setLesson(data[0] as Lesson);
            setIsLoad(true);
          })
          .catch(error => console.error('Error:', error));
      }, []);

    const handlePracticeModeToggle = (newPracticeMode: boolean) => {
        setPracticeMode(newPracticeMode);
        localStorage.setItem('practiceMode', newPracticeMode.toString());
    };

    if (!id || !lesson) {
        return (
            <>
            {!isLoad && <div id='preloader'> Just a moment <div id='loader'></div></div>}
                <div className='notFound'>
                    <img src='/images/notFound.png' alt="Sad capybara" />
                    <div>Lesson not found :(</div>
                </div>
            </>
        )
    }

    return (
        <>
        {!isLoad && <div id='preloader'> Just a moment <div id='loader'></div></div>}
        {practiceMode ? ( lesson.id !== 9 ?
            <PracticePage practiceNotes={lesson.notes} id={lesson.id} practiceImage={lesson.practice_image}/> : <TestPage lesson_id={lesson.id}/>
        ) : (
            <>
            <div id="lessonPage">
            <div id="lessonTitle">
                {lesson.title}
            </div>
            <div className='lessonSection'>
                <div className='lessonParagraph'>
                    {lesson.information[0]}
                </div>
                <img src={`/images/${lesson.lesson_images[0]}`} alt="1" className='main_img'/>
            </div>
            <div className='lessonSection'>
                {lesson.information[1]}
            </div>
            <div className='lessonSection'>
                <img src={`/images/${lesson.lesson_images[1]}`} alt="2" className='main_img'/>
                <div className='lessonParagraph'>
                    {lesson.information[2]}
                </div>
            </div>
            <div className='lessonSection №5'>
                <div className='lessonParagraph'>
                    {lesson.information[3]}
                </div>
                <img src={`/images/${lesson.lesson_images[2]}`} alt="3" className='main_img'/>
            </div>
            {lesson.information[4] !== '' && <div className='lessonSection'>
                {lesson.information[4]}
            </div>}
            <button className='main-button' onClick={() => handlePracticeModeToggle(true)}>Practice!</button>
        </div>
        <button onClick={() => window.print()} className='print-button'>Print this lesson</button>
        <Footer />
        </>
        )}
        </>
    )
}