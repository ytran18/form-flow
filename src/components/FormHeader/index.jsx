import React from "react";

import { Button, Tooltip } from 'antd';

import IconForm from '@icon/iconForm.svg';
import IconEye from '@icon/iconEye.svg';
import IconTrash from '@icon/iconTrash.svg';

const FormHeader = (props) => {

    const { handleSend } = props;

    return(
        <div className="w-full h-full flex items-center justify-between px-8 ml:px-20">
            <div className="flex items-center gap-3">
                <IconForm className="cursor-pointer"/>
                <div className="font-semibold text-xl">Untitled forms</div>
            </div>
            <div className="flex items-center gap-5">
                <Tooltip
                    placement="bottom"
                    title="Preivew"
                    arrow={false}
                    color="#9b9b9b"
                >
                    <IconEye className="cursor-pointer" />
                </Tooltip>

                <Button
                    type="primary"
                    className="bg-[rgb(103,58,183)]"
                    onClick={() => handleSend('save')}
                >
                    Send
                </Button>

                <Tooltip
                    placement="bottom"
                    title="Delete"
                    arrow={false}
                    color="#9b9b9b"
                >
                    <IconTrash className="cursor-pointer" />
                </Tooltip>

            </div>
        </div>
    );
};

export default FormHeader;