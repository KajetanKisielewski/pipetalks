import React from "react";
import { Box, Typography, InputLabel, MenuItem, FormControl, Select, Button, FormControlLabel, Switch, styled } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery  from '@mui/material/useMediaQuery';

import { setUserSettingsView, setNavView } from 'reducers/CurrentContentReducer';
import { useAppDispatch, useFetch } from 'hooks';

const StyledFormControl = styled(FormControl)({
    '& label.Mui-focused': {
      color: '#ffffffb2',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#ffffffb2',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ffffffb2',
      },
      '&:hover fieldset': {
        borderColor: '#ffffffb2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#ffffffb2',
      },
    },
  });

const UserSettings = (): JSX.Element => {
    const [language, setLanguage] = React.useState('');
    const [additionalLanguage, setAdditionalLanguage ] = React.useState('');
    const [isTranslate, setIsTranslate] = React.useState(false);
    const [userImage, setUserImage] = React.useState(null);
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const { editUserSettings } = useFetch();

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files[0]; // pobierz pierwszy wybrany plik
        setUserImage(selectedImage)
    }

    const handleSaveChanges = () => {
        const settingsData = new FormData();

        settingsData.append('profile_image' , userImage);
        settingsData.append('language' , language);
        settingsData.append('auto_translate' , isTranslate.toString());
        settingsData.append('translate_language' , additionalLanguage);

        editUserSettings(settingsData);
    }

    const handleBackToPrevSection = (): void => {
        dispatch(setNavView(true))
        dispatch(setUserSettingsView(false))
    }

    return (
        <Box component='div' sx={{ display: 'flex' , flexDirection: 'column', justifyContent: 'center' , alignItems: 'center', mb: 5 }}>
            <Box sx={{ width: '100%', ml: 2, mb: 2 }}>
                <ArrowBackIcon onClick={handleBackToPrevSection} sx={{ display: isMobile ? 'block' : 'none', color: '#ffffffb2', mt: 2 }} />
            </Box>
            <Typography variant='h4'>
                Customize your settings
            </Typography>

            <Box>
                <Box sx={{ mt: 5, mb:2, textAlign: 'center' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload__image"
                        type="file"
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="upload__image">
                        <Button variant="contained" component="span" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.54)' }} >
                            Change your profile picture
                        </Button>
                    </label> 
                </Box>


                <StyledFormControl fullWidth sx={{ mt: 2, mb: 2 }} >
                    <InputLabel id="select__language--label" sx={{ color: '#ffffffb2' }} >
                        Select a transcription language
                    </InputLabel>
                    <Select
                        labelId="select__language--label"
                        id="select__language"
                        value={language}
                        label="Choose your default language"
                        onChange={(e) => setLanguage(e.target.value as string)}
                    >
                        <MenuItem value={'pl-PL'}>PL</MenuItem>
                        <MenuItem value={'en-US'}>EN</MenuItem>
                        <MenuItem value={'de-DE'}>DE</MenuItem>
                        <MenuItem value={'fr-FR'}>FR</MenuItem>
                        <MenuItem value={'es-ES'}>ES</MenuItem>
                    </Select>
                </StyledFormControl>

                <FormControlLabel
                    control={
                        <Switch onChange={ () => setIsTranslate(!isTranslate) } color='success'/>
                    }
                    label={!isTranslate ? 'Turn on translation' : 'Turn off translation'}
                />

                <StyledFormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="select__additionalLanguage--label" sx={{ color: '#ffffffb2' }} >
                        Select a translation language
                    </InputLabel>
                    <Select
                        labelId="select__additionalLanguage--label"
                        id="select__additionalLanguage"
                        value={additionalLanguage}
                        label="Select the language into which the transcript is to be translated"
                        onChange={(e) => setAdditionalLanguage(e.target.value as string)}
                    >
                        <MenuItem value={'pl-PL'}>PL</MenuItem>
                        <MenuItem value={'en-US'}>EN</MenuItem>
                        <MenuItem value={'de-DE'}>DE</MenuItem>
                        <MenuItem value={'fr-FR'}>FR</MenuItem>
                        <MenuItem value={'es-ES'}>ES</MenuItem>
                    </Select>
                </StyledFormControl>

                <Box sx={{ textAlign: 'center', mt: 5 }}>
                    <Button variant="contained" color="success" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Box>
            </Box>

        </Box>
    )
}

export default UserSettings;
