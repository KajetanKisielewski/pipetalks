import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

import { setIsRecording } from 'reducers/CurrentContentReducer';
import { useAppSelector, useMediaRecorder, useAppDispatch, useFetch } from 'hooks';

import { setBrowseChannelsContent } from 'reducers/CurrentContentReducer';
import CurrentChannelContentThread from '../CurrentChannelContentThread/CurrentChannelContentThread'

const DirectMessage = (): JSX.Element => {
    const { directMessageContent, isRecording } = useAppSelector((state) => state.currentContent);
    const { startRecordingAudio, stopRecordingAudio, clearMediaRecorderState } = useMediaRecorder();
    const dispatch = useAppDispatch();
    
    if(!directMessageContent) return;

    const { id, createdAt, recordings, users } = directMessageContent;
    const name = [ users[0].name , users[1].name ].join()

    const convertData = (): string => {
        const date = new Date(createdAt);
        return date.toISOString().split('T')[0];
    }

    const convertTime = (date: string): string => {
        let hours = +date.substring(11, 13);
        let minutes = +date.substring(14, 16);

        hours = hours % 12 || 12;
        minutes = minutes < 10 ? 0 + minutes : minutes;

        const am_pm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = hours + ':' + minutes + ' ' + am_pm;

        return formattedTime;
    }

    const handleStartRecording = () => {
        startRecordingAudio()
        dispatch(setIsRecording(true))
    }

    const handleStopRecording = () => {
        stopRecordingAudio();
        clearMediaRecorderState();
        dispatch(setIsRecording(false));
    }

    const renderContent = () => {
        return recordings?.map( record => {
            const {id, createdAt, filename, transcription } = record;

            const transcribeName = transcription?.filename || '';
            const convertedTime = convertTime(createdAt);

           return(
                <CurrentChannelContentThread key={id} name={name} createdAt={convertedTime} audioName={filename} transcribeName={transcribeName} imageUrl={null}/>
           )
        })
    }

    return(
        <Container component="main" sx={{ maxWidth: '1920px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '0', marginRight: '0' }}>
            <Box sx={{ textAlign: 'center' }} >

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', borderBottom: '2px solid #01579b' }}>
                    <Typography component="h2" variant="body1">
                        {name}
                    </Typography>
                    <Typography component="span" variant="body1">
                        {convertData()}
                    </Typography>
                </Box>
                
                <Box>
                    {renderContent()}
                </Box>

            </Box>

            <Box component="span" sx={{ marginBottom: '50px' }}>
                {isRecording ? 
                    <Button variant="contained" onClick={ handleStopRecording }>
                        Send a voice message
                    </Button>
                    :
                    <Button variant="contained" onClick={ handleStartRecording }>
                        Record a voice message
                    </Button>
                }
            </Box>
        </Container>
    )
}

export default DirectMessage;