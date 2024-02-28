import './lessons.css';
import { Footer } from '../../components/footer/footer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../UserContext';
import axios from 'axios';

interface Lesson {
    id: number,
    subtitle: string;
}

export function Lessons() {

    const [lessonPages, setLessonPages] = useState<Lesson[]>([]);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const isUnlocked = (lessonId: number) => {
        if (user?.completedlessons.includes(lessonId) || user?.completedlessons.includes(lessonId-1) 
            || (!user?.completedlessons.length && lessonId === 1 ) || user?.status === 'admin') return true;
        return false;
    }

    useEffect(() => {
        fetch('http://localhost:3001/lessons')
          .then(response => response.json())
          .then(data => setLessonPages(data))
          .catch(error => console.error('Error:', error));
    }, []);

    const deleteLesson = async (lessonId: number) => {
        try {
            const response = await axios.post(`http://localhost:3001/deleteLesson`, { lessonId });
            return response.data;
        } catch (error) {
            console.error('Error deleting lesson: ', error);
            throw error;
        } finally {
            window.location.reload();
        }
    };

    async function addLesson(lessonId: number) {
        console.log(lessonId);
        try {
            const response = await axios.post(`http://localhost:3001/addLesson`, {lessonId});
            return response.data;
        } catch (error) {
            console.error('Error deleting lesson: ', error);
            throw error;
        } finally {
            window.location.reload();
        }
    };

    const LessonComponent = ({ lesson }: { lesson: Lesson }) => {
        const [isSure, setIsSure] = useState(false);

        return (
            <div className={isUnlocked(lesson.id) ? 'lesson' : 'lesson disabled'} key={lesson.id}>
                <Link to={isUnlocked(lesson.id) ? `/lesson/${lesson.id}` : ''} >
                    Lesson {lesson.id} <br />
                    {lesson.subtitle}
                </Link>
                {user?.status === 'user' && user?.completedlessons.includes(lesson.id) && <div id="complete">Complete!</div>}
                {user?.status === 'admin' &&
                    <div id='lessonIcons'>
                        <Link to={`/lesson/${lesson.id}/constructor`}>Edit</Link>
                        {!isSure ? <button onClick={() => setIsSure(true)}>Delete</button> :
                            <button onClick={() => deleteLesson(lesson.id)} style={{color: 'beige'}}>Sure?</button>}
                    </div>}
            </div>
        );
    };

    function getMaxId(): number {
        const lessonIds = lessonPages.map(lesson => lesson.id);
        return Math.max(...lessonIds);
    }

    return (
        <>
            <input
                type="text"
                className='lessonSearch'
                placeholder="Search by title &#128269;"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {lessonPages.length < 1 && <div id='preloader'> Just a moment <div id='loader'></div></div>}
            <div className='lessons'>
            {lessonPages
                .filter(lesson => lesson.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => a.id - b.id)
                .map((lesson) => (
                <LessonComponent key={lesson.id} lesson={lesson} />
            ))}
                {user?.status === 'admin' && <button id='addLesson' onClick={() => addLesson(getMaxId()+1)}>+</button>}
            </div>
            <Footer />
        </>
    )
}
