import React from 'react';
import { Backdrop, Box, Modal, Fade, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


import { toggleCreateDirectMessageModal } from 'reducers/DirectMessagesListReducer';
import { useAppSelector, useAppDispatch } from 'hooks';
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

const CreateDirectMessageModal = (): JSX.Element => {
    const { createDirectMessageModal } = useAppSelector((state) => state.directMessages);
    const dispatch = useAppDispatch();

    const handleClose = () => dispatch(toggleCreateDirectMessageModal(false))


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        open={createDirectMessageModal}
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
        <Fade in={createDirectMessageModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box component="span" sx={{ pr: 2 }}>
                    Create Direct Message Channel with:
                </Box>
                <Box component="span" onClick={handleClose} sx={{ cursor: 'pointer' }}>
                    <CloseIcon />
                </Box>
              </Box>
            </Typography>
            <UsersList isDM={true}/>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default CreateDirectMessageModal;
