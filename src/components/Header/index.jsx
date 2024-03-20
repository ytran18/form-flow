import React, { useState } from "react";

import { Avatar, Button, Input, Popover, Upload, message } from 'antd';
import { UserOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import IconForm from '@icon/iconForm.svg';
import IconClose from '@icon/iconClose.svg';

const { Search } = Input;

const Header = () => {

    const [state, setState] = useState({
        isOpenUserMenu: false,
        loading: false,
        imageUrl: "",
    });

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const onOpenChange = (status) => {
        state.isOpenUserMenu = status;
        setState(prev => ({...prev}));
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            state.loading = true;
            setState(prev => ({...prev}));
            return;
        };

        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                state.loading = false;
                state.imageUrl = url;
                setState(prev => ({...prev}));
            });
        };
    };

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>
                Upload
            </div>
        </button>
    );

    return (
        <div className="w-full h-full flex items-center justify-between px-8 ml:px-20">
            <div className="flex items-center gap-3">
                <IconForm className="cursor-pointer"/>
                <div className="font-semibold text-xl">Forms</div>
            </div>
            <div className="w-2/5">
                <Search
                    placeholder="Search forms ..."
                    size="large"
                />
            </div>
            <div>
                <Popover
                    trigger={"click"}
                    placement="bottomLeft"
                    open={state.isOpenUserMenu}
                    onOpenChange={onOpenChange}
                    title={
                        <div className="flex justify-end">
                            <IconClose
                                className="cursor-pointer"
                                onClick={() => onOpenChange(false)}
                            />
                        </div>
                    }
                    content={
                        <div className="flex flex-col items-center gap-3">
                            <div className="">ynhutran84@gmail.com</div>
                            <Upload
                                name="avatar"
                                listType="picture-circle"
                                className="avatar-uploader !flex !justify-center"
                                showUploadList={false}
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {
                                    state.imageUrl ? (
                                        <img
                                            src={state.imageUrl}
                                            alt="avatar"
                                            style={{width: '100%', borderRadius: '50px'}}
                                        />
                                    ) : (
                                        uploadButton
                                    )
                                }
                            </Upload>
                            <Button className="w-full">Change Password</Button>
                            <Button className="w-full" danger>Log out</Button>
                        </div>
                    }
                >
                    <Avatar
                        style={{background: '#87d068'}}
                        icon={<UserOutlined />}
                        className="cursor-pointer"
                    />
                </Popover>
            </div>
        </div>
    );
};

export default Header;