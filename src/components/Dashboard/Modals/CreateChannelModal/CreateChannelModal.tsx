import React from 'react';
import { TextField, Backdrop, Box, Modal, Fade, Typography, Switch, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { io } from "socket.io-client";

import { useAppSelector, useAppDispatch, useFetch, useLocalStorage } from 'hooks';
import { toggleCreateChannelModal, toggleAddUsersModal, setCurrentlyCreatedChannel } from 'reducers/ChannelsListReducer';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px'
};

const CreateChannelModal = (): JSX.Element => {
    const [isPublic, setIsPublic] = React.useState(true)
    const { createChannelModal } = useAppSelector((state) => state.channelsList);
    const { usersData } = useAppSelector((state) => state.userData)
    const dispatch = useAppDispatch();
    const { createChannel } = useFetch();
    const { getLocalStorage } = useLocalStorage();
    const { access_token } = getLocalStorage();
  
    // const socket = io("ws://localhost:3000", {
    //   path: "/sockets/",
    //   extraHeaders: {
    //     Authentication: access_token
    //   }
    // });

    const handleClose = () => dispatch(toggleCreateChannelModal(false))

    const createNewChannel = (): void => {
      const name = ( document.querySelector('#outlined-required') as HTMLInputElement )?.value;

        createChannel({ name, isPublic });

        // socket.emit('join', name);

        handleClose();
        dispatch(setCurrentlyCreatedChannel(name));
        
        usersData.length != 1 && dispatch(toggleAddUsersModal(true));
    }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={createChannelModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{
            backdrop: Backdrop
        }}
        slotProps={{
            backdrop: {
                timeout: 500
            }
        }}
      >
        <Fade in={createChannelModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="span">
                    { !isPublic ?  'Create a private channel' : 'Create a channel' } 
                </Box>
                <Box component="span" onClick={handleClose} sx={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </Box>
              </Box>
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Channels are where your team communicates. They’re best when organized around a topic - digimonkeys, for example.
            </Typography>
            <Box
                component="form"
                sx={{ mt: 5 }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    id="outlined-required"
                    label="Required Channel Name"
                    sx={{
                        width: '100%'
                    }}
                />
                <Typography id="transition-modal-title" variant="h6" component="h2" sx={{mt: 5 }}>
                    Make private
                </Typography>
                <Box component="div" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ mt: 2, width: '60%' }} >
                        { !isPublic ? 'This can’t be undone. A private channel cannot be made public later on.' : 'When a channel is set to private, it can only be viewed or joined by invitation.'}
                    </Typography>
                    <Switch onClick={() => setIsPublic(!isPublic)} />
                </Box>
                <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button variant='contained' onClick={createNewChannel}>
                        Create
                    </Button>
                </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default CreateChannelModal;
