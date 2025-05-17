import { create } from 'zustand';

const useResponseStore = create((set, get) => ({
    answerList: [],
    setAnswer: (answerList) => set(() => ({ answerList })),
    resetAnswer: () => set(() => ({ answerList: [] })),

    formatAnswerById: (id, form) => {
        const answerList = get().answerList;

        const user = answerList.find(item => item._id === id);

        const answer = user?.answers;

        if (!Array.isArray(answer)) return null;

        const answerValue = new Array(answer.length).fill(null);

        answer.forEach((item) => {
            const index = form?.questions?.findIndex(q => q?._id === item?.questionId);

            const type = item?.type_question;

            const answersArr = form?.questions?.[index]?.answer?.map((i) => i?.label);

            if (type === 'choice' || type === 'dropdown') {
                form?.questions?.[index]?.answer?.forEach((ans) => {
                    if (ans?.value === item?.value && item?.label !== 'Add option') {
                        answerValue[index] = {
                        title: form?.questions?.[index]?.title,
                        answers: answersArr,
                        label: ans?.label,
                        dap_an: item?.value
                        };
                    }
                });
            }

            if (type === 'paragraph') {
                answerValue[index] = item.value;
            }

            if (type === 'multiple-choice') {
                answerValue[index] = '';
                
                item?.value?.forEach((val) => {
                    form?.questions?.[index]?.answer?.forEach((ans) => {
                        if (ans?.value === val && item?.label !== 'Add option') {
                        answerValue[index] += answerValue[index] ? `, ${ans?.label}` : `${ans?.label}`;
                        }
                    });
                });
            }
        });

        return answerValue;
    }
}));

export default useResponseStore;