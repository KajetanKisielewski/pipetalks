import React from "react";
import { Box } from '@mui/material';

import { useFetch } from 'hooks';

const CurrentContentThread = (props: any): JSX.Element => {
    const [blob, setBlob] = React.useState<any>(null)
    const [text, setText] = React.useState<any>(null)
    const { getTranscribe, getRecording } = useFetch();

    const { audioName, transcribeName } = props;

    React.useEffect(() => {
        getRecording(audioName).then( resp => {
            const url = URL.createObjectURL(resp as Blob);
            setBlob(url);
        });
    },[])
    
    React.useEffect(() => {
        getTranscribe(transcribeName).then( resp => {
            const extractedTextData = extractTextData(resp.text);
            setText(extractedTextData[0][1]);
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
        <Box component="div" sx={{ display: 'flex' , flexDirection: 'column', alignItems: 'flex-start' }}>
            <audio controls className="preview__audio">
                <source src={blob} />
            </audio>
            <Box component="span" sx={{ padding: '5px 0', fontSize: '14px' }}>
                {text}
            </Box>
        </Box>
    )
}

export default CurrentContentThread;
