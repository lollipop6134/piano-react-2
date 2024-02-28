import './piano.css';
import Note from '../note/note';
import { NoteProps } from '../note/note';

type Props = {
  pianoNotes: NoteProps[];
  clickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Piano: React.FC<Props> = ({ pianoNotes, clickHandler }) =>{

    return (
        <>
            <div id="rotate">Please, rotate your phone<img src='/images/RotatePhone.png' alt='rotate phone' /></div>
            <div id="piano">
                {pianoNotes.map((element: NoteProps) => (
                  <Note
                    note={element.note}
                    key={element.note}
                    color={element.color}
                    clickHandler={clickHandler}
                    keyboard={element.keyboard}
                  />
                ))}
            </div>
        </>
    )
}

export default Piano;