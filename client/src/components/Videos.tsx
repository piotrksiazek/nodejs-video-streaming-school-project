import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Upload } from './Upload';
import { VideoPlayer } from './VideoPlayer';
import jwt from 'jwt-decode';
import axios from 'axios';

export interface User {
    userId: number;
}

interface PathResult {
    id: number;
    path: string;
    userId: number;
}

export const Videos = () => {
    const navigate = useNavigate();
    const [paths, setPaths] = useState<PathResult[]>([])

    useEffect(() => {
        const token = Cookies.get("token");

        if (token === undefined) {
            navigate("/");
        }

        const fetchPaths = async () => {
            const {data} = await axios.get("upload/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const dataTyped = data as PathResult[];
            setPaths(dataTyped);
        }
        fetchPaths();
    }, [])
    return <div>
        <Upload></Upload>
        <h1>Videos</h1>
        {paths.map(element => <VideoPlayer src={`static/${element.path}`}></VideoPlayer>)}
    </div>
}