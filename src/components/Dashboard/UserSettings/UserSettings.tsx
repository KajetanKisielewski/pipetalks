import React from "react";
import { Box, Typography, InputLabel, MenuItem, FormControl, Select, Button, FormControlLabel, Switch } from "@mui/material";

import { useFetch } from 'hooks'

const UserSettings = (): JSX.Element => {
    const [language, setLanguage] = React.useState('');
    const [additionalLanguage, setAdditionalLanguage ] = React.useState('');
    const [isTranslate, setIsTranslate] = React.useState(false);
    const [userImage, setUserImage] = React.useState(null);

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
      

    return (
        <Box component='div' sx={{ display: 'flex' , flexDirection: 'column', justifyContent: 'center' , alignItems: 'center', m: 5 }}>
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
                        <Button variant="contained" component="span" >
                            Change your profile picture
                        </Button>
                    </label> 
                </Box>


                <FormControl fullWidth sx={{ mt: 2, mb: 2 }} >
                    <InputLabel id="select__language--label">Select a transcription language</InputLabel>
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
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch onChange={ () => setIsTranslate(!isTranslate) } />
                    }
                    label={!isTranslate ? 'Turn on translation' : 'Turn off translation'}
                />

                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="select__additionalLanguage--label">Select a translation language</InputLabel>
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
                </FormControl>

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
