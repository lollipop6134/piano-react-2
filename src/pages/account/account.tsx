import { useState, useEffect } from 'react';
import { Footer } from '../../components/footer/footer';
import "./account.css"
import { logout, changeUsername, changeAvatar } from '../../AuthService';
import { useAuth } from '../../UserContext';
import { Lesson } from '../lessonPage/lessonPage'; // УДАЛИТЬ ПОСЛЕ КУРСАЧА
import axios from 'axios';

export default function Account() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [countLessons, setCountLessons] = useState(0);
  const [completedlessons, setCompletedLessons] = useState<number[] | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null); // УДАЛИТЬ ПОСЛЕ КУРСАЧА

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
    
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setCompletedLessons(user.completedlessons);
      setImage(user.image);
      fetch('http://localhost:3001/lessons')
        .then(response => response.json())
        .then(data => {
          setCountLessons(data.length);
          setLessons(data); // УДАЛИТЬ ПОСЛЕ КУРСАЧА
        })
        .catch(error => console.error('Error:', error));
    };
  }, [user]);

  const handleChanges = async () => {
    if (username !== user?.username) {
      await changeUsername(user!.user_id, username!);
    }
    if (image !== user?.image) {
      const formData = new FormData();
      formData.append('image', imageFile!);
      try {
        await axios.post('http://localhost:3001/uploadUsers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        await changeAvatar(user!.user_id, image!);
        alert('The changes have been saved successfully!');
        window.location.reload();
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      }
    } else {
      alert('The changes have been saved successfully!');
      window.location.reload();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const selectedFile = fileList[0];
      setImageUrl(URL.createObjectURL(selectedFile));
      setImage(selectedFile.name);
      setImageFile(selectedFile);
    }
  };

  return (
    <>
    <div id='unprint'>
      <div id="userForm">
        <div id='loadImage'>
        <img src={imageUrl || (image === user?.image ? `/images/users/${user.image}` : image!)} alt="avatar" className='main_img' />
          <input type='file' onChange={handleFileChange} accept='image/*'></input>
          <span>Choose Image</span>
        </div>
          <div id='userInformation'>
          <div id='accountInputs'>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                required
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div id='progress'>
            Your progress: {`${completedlessons?.length || 0}/${countLessons} (${Math.round(((completedlessons?.length || 0) / countLessons) * 100)}%)`}
          </div>
          <div id='accountButtons'>
            <button disabled={username === user?.username && image === user?.image} type="button" onClick={handleChanges}>Save changes</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      </div>
      <input type="button" value="Print my Account" onClick={() => window.print()}></input>
      <div className='bottom'>
        <Footer />
      </div>
    </div>
    <div id='print'> 
    <img src={imageUrl || (image === user?.image ? `/images/users/${user.image}` : image!)} alt="avatar" className='main_img' />
      <div id='printInfo'>
        <div>User: {user?.username}</div>
        <div>Email: {user?.email}</div>
        <div>Lessons on the following topics have been completed:</div>
        <ul>
          {lessons?.sort((a, b) => a.id - b.id).map((lesson) => (
            completedlessons && completedlessons.includes(lesson.id) && (
              <li key={lesson.id}>
                {lesson.id} - {lesson.title}
              </li>
            )
          ))}
        </ul>
        <div>
        The overall progress of the lessons: {`${completedlessons?.length || 0}/${countLessons} (${Math.round(((completedlessons?.length || 0) / countLessons) * 100)}%)`}
        </div>
      </div>
    </div>
    </>
  );
}
