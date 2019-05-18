export default (mapping, initialState) => ((state = initialState, action) => {
    // If unknown, just return old state.
    if (!mapping[action.type]) return state;

    // Map old state to new state
    return mapping[action.type](state, action);
});
