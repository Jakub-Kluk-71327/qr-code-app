import { AppState, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { CameraView } from 'expo-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Linking, StyleSheet } from 'react-native' 
import { Overlay } from './Overlay'
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

const Index = () => {

    const qrLock = useRef(false); //przechowywanie wartości, zmiana nie powoduje renderu, zmiana przez .current
    const appState = useRef(AppState.currentState);
    const isFocused = useIsFocused();

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if(appState.current.match(/inactive|background/) && nextAppState === "active") { //current match poprzedni stan, nextAppState obecny stan
                qrLock.current = false;
            }
            appState.current = nextAppState; //Zapamiętaj obecny stan jako poprzedni na przyszłość.
        });

        // w momenciu zamknięcia ekranu usuwamy listenera
        return () => {
            subscription.remove();  
        };
    }, []); //Pusta tablica zależności [] powoduje, że useEffect wykonuje się tylko raz po zamontowaniu komponentu.

    if (!isFocused) {
        return null;
    } 

    return(
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <CameraView style={StyleSheet.absoluteFillObject} facing='back' onBarcodeScanned={({data})=> {
                if( data && !qrLock.current) {
                    qrLock.current = true;
                    setTimeout(async () => { 
                        if(data.startsWith("https://")) {
                            Linking.openURL(data);

                        } else if (data.startsWith("http://")) {
                            Alert.alert(
                                "Niezabezpieczone połączenie",
                                "Adres nie używa bezpiecznego protokołu HTTPS. Czy na pewno chcesz kontynuować?",
                                [
                                    {
                                        text: "Anuluj",
                                        style: "cancel",
                                        onPress: () => setTimeout(() => {qrLock.current = false}, 5000)
                                    },
                                    {
                                        text: "Kontynuuj",
                                        onPress: () => Linking.openURL(data)
                                    }
                                ]
                            );
                        } else {
                            Alert.alert(
                                "Wykryto tekst",
                                data,
                                [
                                    {
                                        text: "Anuluj",
                                        style: "cancel",
                                        onPress: () => setTimeout(() => {qrLock.current = false}, 5000)
                                        
                                    },
                                    {
                                        text: "Skopiuj",
                                        onPress: async () => {
                                            await Clipboard.setStringAsync(data);
                                            Alert.alert("Sukces", "Tekst został skopiowany do schowka. ");
                                            setTimeout(() => {qrLock.current = false}, 5000);
                                        }
                                    }
                                ]
                            );
                        }
                        
                    }, 500); 
                }
            }}/>
            <Overlay/>
        </SafeAreaView>
    );
}

export default Index