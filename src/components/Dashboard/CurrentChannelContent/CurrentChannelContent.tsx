import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery  from '@mui/material/useMediaQuery';

import { setIsRecording, setCurrentChannelView, setNavView } from 'reducers/CurrentContentReducer';
import { useAppSelector, useMediaRecorder, useAppDispatch, useFetch } from 'hooks';
import { setBrowseChannelsContent } from 'reducers/CurrentContentReducer';
import CurrentChannelContentThread from '../CurrentChannelContentThread/CurrentChannelContentThread'

const CurrentChannelContent = (): JSX.Element => {
    const { currentChannelContent, isRecording } = useAppSelector((state) => state.currentContent);
    const { userData } = useAppSelector((state) => state.userData);
    const { allChannelsListData } = useAppSelector((state) => state.channelsList);
    const { startRecordingAudio, stopRecordingAudio, clearMediaRecorderState } = useMediaRecorder();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const { editChannelUsers } = useFetch();
    
    if(!currentChannelContent) return;

    const { name, createdAt, recordings, users } = currentChannelContent;

    const whetherUserBelongsToChannel = (usersList: UsersListData[]) => {
        const { name } = userData
        if (usersList.some( (user) => user.name === name )) return true
    }

    const handleJoinChannel = (channelName: string): void => {
        const { email } = userData
        const usersEmails = { userEmails: [email] };
        editChannelUsers(channelName, usersEmails);
    }

    const handleBrowseChannels = () => dispatch( setBrowseChannelsContent(allChannelsListData) )

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

    const handleStartRecording = (): void => {
        startRecordingAudio()
        dispatch(setIsRecording(true))
    }

    const handleStopRecording = (): void => {
        stopRecordingAudio();
        clearMediaRecorderState();
        dispatch(setIsRecording(false));
    }

    const renderContent = (): JSX.Element[] => {
        return recordings.map( record => {
            const {id, user: { name, settings: { imageUrl } }, createdAt, filename, transcription } = record;

            const transcribeName = transcription?.filename || '';
            const convertedTime = convertTime(createdAt);

           return(
                <CurrentChannelContentThread key={id} name={name} createdAt={convertedTime} audioName={filename} transcribeName={transcribeName} imageUrl={imageUrl}/>
           )
        })
    }

    const handleBackToPrevSection = (): void => {
        dispatch(setNavView(true))
        dispatch(setCurrentChannelView(false))
    }

    return(
        <Container component="main" sx={{ position: 'relative', maxWidth: '1920px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '0', marginRight: '0' }}>
                      
            <Box sx={{ textAlign: 'center' }} >
            <ArrowBackIcon onClick={handleBackToPrevSection} sx={{ display: isMobile ? 'block' : 'none', color: '#ffffffb2', mt: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', mt: isMobile ? 2 : 0, borderBottom: '1px solid #ffffffb2' }}>
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

            {whetherUserBelongsToChannel(users) ? 
                <Box component="span" sx={{ marginBottom: '50px' }}>
                {isRecording ? 
                    <Button variant="contained" onClick={ handleStopRecording } sx={{ backgroundColor: 'rgba(0, 0, 0, 0.54)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                        Send a voice message
                    </Button>
                    :
                    <Button variant="contained" onClick={ handleStartRecording }  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.54)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                        Record a voice message
                    </Button>
                }
                </Box>
                :
                <Box sx={{ marginBottom: '50px', display: 'flex' , flexDirection: 'column', alignItems: 'center', backgroundColor: 'rgba(149, 149, 149, 0.1)' }}>
                    <Typography variant='h5'>
                        Channel: {name}
                    </Typography>
                    <Button onClick={() => handleJoinChannel(name)} variant="contained" sx={{ mt: 2, mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.54)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }}>
                        Join
                    </Button>
                    <Button variant="text" onClick={handleBrowseChannels} sx={{ color: '#ffffffb2' }}>
                        Back To All Channels
                    </Button>
                </Box>
            }
        </Container>
    )
}

export default CurrentChannelContent;