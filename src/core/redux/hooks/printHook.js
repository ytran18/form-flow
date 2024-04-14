import { useSelector } from 'react-redux';
import { printPackageSelector } from '../selectors';

export const usePrintPackageHook = () => {
    return useSelector(printPackageSelector);
};