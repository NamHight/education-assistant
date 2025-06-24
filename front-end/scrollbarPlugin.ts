// tailwind/plugins/scrollbars.ts
export const scrollbarPlugins = ({ addUtilities }: { addUtilities: any }) => {
    const scrollbarUtilities = {
        '.thin-scrollbar': {
            '&::-webkit-scrollbar': {
                width: '4px',
            },
            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#E0E0E0',
                borderRadius: '0px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
                background: '#BDBDBD',
            },
        },
        '.hide-scrollbar': {
            '&::-webkit-scrollbar': {
                display: 'none',
            },

        },
        '.custom-scrollbar': {
            '&::-webkit-scrollbar': {
                width: '8px',
            },
            '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
            },
            'scrollbarWidth': 'thin',
            'scrollbarColor': '#888 #f1f1f1',
        }
    };

    addUtilities(scrollbarUtilities);
};