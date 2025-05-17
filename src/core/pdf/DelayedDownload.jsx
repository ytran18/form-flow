import React, { useState } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import PdfTemplate from '@core/pdf';
import IconDownload from '@icon/iconDownload.svg';
import useResponseStore from '@store/reponseStore';
import { useFormContext } from '@pages/Form/context';

const DelayedDownload = ({ name, birthday, company, image, id }) => {
    const [showPDF, setShowPDF] = useState(false);

    const { form } = useFormContext()

    const formatAnswerById = useResponseStore(state => state.formatAnswerById);

    const answerValue = formatAnswerById(id, form);

    const handleDownload = () => {
        setShowPDF(true); // chỉ khi người dùng click, mới render PDF
    };

    return (
        <>
            {!showPDF ? (
                <div onClick={handleDownload}>
                    <IconDownload className="w-5 h-5 cursor-pointer" />
                </div>
            ) : (
                <BlobProvider
                    document={
                        <PdfTemplate
                            answer={answerValue}
                            name={name ?? ''}
                            birthday={birthday ?? ''}
                            companyName={company ?? ''}
                            image={image ?? ''}
                        />
                    }
                >
                    {({ url, loading, error }) => {
                        if (!url || !Array.isArray(answerValue)) return null;
                        // tạo và click link thủ công
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `atld-${name}.pdf`;
                        link.click();

                        // Reset state để không re-render lần nữa
                        setShowPDF(false);
                        return null;
                    }}
                </BlobProvider>
            )}
        </>
    );
};

export default DelayedDownload;