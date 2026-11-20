import './ColourPicker.css';

interface ColourPickerProps {
    swatches: string[];
    selectedColour: string;
    onSelectColour: (colour: string) => void;
}

function ColourPicker({ swatches, selectedColour, onSelectColour }: ColourPickerProps) {
    return (
        <div className="colour-picker">
            {swatches.map((colour) => (
                <button
                    key={colour}
                    className={`colour-swatch${selectedColour === colour ? " selected" : ""}`}
                    style={{ backgroundColor: colour }}
                    onClick={() => onSelectColour(colour)}
                    aria-label={`Select colour ${colour}`}
                />
            ))}
        </div>
    );
}

export default ColourPicker;