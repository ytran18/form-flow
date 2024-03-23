import { useSelector } from 'react-redux';
import { formPackageSelector } from '../selectors';

export const useFormPackageHook = () => {
    return useSelector(formPackageSelector);
};