import { Icon } from '@telegram-apps/telegram-ui/dist/types/Icon';

export const Icon28Pencil = ({ ...restProps }: Icon) => (
    <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" {...restProps}>
        <path
            d="M18.586 2.586a2 2 0 012.828 0l3 3a2 2 0 010 2.828l-12 12a1 1 0 01-.414.263l-5.5 1.5a1 1 0 01-1.263-1.263l1.5-5.5a1 1 0 01.263-.414l12-12zM17.172 5L6.5 15.672l-.947 3.5 3.5-.947L21 7.828 17.172 5z"
            fill="var(--tg-theme-hint-color)"
        />
        <path
            d="M4 24h20a1 1 0 110 2H4a1 1 0 110-2z"
            fill="var(--tg-theme-hint-color)"
        />
    </svg>
);