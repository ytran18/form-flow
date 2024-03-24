import { useSelector } from 'react-redux';
import { assigneePackageSelector } from '../selectors';

export const useAssigneePackageHook = () => {
    return useSelector(assigneePackageSelector);
};