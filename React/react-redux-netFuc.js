//react-redux中最常见的回调  为了不重复自己 单独做一个函数子组件

const  nf = (data, fun, )=>{      //
    this.data =data;
    return dispatch => {
        dispatch(appActions.startRequest());
        return post(url.createComment(), comment)
            .then(data => {
                dispatch(appActions.finishRequest());
                if(!data.error){
                    dispatch(createCommentSuccess(data.post, data));
                }else{
                    dispatch(appActions.setError(data.error))
                }
            });
    };
}