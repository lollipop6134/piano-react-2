import './lessonConstructor.css';
import { useParams } from 'react-router-dom';
import { Footer } from '../../components/footer/footer';
import React, { useState, useEffect } from 'react';
import { Lesson } from '../lessonPage/lessonPage';
import axios from 'axios';

export function LessonConstructor() {
    const { id } = useParams<{ id?: string }>();
    const [isLoad, setIsLoad] = useState(false);
    const [title, setTitle] = useState<string | null>(null);
    const [information1, setInformation1] = useState<string | null>(null);
    const [information2, setInformation2] = useState<string | null>(null);
    const [information3, setInformation3] = useState<string | null>(null);
    const [information4, setInformation4] = useState<string | null>(null);
    const [information5, setInformation5] = useState<string | null>(null);
    const [subtitle, setSubtitle] = useState<string | null>(null);
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [image3, setImage3] = useState<string | null>(null);
    const [imageFile1, setImageFile1] = useState<File | null>(null);
    const [imageFile2, setImageFile2] = useState<File | null>(null);
    const [imageFile3, setImageFile3] = useState<File | null>(null);
    const [previewImage1, setPreviewImage1] = useState<string | null>(null);
    const [previewImage2, setPreviewImage2] = useState<string | null>(null);
    const [previewImage3, setPreviewImage3] = useState<string | null>(null);    

    useEffect(() => {
        fetch(`http://localhost:3001/lessons?id=${id}`)
            .then(response => response.json())
            .then(data => {
                const lessonData = data[0] as Lesson;
                setTitle(lessonData.title || '');
                setInformation1(lessonData.information[0] || '');
                setInformation2(lessonData.information[1] || '');
                setInformation3(lessonData.information[2] || '');
                setInformation4(lessonData.information[3] || '');
                setInformation5(lessonData.information[4] || '');
                setImage1(lessonData.lesson_images[0] || '');
                setImage2(lessonData.lesson_images[1] || '');
                setImage3(lessonData.lesson_images[2] || '');
                setSubtitle(lessonData.subtitle || '');
                setIsLoad(true);
            })
            .catch(error => console.error('Error:', error));
    }, [id]);

    async function editLesson(lessonId: number) {
        const information = [information1, information2, information3, information4, information5];
        const lessonImages = [image1, image2, image3];
        const imageFiles = [imageFile1, imageFile2, imageFile3];
        for (let i = 0; i < lessonImages.length; i++) {
            if (lessonImages[i] && imageFiles[i]) {
              const formData = new FormData();
              formData.append('image', imageFiles[i]!);
              try {
                await axios.post('http://localhost:3001/uploadLessons', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
              } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file. Please try again.');
                return;
              }
            }
          }
        try {
          const response = await axios.post('http://localhost:3001/editLesson', {
            subtitle, title, information, lessonId, lessonImages,
          });
          return response.data;
        } catch (error) {
          console.error('Error editing lesson: ', error);
          throw error;
        } finally {
            window.location.reload();
        }
      }

      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<string | null>>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const fileInput = event.target;
        if (fileInput.files && fileInput.files.length > 0) {
          const selectedFile = fileInput.files[0];
          setImage(selectedFile.name);
          setFile(selectedFile);
          setPreviewImage(URL.createObjectURL(selectedFile));
        }
      };

    return (
        <>
        {!isLoad && <div id='preloader'> Just a moment <div id='loader'></div></div>}
            <div id="lessonPage">
            <div id="lessonTitle">
            <input
                value={title || ''}
                type='text'
                required
                onChange={(e) => setTitle(e.target.value)}>
            </input>
            </div>
            <div className='lessonSection'>
                <div className='lessonParagraph'>
                    <textarea
                        value={information1 || ''}
                        required
                        onChange={(e) => setInformation1(e.target.value)}>
                    </textarea>
                </div>
                <div id='loadImage'>
                <img src={previewImage1 || `/images/${image1}`} alt="1" className='main_img'/>
                <input type='file' onChange={(e) => handleFileChange(e, setImage1, setImageFile1, setPreviewImage1)} accept='image/*'></input>
                    <span>Choose Image</span>
                </div>
            </div>
            <div className='lessonSection'>
                    <textarea
                        value={information2 || ''}
                        required
                        onChange={(e) => setInformation2(e.target.value)}>
                    </textarea>
            </div>
            <div className='lessonSection'>
                <div id='loadImage'>
                <img src={previewImage2 || `/images/${image2}`} alt="2" className='main_img'/>
                <input type='file' onChange={(e) => handleFileChange(e, setImage2, setImageFile2, setPreviewImage2)} accept='image/*'></input>
                    <span>Choose Image</span>
                </div>
                <div className='lessonParagraph'>
                    <textarea
                        value={information3 || ''}
                        required
                        onChange={(e) => setInformation3(e.target.value)}>
                    </textarea>
                </div>
            </div>
            <div className='lessonSection №5'>
                <div className='lessonParagraph'>
                    <textarea
                        value={information4 || ''}
                        required
                        onChange={(e) => setInformation4(e.target.value)}>
                    </textarea>
                </div>
                <div id='loadImage'>
                <img src={previewImage3 || `/images/${image3}`} alt="3" className='main_img'/>
                <input type='file' onChange={(e) => handleFileChange(e, setImage3, setImageFile3, setPreviewImage3)} accept='image/*'></input>
                    <span>Choose Image</span>
                </div>
            </div>
            <div className='lessonSection'>
                <textarea
                    value={information5 || ''}
                    onChange={(e) => setInformation5(e.target.value)}>
                </textarea>
            </div>
            <div id='otherSettings'>
                <div id='subtitle'>
                    Subtitle: 
                    <input
                        value={subtitle || ''}
                        type='text'
                        required
                        onChange={(e) => setSubtitle(e.target.value)}>
                    </input>
                </div>
            </div>
            <button
                className='main-button'
                onClick={() => editLesson(Number.parseInt(id!))}>
                Save changes
            </button>
        </div>
        <Footer />
        </>
    )
}