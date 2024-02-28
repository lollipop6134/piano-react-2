import React, { useEffect, useState } from "react"
import Piano from "../../components/piano/piano"
import { NoteProps } from "../../components/note/note";

export function PianoPage() {
  const [pianoNotes, setPianoNotes] = useState<NoteProps[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/notes')
      .then(response => response.json())
      .then(data => {
        setPianoNotes(data as NoteProps[]);
        setDataLoaded(true);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [dataLoaded, pianoNotes]);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.repeat) return;
    const key = event.key.toUpperCase();
    const noteIndex = pianoNotes.findIndex(note => note.keyboard === key);
    if (noteIndex !== -1) {
      const note = pianoNotes[noteIndex];
      const audio = new Audio(`/audio/${(note.note).trim()}.mp3`);
      if (audio) {
        audio.play();
        const keyElement = document.getElementById((note.note).trim());
        if (keyElement) {
          keyElement.classList.add('active');
          setTimeout(() => {
            keyElement.classList.remove('active');
          }, 300);
        }
      }
    }
  };
  
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const audio = new Audio(`/audio/${(e.currentTarget.value).trim()}.mp3`)
      audio.play();
    }

    return (
        <>
          <Piano pianoNotes={pianoNotes!} clickHandler={handleClick}/>
        </>
    )
}