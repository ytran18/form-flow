export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const VSH = (val, ...arrs) => {
    let ars = arrs;
    if(Array.isArray(arrs?.[0])) {
        ars = arrs[0];
    }

    let count = 0;
    for(let i=0; i<ars?.length; i++) {
        if(val < (ars[i]-0)) return count;
        count = i+1;
    }
    return count;
};

export const VSO = (iw, obj) => {
    const arrs = Object.keys(obj);
    const idx = VSH(iw, ...arrs) || arrs.length;
    return obj[arrs[idx-1]];
};

export const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
};

export const getLastWordFirstChar = (name) => {
    const words = name.split(' ');
    const lastWord = words[words.length - 1];
    return lastWord.charAt(0).toLowerCase();
};

export const unixTimeToFormattedTime = (unixTime) => {
    const date = new Date(unixTime * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2, '0')}`;
    return {formattedTime, unixTime};
};

export const formatName = (name) => {
    if (typeof name !== 'string') return;

    const arr = name.trim().toLowerCase().split(' ');
    const format = arr.map(item => item.charAt(0).toUpperCase() + item.slice(1));
    return format.join(' ');
};

export const setTime = (date, year, month, day) => {
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    return date;
};