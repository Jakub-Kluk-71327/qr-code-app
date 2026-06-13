import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
import { Link } from 'expo-router';


const Index = () => {

    const [permission, requestPermission] = useCameraPermissions(); //pobranie staniu uprawnień do aparatu
    const isPermissionGranted = Boolean(permission?.granted); //jeżeli permission.granted istnieje ustaw true lub false

    return(
        <SafeAreaView style={styles.container}> 
            <Image
                source={require('../../assets/images/main_logo.png')}
                style={{width: 240, height: 240}}
            />
            <Text style={styles.title}>SKANER KODÓW QR</Text>
            <View style={{gap: 30}}>

                <TouchableOpacity onPress={requestPermission}>
                    <Text style={[styles.button, {opacity:isPermissionGranted ? 0.5 : 1}]}>Zezwól na dostęp do kamery</Text>
                </TouchableOpacity>

                {/* Link służy do przenoszenia między ekranami. asChild określa, który komponent przejmuje obsługę kliknięcia użytkownika */}
                <Link href={'scanner'} asChild>
                    <TouchableOpacity disabled={!isPermissionGranted}>
                        <Text style={[styles.button, {opacity:isPermissionGranted ? 1 : 0.5}]}>Zeskanuj kod QR</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around', 
        paddingVertical: 80,  
    },
    title: {
        color: 'black',
        fontSize: 35,
    },
    button: {
        color: 'blue',
        fontSize: 20,
        textAlign: 'center',
    }
});