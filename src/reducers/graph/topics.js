export const topics = {
    DEFAULT: {name: 'default', id: 0},
    BLOCKS: {name: 'blocks', id: 1}
};

export const topicToName = (id) => {
    switch (id) {
        case 0: return 'default';
        case 1: return 'blocks';
    }
};
