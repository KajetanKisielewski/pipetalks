import React from 'react';
import { Backdrop, Box, Modal, Fade, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useAppSelector, useAppDispatch } from 'hooks';
import { toggleAddUsersModal } from 'reducers/ChannelsListReducer';

import UsersList from 'components/Dashboard/UsersList/UsersList';

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

const AddUsersToChannelModal = (): JSX.Element => {
    const { addUsersModal } = useAppSelector((state) => state.channelsList);
    const dispatch = useAppDispatch();

    const handleClose = () => dispatch(toggleAddUsersModal(false))


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        open={addUsersModal}
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
        <Fade in={addUsersModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="span">
                    Add people to channel
                </Box>
                <Box component="span" onClick={handleClose} sx={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </Box>
              </Box>
            </Typography>
            <UsersList />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddUsersToChannelModal;