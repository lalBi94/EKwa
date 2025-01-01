/**
 * Create function supportable by app
 * @param {string} str The function  in string
 * @returns {function} Function assiociate
 */
export const composeFunction = (str) => {
    try {
        return eval("(x)=>" + str);
    } catch (err) {
        return null;
    }
};
