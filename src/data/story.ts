export interface StoryMessage {
    id: number;
    sender: string;
    content: string;
    type: 'text' | 'image' | 'system';
    delay: number; // Delay in ms before this message appears after trigger
    trigger?: string; // Optional trigger event
}

export const STORY_TIMELINE: StoryMessage[] = [
    {
        id: 1,
        sender: 'Mẹ',
        content: 'Con đặt vé chưa? Mọi người đang hỏi đấy.',
        type: 'text',
        delay: 500,
    },
    {
        id: 2,
        sender: 'Mẹ',
        content: 'Năm nay con có về không? Bà ngoại nhớ con lắm.',
        type: 'text',
        delay: 2500,
    },
    {
        id: 3,
        sender: 'Ba',
        content: '[Hình ảnh vé tàu đã hết]',
        type: 'system',
        delay: 10000,
    },
    {
        id: 4,
        sender: 'Mẹ',
        content: 'Sao con không trả lời?',
        type: 'text',
        delay: 5000,
    },
    {
        id: 5,
        sender: 'Em Gái',
        content: 'Anh Hai ơi, năm nay anh về nhớ mua quà cho em nha! Em thích bộ lego mới lắm.',
        type: 'text',
        delay: 8000,
    },
    {
        id: 6,
        sender: 'Mẹ',
        content: '[Hình ảnh mâm cơm tất niên năm ngoái]',
        type: 'system',
        delay: 12000,
    },
    {
        id: 7,
        sender: 'Mẹ',
        content: 'Mẹ làm món thịt kho hột vịt con thích nhất nè. Về sớm ăn nóng nha con.',
        type: 'text',
        delay: 4000,
    },
    {
        id: 8,
        sender: 'Ba',
        content: 'Vé máy bay thì sao? Hay đi tàu cho tiết kiệm?',
        type: 'text',
        delay: 10000,
    },
    {
        id: 9,
        sender: 'Mẹ',
        content: 'Con đừng áp lực quá, miễn con về là vui rồi. Nhưng mà... hàng xóm họ cứ hỏi thăm hoài.',
        type: 'text',
        delay: 6000,
    }
];

export const MASKED_RESPONSES = [
    "Dạ con đang xem vé đây ạ.",
    "Mạng công ty con hơi yếu, để con xem lại.",
    "Con biết rồi, mẹ đừng lo.",
    "Con sẽ cố gắng về.",
    "Chắc chắn con sẽ về mà."
];
