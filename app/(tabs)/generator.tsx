import { StyleSheet, Text, View, TextInput, Touchable, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const Generator = () => {
    const [inputValue, setInputValue] = React.useState("https://docs.expo.dev");//przechowuje stan, zmiana powoduje render, ma funkcję set
    const [qrValue, setQrValue] = React.useState(inputValue);
    
    const handleInputChange = (text: string) => {
        setInputValue(text);
        setQrValue('');
    };

    const generateQRCode = () => {
        if(inputValue.startsWith("https://")){
            setQrValue(inputValue);
        }  if (inputValue.startsWith("http://")) {
            Alert.alert(
                "Niezabezpieczone połączenie",
                "Adres nie używa bezpiecznego protokołu HTTPS. Czy na pewno chcesz kontynuować?",
                [
                    {
                        text: "Anuluj",
                        style: "cancel"
                    },
                    {
                        text: "Kontynuuj",
                        onPress: () => setQrValue(inputValue)
                    }
                ]
            );
        } else if(inputValue === "") {
            Alert.alert(
                "Błąd",
                "Pole nie może być puste"
            );
        } else {
            setQrValue(inputValue);
        }
        
    }

    return(
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>Wygeneruj własny {'\n'} kod QR</Text>

            <TextInput 
                style={styles.input} 
                placeholder="Enter text or URL" 
                autoCapitalize="none"
                onChangeText={handleInputChange}
                value={inputValue}
                />

            <TouchableOpacity onPress={generateQRCode} style={{backgroundColor: 'blue', padding: 10, borderRadius: 5, marginBottom: 20}}>
                <Text style={{color: 'white'}}>Generuj kod QR</Text>
            </TouchableOpacity>


            {qrValue ? (
                    <QRCode
                        value={qrValue}
                        size={200}
                        color='black'
                        backgroundColor='white'
                    />
                ) : (
                    <View style={{
                        width: 200,
                        height: 200,
                    }} />
                )}
        </SafeAreaView>
    );
}

export default Generator

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',   
        gap: 15,

    },
    input: {
        height:40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    title: {
        color: 'black',
        fontSize: 35,
        textAlign: 'center',
        
    },
});