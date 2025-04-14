import ScreenContent from "components/ScreenContent";
import { Typo } from "components/Typo";
import { Image, TouchableOpacity, View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { signInWithGoogle } from "utils/googleOauth";
import { ensureBaseNotesFolder } from "utils/offlineDirectory/createDoraraFolder";
import { setUserUsagePref } from "utils/extra";

export default function OnboardingFirst() {
    
    const imageAnim = useRef(new Animated.Value(0)).current;
    const titleAnim = useRef(new Animated.Value(0)).current;
    const descAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        Animated.sequence([
            Animated.timing(imageAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(titleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(descAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <ScreenContent>
            <View className="flex-1 items-center justify-center">
                <Animated.View 
                    className="flex-1 items-center justify-start pt-10"
                    style={{
                        opacity: imageAnim,
                        transform: [{
                            scale: imageAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1]
                            })
                        }]
                    }}
                >
                    <Image 
                        source={require("../assets/puffHello.png")} 
                        className="w-96 h-96" 
                        resizeMode="contain" 
                    />
                    <Animated.View 
                        className="px-6"
                        style={{
                            opacity: titleAnim,
                            transform: [{
                                translateY: titleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0]
                                })
                            }]
                        }}
                    >
                        <Typo className="text-4xl font-bold text-center">
                            Welcome to{" "}
                            <Typo color="#f3a49d" className="text-5xl font-extrabold">
                                Dorara
                            </Typo>
                        </Typo>
                        
                        
                        <Animated.View
                            style={{
                                opacity: descAnim,
                                transform: [{
                                    translateY: descAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0]
                                    })
                                }]
                            }}
                        >
                            <Typo 
                                color="#949191" 
                                className="text-2xl mt-6 font-semibold text-center"
                            >
                                Manage your tasks, notes, expenses, and more — all with the help of Puff, your smart local assistant
                            </Typo>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>

                <Animated.View 
                    className="w-full px-6 pb-8"
                    style={{
                        opacity: buttonAnim,
                        transform: [{
                            translateY: buttonAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [30, 0]
                            })
                        }]
                    }}
                >
                    <Typo className="text-2xl font-bold text-center mb-8">
                        Choose how you want to start
                    </Typo>
                    <TouchableOpacity 
                        className="bg-[#f3a49d] rounded-xl px-6 py-4 mb-4"
                        activeOpacity={0.8}
                        onPress={() => {
                            setUserUsagePref('offline')
                            ensureBaseNotesFolder();
                        }}
                    >
                        <Typo color="#000" className="text-white text-lg text-center font-bold">
                            Continue Offline
                        </Typo>
                    </TouchableOpacity>
                    <View className="h-[1px] w-full bg-[#b3afaf] rounded-full mb-4" />
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#b3afaf",
                        }}
                        activeOpacity={0.8}
                        className="flex flex-row justify-between items-center rounded-xl px-24 py-4"
                        onPress={() => {
                            signInWithGoogle();
                        }}
                    >
                        <Typo color="#000" className="text-lg text-center font-bold">
                            Login with Google
                        </Typo>
                        <Image source={require('../assets/googleIcon.png')} className="w-8 h-8" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ScreenContent>
    );
}