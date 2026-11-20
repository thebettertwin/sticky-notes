import type { CSSProperties } from 'react';
import type { NoteColour } from '../sticky-note/noteColours';
import './ColourPicker.css';

interface ColourPickerProps {
    swatches: readonly NoteColour[];
    selectedColour: string;
    onSelectColour: (colour: string) => void;
}

function ColourPicker({ swatches, selectedColour, onSelectColour }: ColourPickerProps) {
    return (
        <div className="colour-picker">
            {swatches.map(({ name, value }) => (
                <button
                    key={value}
                    type="button"
                    className={`colour-swatch${selectedColour === value ? " selected" : ""}`}
                    style={{ "--swatch-colour": value } as CSSProperties}
                    aria-pressed={selectedColour === value}
                    onClick={() => onSelectColour(value)}
                    aria-label={name}
                    title={name}
                />
            ))}
        </div>
    );
}

export default ColourPicker;