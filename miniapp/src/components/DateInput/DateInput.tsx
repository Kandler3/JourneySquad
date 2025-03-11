import React, { FC } from 'react';
import { Text } from '@telegram-apps/telegram-ui';
import './DateInput.css';

type DateInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export const DateInput: FC<DateInputProps> = ({ value, onChange }) => {
    // Обрабатываем ввод: разрешаем только цифры и ограничиваем до 8 символов (ДДММГГГГ)
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        let date = e.currentTarget.value.replace(/[^\d.]/g, "");
        console.log(date);

        const inputEvent = e.nativeEvent as InputEvent;

        if (inputEvent.inputType.startsWith("insert")) {
            if (date.endsWith('.') && !([3, 6].includes(date.length))) {
                date = date.slice(0, -1);
            }

            if ([2, 5].includes(date.length)) {
                date += '.';
            }

        } else if (inputEvent.inputType.startsWith("delete"))
        {
            if ([2, 5].includes(date.length)) {
                date = date.slice(0, -1);
            }
        }
        date = date.slice(0, 10)
        console.log(date);
        onChange(date);
    };


    // Шаблон маски
    const mask = '00.00.0000';
    let digitIndex = 0;


    const parts = Array.from(mask).map((char) => {
            const isUser = digitIndex < value.length;
            const displayChar = isUser ? value[digitIndex] : char;
            digitIndex++;
            return { char: displayChar, isUser };
    });

    return (
        <div className="date-input-container">
            <Text
                Component="input"
                type="text"
                className="date-input-field"
                value={value}
                onInput={handleChange}
                maxLength={12}
            />
            <div className="date-input-mask">
                <Text>
                    {parts.map((part, index) => (
                        <Text
                            key={index}
                            Component="span"
                            style={{
                                color: part.isUser
                                    ? 'var(--tg-theme-text-color)'
                                    : 'var(--tg-theme-hint-color)',
                            }}
                        >
                            {part.char}
                        </Text>
                    ))}
                </Text>
            </div>
        </div>
    );
};
