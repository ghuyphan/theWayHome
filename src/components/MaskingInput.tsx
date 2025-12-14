import { useState, useRef, useEffect } from 'react';

/**
 * MaskingInput - Ô nhập liệu bị "kiểm soát"
 * 
 * Mô phỏng việc không thể nói thật với gia đình về cảm xúc của mình
 * Dù người dùng gõ gì, ô input chỉ hiển thị câu trả lời "ngoan" đã định sẵn
 */
interface MaskingInputProps {
    onSend: (displayText: string, realText: string) => void;
    targetText?: string;
}

function MaskingInput({ onSend, targetText }: MaskingInputProps) {
    // Câu trả lời "ngoan" mặc định nếu không có prop
    const DEFAULT_RESPONSE = "Dạ, con đang đặt rồi ạ. Con sẽ về sớm nhất có thể...";
    const MASKED_RESPONSE = targetText || DEFAULT_RESPONSE;

    const [displayText, setDisplayText] = useState<string>('');
    const [realText, setRealText] = useState<string>(''); // Những gì người dùng thực sự muốn gõ
    const [charIndex, setCharIndex] = useState<number>(0);
    const [showGlitch, setShowGlitch] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Hiệu ứng "glitch" khi có sự khác biệt giữa ý muốn và hiển thị
    useEffect(() => {
        if (realText.length > 0 && realText !== displayText) {
            setShowGlitch(true);
            const timeout = setTimeout(() => setShowGlitch(false), 150);
            return () => clearTimeout(timeout);
        }
    }, [realText, displayText]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Ngăn chặn hành vi mặc định
        e.preventDefault();

        if (e.key === 'Backspace') {
            // Cho phép xóa ký tự
            if (charIndex > 0) {
                setCharIndex(prev => prev - 1);
                setDisplayText(MASKED_RESPONSE.slice(0, charIndex - 1));
                setRealText(prev => prev.slice(0, -1));
            }
            return;
        }

        if (e.key === 'Enter') {
            // Gửi tin nhắn
            if (displayText.length > 0) {
                onSend(displayText, realText);
                setDisplayText('');
                setRealText('');
                setCharIndex(0);
            }
            return;
        }

        // Bỏ qua các phím điều khiển
        if (e.key.length !== 1) return;

        // Ghi lại những gì người dùng thực sự muốn gõ
        setRealText(prev => prev + e.key);

        // Nhưng chỉ hiển thị ký tự tiếp theo từ câu trả lời "ngoan"
        if (charIndex < MASKED_RESPONSE.length) {
            setDisplayText(MASKED_RESPONSE.slice(0, charIndex + 1));
            setCharIndex(prev => prev + 1);
        }
    };

    return (
        <div className="masking-input-container">
            <input
                ref={inputRef}
                type="text"
                className={`chat-input ${showGlitch ? 'glitch' : ''}`}
                value={displayText}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                onChange={() => { }} // Controlled input
                style={{
                    animation: showGlitch ? 'glitch-shake 0.1s ease-in-out' : 'none',
                }}
            />
            <style>{`
        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .glitch {
          color: var(--text-faded) !important;
          text-shadow: 
            1px 0 rgba(255, 0, 0, 0.3),
            -1px 0 rgba(0, 255, 0, 0.3);
        }
      `}</style>
        </div>
    );
}

export default MaskingInput;
