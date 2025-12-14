import { useState, useEffect, useRef } from 'react';

/**
 * RepellingButton - Nút "Thanh toán" chạy trốn khi chuột đến gần
 * 
 * Mô phỏng sự bất lực khi cố gắng hoàn thành một nhiệm vụ đơn giản
 * nhưng không thể chạm tay vào được - giống như executive dysfunction
 */
interface RepellingButtonProps {
    children: React.ReactNode;
    onClick: () => void;
}

function RepellingButton({ children, onClick }: RepellingButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [attempts, setAttempts] = useState<number>(0);

    // Bán kính phát hiện chuột (px)
    const DETECTION_RADIUS = 150;
    // Khoảng cách đẩy tối đa (px)
    const MAX_PUSH = 120;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!buttonRef.current || !containerRef.current) return;


            const container = containerRef.current;

            const containerRect = container.getBoundingClientRect();

            // Tâm của nút (tính theo vị trí gốc, không phải vị trí đã dịch chuyển)
            const buttonCenterX = containerRect.left + containerRect.width / 2;
            const buttonCenterY = containerRect.top + containerRect.height / 2;

            // Vị trí chuột
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Tính khoảng cách từ chuột đến tâm nút
            const deltaX = buttonCenterX + offset.x - mouseX;
            const deltaY = buttonCenterY + offset.y - mouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Nếu chuột trong vùng phát hiện
            if (distance < DETECTION_RADIUS) {
                // Đếm số lần cố gắng
                if (distance < 80) {
                    setAttempts(prev => prev + 1);
                }

                // Tính lực đẩy (càng gần càng mạnh)
                const pushStrength = ((DETECTION_RADIUS - distance) / DETECTION_RADIUS) * MAX_PUSH;

                // Tính góc đẩy (hướng ngược với chuột)
                const angle = Math.atan2(deltaY, deltaX);

                // Tính offset mới
                let newX = Math.cos(angle) * pushStrength;
                let newY = Math.sin(angle) * pushStrength;

                // Giới hạn trong container (không cho nút chạy ra ngoài màn hình)
                const maxOffsetX = containerRect.width;
                const maxOffsetY = 150;

                newX = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX));
                newY = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY));

                setOffset({ x: newX, y: newY });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [offset]);

    // Reset vị trí khi chuột rời khỏi vùng
    useEffect(() => {
        const handleMouseLeave = () => {
            // Từ từ trở về vị trí gốc
            const resetInterval = setInterval(() => {
                setOffset(prev => {
                    const newX = prev.x * 0.9;
                    const newY = prev.y * 0.9;
                    if (Math.abs(newX) < 1 && Math.abs(newY) < 1) {
                        clearInterval(resetInterval);
                        return { x: 0, y: 0 };
                    }
                    return { x: newX, y: newY };
                });
            }, 50);

            return () => clearInterval(resetInterval);
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <button
                ref={buttonRef}
                className="repelling-button"
                onClick={onClick}
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
            >
                {children}
            </button>
            {attempts > 5 && (
                <div className="frustration-counter">
                    {attempts > 20
                        ? "Tại sao mình không thể làm được việc đơn giản này..."
                        : `Số lần cố gắng: ${attempts}`}
                </div>
            )}
        </div>
    );
}

export default RepellingButton;
