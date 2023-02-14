import React from "react";
import { Box, Avatar } from '@mui/material';

import { useFetch } from 'hooks';


const CurrentContentThread = (props: any): JSX.Element => {
    const [blob, setBlob] = React.useState<any>(null)
    const [text, setText] = React.useState<any>(null)
    const [userImage, setUserImage] = React.useState<any>(null)
    const { getTranscriptionFile, getRecording, getUserAvatar } = useFetch();

    const { name, createdAt, audioName, transcribeName, imageUrl } = props;

    React.useEffect(() => {
        getRecording(audioName).then( resp => {
            const url = URL.createObjectURL(resp as Blob);
            setBlob(url);
        });
    },[])
    
    React.useEffect(() => {
        getTranscriptionFile(transcribeName).then( resp => {
            const extractedTextData = extractTextData(resp.text);
            setText(extractedTextData[0][1]);
        })
    },[])

    React.useEffect(() => {
        const imageFilename = imageUrl?.split('/').pop();

        getUserAvatar(imageFilename).then( resp => {
            const img = URL.createObjectURL(resp as Blob);
            setUserImage(img)
        })
    },[])

    
    const extractTextData = (text: string): string[][] => {
        const result: string[][] = [];
        const lines = text.split("\n");
    
        for (const line of lines) {
          const parts = line.split(" - ");
    
          if (parts.length === 4) {
            result.push([parts[2], parts[3]]);
          }
        }
        return result;
    };

    if(!blob || !text) return;

    return(
        <Box sx={{ margin: '5px 5px', borderBottom: '1px solid #01579b' }}>
            <Box component="div" sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontSize: '12px', marginBottom: '5px', padding: '10px 0' }}>
                <Avatar src={userImage} />
                <Box>
                    <Box component="span" m="{1}">
                        {name}
                    </Box>
                    <Box component="span" m="{1}" sx={{ paddingLeft: '5px', fontSize: '10px' }}>
                        {createdAt}
                    </Box>
                </Box>
            </Box>
            <Box>
                <Box component="div" sx={{ display: 'flex' , flexDirection: 'column', alignItems: 'flex-start' }}>
                    <audio controls className="preview__audio">
                        <source src={blob} />
                    </audio>
                    <Box component="span" sx={{ padding: '5px 0', fontSize: '14px' }}>
                        {text}
                    </Box>
                </Box>
            </Box>
        </Box>

    )
}

export default CurrentContentThread;
