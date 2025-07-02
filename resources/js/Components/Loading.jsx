import React from "react";
import { Spin } from "antd";

const Loading = () => {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <Spin size="large" className="scale-250 mb-4" />
                <p className="text-lg text-amber-600">Loading...</p>
            </div>
        );
    };

    export default Loading;