import React from 'react';

import { detectBrowserName } from 'helpers/browserDetect'
import { useFetch, useAppSelector } from 'hooks';

const useMediaRecorder = (): MediaRecorderData => {
    const { currentContent } = useAppSelector((state) => state.currentContent);
    const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder>(new MediaRecorder(new MediaStream()));
    const [audioBlob, setAudioBlob] = React.useState<Blob>(null);
    const [audioUrl, setAudioUrl] = React.useState('');
    const { sendRecord } = useFetch();

    const name  = currentContent?.name || '';

    const constraints = { audio: true, video: false };
    const browserName = detectBrowserName();
    
    React.useEffect(() => {
        if(!currentContent) return;

        recorderInit();
    }, [currentContent])

    const recorderInit = (): void => {
        if (!navigator.mediaDevices) return;

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                let newChunks: BlobPart[] = []
                let newMediaRecorder: MediaRecorder;

                if (browserName === 'firefox') {
                    newMediaRecorder = new MediaRecorder(stream, {mimeType:'audio/ogg;codecs=opus'})
                } else if(browserName === 'safari') {
                    newMediaRecorder = new MediaRecorder(stream, {mimeType:'audio/mp4;codecs=opus'})
                } else {
                    newMediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
                }

                newMediaRecorder.addEventListener('dataavailable', event => {
                    const data = event.data;

                    if (data && data.size > 0) newChunks.push(data);
                });

                newMediaRecorder.addEventListener('stop', () => {
                    const newBlob = new Blob(newChunks, { type: newMediaRecorder.mimeType });
                    const newAudioUrl = URL.createObjectURL(newBlob);
                    const recordData = new FormData();

                    recordData.append('room_name' , name);
                    recordData.append('browser' , browserName);
                    recordData.append('file' , newBlob);

                    sendRecord(recordData)
                    setAudioBlob(newBlob);
                    setAudioUrl(newAudioUrl);
                    newChunks = []
                })
                setMediaRecorder(newMediaRecorder);
            });
    };

    const startRecordingAudio = (): void => {
        mediaRecorder.start();
    }

    const stopRecordingAudio = (): void => {
        mediaRecorder.stop();
    }

    const playRecord = (): void => {
        const audio = new Audio(audioUrl);
        audio.play();
    }

    const clearMediaRecorderState = (): void => {
        setAudioUrl('');
        setAudioBlob(null);
    }

    const prepereRecord = (): Blob => {
        return audioBlob;
    }

    return { startRecordingAudio, stopRecordingAudio, playRecord, prepereRecord, clearMediaRecorderState }
}

export default useMediaRecorder;
