// It is best practise to organize your cloud functions group into their own file. You can then import them in your main.js.

const cloud = function () {

    import('./functions.js');
}

export default cloud;


