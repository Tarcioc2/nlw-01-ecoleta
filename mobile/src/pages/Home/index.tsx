import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { RectButton } from 'react-native-gesture-handler';
import axios from 'axios';

interface IBGEUFResponse {
    sigla: string;
  }
  
  interface IBGECityResponse {
    nome: string;
  }


const Home = () =>{
    const [UFs, setUFs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const navigation = useNavigation();

    function handleNavigateToPoints() {
        const UF = selectedUF;
        const city = selectedCity;
    
        navigation.navigate('Points', {
          UF, city
        });
    }

    function handleSelectedUF(value: string) {
        const UF = value;
        setSelectedUF(UF);
        return UF;
    }

    function handleSelectedCity(value: string) {
        const city = value;
        setSelectedCity(city);
        return city;
    }

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
          .then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
    
            setUFs(ufInitials);
          })
      }, []);

      useEffect(() => {
        if (selectedUF === '') {
          return;
        }
    
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/microrregioes`)
          .then(response => {
            const cityNames = response.data.map(city => city.nome);
    
            setCities(cityNames);
          })
    
      }, [selectedUF]);


    
    return (
        <ImageBackground source={require('../../assets/home-background.png')}
                         style={styles.container} 
                         imageStyle={{ width: 274, height: 368 }}

                         >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')} />
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.input}>
                    <RNPickerSelect
                        onValueChange={(value: string) => handleSelectedUF(value)}
                        placeholder={{ label: "Selecione uma UF" }}
                        items={ 
                        UFs.map(uf => {
                            return ({
                            key: uf, label: uf, value: uf
                            });
                        })}
                    />
                </View>
                <View style={styles.input}>
                    <RNPickerSelect
                        onValueChange={(value: string) => handleSelectedCity(value)}
                        placeholder={{ label: "Selecione uma cidade" }}
                        items={ 
                        cities.map(city => {
                            return ({
                            key: city, label: city, value: city
                            });
                        })}
                    />
                </View>

                <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name='arrow-right' color='#FFF' size={24}/>
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>
                        Entrar
                    </Text>
                </RectButton>
            </View>


        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;