const notify = {
    state: () => ({
        notify: {
            type: '',
            message: '',
            isShow: false
        }
    }),
    mutations: {
        SET_NOTIFY(state, payload) {
            state.notify = payload;
        }
    },
    actions: {
        async openNotify({ commit, dispatch }, payload) {
            await commit('SET_NOTIFY', { type: payload.type, message: payload.message, isShow: true });
            setTimeout(() => {
                dispatch('closeNotify')
              }, 3000);
        },
        closeNotify({ commit }) {
            commit('SET_NOTIFY', { type: '', message: '', isShow: false });
        }
    },
    getters: {
        getNotify: (state) => state.notify,
    },
    namespaced: true
};

export default notify;