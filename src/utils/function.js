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