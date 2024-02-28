import styled from 'styled-components'

const Black = styled.button`
    background-color: black;
    color: #DFA685;
    border-radius: 5px;
    box-shadow: 0 7px 1px 0px rgb(41, 41, 41), 3px 0 3px 0px rgba(0, 0, 0, 0.5);
    width: 2.3%;
    height: 68%;
    border-bottom-left-radius: 9%;
    border-bottom-right-radius: 9%;
    margin-right: -1.1vw;
    z-index: 15;
    margin-left: -1.1vw;
    box-sizing: border-box;
    font-weight: bold;
    font-size: 1.3vw;

    &:active, &.active {
        background-color: #8a7f6f;
        box-shadow: none;
    }
`

const White = styled.button`
    background-color: white;
    color: #582406;
    border-radius: 3px;
    width: 5%;
    box-shadow: 0px 0.2vmax 2px 1px rgb(120, 120, 120);
    box-sizing: border-box;
    border: 0.1vw solid black;
    font-weight: bold;
    font-size: 1.3vw;

    &:active, &.active {
        background-color: #8a7f6f;
        box-shadow: none;
    }
`

export type NoteProps = {
    note: string;
    color: string;
    keyboard: string;
    clickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Note: React.FC<NoteProps> = ({ note, color, keyboard, clickHandler}) => {

    return (
        color === 'white' ? (
            <White value={note} onClick={clickHandler} id={note.trim()}>{keyboard}</White>
        ) : (
            <Black value={note} onClick={clickHandler} id={note.trim()}>{keyboard}</Black>
        )
    )
}

export default Note;