export const convertTime = (duration) => {
    if (duration) {
        const hrs = duration / 60;
        const min = hrs.toString().split('.')[0];
        const per = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * per) / 100);
        if (parseInt(min) < 10 && sec < 10) {
            return `0${min}:0${sec}`;
        }
        if (parseInt(sec) === 60) {
            return `0${parseInt(min) + 1}:00`;
        }
        if (parseInt(min) < 10) {
            return `0${min}:${sec}`;
        }
        if (parseInt(sec) < 10) {
            return `0${min}:${sec}`;
        }
        return `${min}:${sec}`;
    }
};